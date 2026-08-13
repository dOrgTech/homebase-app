#!/usr/bin/env node
/*
 * Run a verified Homebase build locally.
 *
 * This script is the trust anchor of Homebase's decentralized distribution:
 * it reads the official release record from the on-chain release registry
 * (a Registry contract governed by a Homebase DAO), fetches the release
 * artifact from any mirror, verifies every file against the on-chain
 * fingerprint, and only then serves the app on localhost. Wallets work
 * normally on localhost origins.
 *
 * It has ZERO dependencies (Node 18+ built-ins only) precisely so that the
 * entire trusted surface fits in one auditable file. Read it before you
 * trust it; that is the point.
 *
 * Usage:
 *   node distribution/run.js --network shadownet --registry 0x... --key v6.0.0
 *   node distribution/run.js --artifact ./homebase-build.tar.gz --expected <sha256>
 *
 * Options:
 *   --network   mainnet | shadownet | <json-rpc url>     (chain mode)
 *   --registry  address of the release Registry contract (chain mode)
 *   --key       version key in the registry, e.g. v6.0.0 (chain mode)
 *   --artifact  url or local path of homebase-build.tar.gz
 *               (default: derived from the on-chain record's artifact field)
 *   --expected  expected BUILDHASH (offline mode, instead of chain lookup)
 *   --port      localhost port to serve on (default 8480)
 *
 * Exit codes: 0 serving stopped normally, 1 verification failed, 2 usage.
 */

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const zlib = require("zlib");

/* getRegistryValue(string) selector on the Registry contract deployed with
 * every Homebase EVM DAO (trustless-contracts Registry.sol). */
const REGISTRY_SELECTOR = "0x2e9c247b";

const RPC_URLS = {
  mainnet: "https://node.mainnet.etherlink.com",
  shadownet: "https://node.shadownet.etherlink.com",
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const m = argv[i].match(/^--([a-z]+)$/);
    if (!m || i + 1 >= argv.length) usage(`bad argument: ${argv[i]}`);
    args[m[1]] = argv[++i];
  }
  return args;
}

function usage(msg) {
  if (msg) console.error(`error: ${msg}\n`);
  console.error(
    "usage: node distribution/run.js --network <mainnet|shadownet|url> --registry <address> --key <version>\n" +
      "       node distribution/run.js --artifact <url|path> --expected <sha256>\n" +
      "       (--artifact, --port work in both modes)"
  );
  process.exit(2);
}

/* ---------- chain read (raw eth_call, no libraries) ---------- */

function abiEncodeStringArg(selector, s) {
  const b = Buffer.from(s, "utf8");
  const pad = (h, n) => h.padStart(n, "0");
  const data = b.toString("hex").padEnd(Math.ceil(b.length / 32) * 64, "0");
  return selector + pad("20", 64) + pad(b.length.toString(16), 64) + data;
}

function abiDecodeString(resultHex) {
  const raw = resultHex.replace(/^0x/, "");
  if (!raw) throw new Error("empty eth_call result (wrong address or no code)");
  const len = parseInt(raw.slice(64, 128), 16);
  return Buffer.from(raw.slice(128, 128 + len * 2), "hex").toString("utf8");
}

async function readRegistry(rpcUrl, registry, key) {
  const body = {
    jsonrpc: "2.0",
    method: "eth_call",
    params: [{ to: registry, data: abiEncodeStringArg(REGISTRY_SELECTOR, key) }, "latest"],
    id: 1,
  };
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.error) throw new Error(`eth_call failed: ${JSON.stringify(json.error)}`);
  const value = abiDecodeString(json.result);
  if (!value) throw new Error(`registry has no value for key "${key}"`);
  return JSON.parse(value);
}

/* ---------- artifact fetch ---------- */

async function fetchArtifact(source) {
  if (!/^https?:\/\//.test(source)) {
    console.log(`reading artifact from file: ${source}`);
    return fs.readFileSync(source);
  }
  console.log(`downloading artifact: ${source}`);
  const res = await fetch(source, { redirect: "follow" });
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status} for ${source}`);
  return Buffer.from(await res.arrayBuffer());
}

/* Derive a direct artifact URL from the registry record. The record's
 * artifact field conventionally points at the release page; the actual
 * asset lives under /releases/download/<tag>/homebase-build.tar.gz. */
function artifactUrlFromRecord(record, key) {
  const a = record.artifact || "";
  if (a.endsWith(".tar.gz")) return a;
  const m = a.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/releases\/tag\/([^/]+)$/);
  if (m) return `${m[1]}/releases/download/${m[2]}/homebase-build.tar.gz`;
  throw new Error(
    `cannot derive a download url from artifact field "${a}"; pass --artifact explicitly`
  );
}

/* ---------- tar extraction (POSIX ustar + GNU long names) ---------- */

function untar(buf) {
  const files = new Map();
  let off = 0;
  let pendingLongName = null;
  while (off + 512 <= buf.length) {
    const block = buf.subarray(off, off + 512);
    if (block.every((b) => b === 0)) break; // end-of-archive
    const nameRaw = block.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    const size = parseInt(block.subarray(124, 136).toString("utf8").replace(/\0.*$/, "").trim(), 8) || 0;
    const type = String.fromCharCode(block[156]);
    const prefix = block.subarray(345, 500).toString("utf8").replace(/\0.*$/, "");
    const dataStart = off + 512;
    const data = buf.subarray(dataStart, dataStart + size);
    let name = pendingLongName || (prefix ? `${prefix}/${nameRaw}` : nameRaw);
    pendingLongName = null;
    if (type === "L") {
      pendingLongName = data.toString("utf8").replace(/\0.*$/, "");
    } else if (type === "0" || type === "\0") {
      files.set(name, Buffer.from(data));
    } // directories ("5") and other types are irrelevant to verification
    off = dataStart + Math.ceil(size / 512) * 512;
  }
  return files;
}

/* ---------- verification (byte-exact replica of the build recipe) ---------- */

function computeBuildhash(files) {
  // Replicates: find build -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum
  const paths = [...files.keys()].sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
  let manifest = "";
  for (const p of paths) {
    const h = crypto.createHash("sha256").update(files.get(p)).digest("hex");
    manifest += `${h}  ${p}\n`;
  }
  const buildhash = crypto.createHash("sha256").update(manifest, "utf8").digest("hex");
  return { buildhash, manifest, fileCount: paths.length };
}

/* ---------- localhost server ---------- */

const MIME = {
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  ico: "image/x-icon",
  txt: "text/plain; charset=utf-8",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  webp: "image/webp",
  mp4: "video/mp4",
  wasm: "application/wasm",
};

function serve(files, port) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let key = `build${urlPath === "/" ? "/index.html" : urlPath}`;
    if (!files.has(key)) key = "build/index.html"; // SPA fallback
    const body = files.get(key);
    const ext = key.split(".").pop().toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": "no-store",
    });
    res.end(body);
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`\nserving the VERIFIED build at  http://localhost:${port}\n`);
    console.log("every byte served was checked against the release fingerprint.");
    console.log("stop with Ctrl+C.");
  });
}

/* ---------- main ---------- */

(async () => {
  const args = parseArgs(process.argv);
  const port = parseInt(args.port || "8480", 10);

  let expected = args.expected;
  let artifactSource = args.artifact;
  let record = null;

  if (!expected) {
    if (!args.network || !args.registry || !args.key) {
      usage("chain mode needs --network, --registry and --key (or use --expected for offline mode)");
    }
    const rpcUrl = RPC_URLS[args.network] || (args.network.startsWith("http") ? args.network : null);
    if (!rpcUrl) usage(`unknown network "${args.network}"`);
    console.log(`reading release record "${args.key}" from registry ${args.registry} (${args.network})`);
    record = await readRegistry(rpcUrl, args.registry, args.key);
    console.log(`on-chain record: ${JSON.stringify(record)}`);
    if (!record.buildhash || !/^[0-9a-f]{64}$/.test(record.buildhash)) {
      throw new Error(`on-chain record has no valid buildhash (got "${record.buildhash}")`);
    }
    expected = record.buildhash;
    if (!artifactSource) artifactSource = artifactUrlFromRecord(record, args.key);
  } else if (!artifactSource) {
    usage("offline mode needs --artifact along with --expected");
  }

  const artifact = await fetchArtifact(artifactSource);
  console.log(`artifact: ${(artifact.length / 1024 / 1024).toFixed(1)} MiB, extracting...`);
  const files = untar(zlib.gunzipSync(artifact));
  const { buildhash, fileCount } = computeBuildhash(files);
  console.log(`verified ${fileCount} files`);
  console.log(`expected: ${expected}`);
  console.log(`actual:   ${buildhash}`);

  if (buildhash !== expected) {
    console.error("\nMISMATCH: this artifact is NOT the attested build. Refusing to serve it.");
    process.exit(1);
  }
  console.log("MATCH: artifact is exactly the attested build.");
  serve(files, port);
})().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
