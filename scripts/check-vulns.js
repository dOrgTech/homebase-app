#!/usr/bin/env node
/**
 * Deterministic dependency vulnerability check against OSV.dev.
 *
 * Parses yarn.lock (v1) and cross-references every locked package@version
 * against the OSV database (https://osv.dev), which aggregates GitHub
 * Security Advisories / CVEs for the npm ecosystem. Replaces `yarn audit`,
 * whose registry endpoint was retired.
 *
 * Usage:
 *   node scripts/check-vulns.js [--level=low|moderate|high|critical] [--json]
 *
 * Exits 1 if any vulnerability at or above --level (default: high) is found.
 */
const fs = require("fs")
const path = require("path")

const OSV_BATCH_URL = "https://api.osv.dev/v1/querybatch"
const OSV_VULN_URL = "https://api.osv.dev/v1/vulns/"
const BATCH_SIZE = 1000
const SEVERITY_ORDER = { low: 0, moderate: 1, high: 2, critical: 3 }

function parseArgs() {
  const args = { level: "high", json: false }
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--level=")) args.level = a.split("=")[1].toLowerCase()
    else if (a === "--json") args.json = true
  }
  if (!(args.level in SEVERITY_ORDER)) {
    console.error(`Unknown --level "${args.level}" (use low|moderate|high|critical)`)
    process.exit(2)
  }
  return args
}

/** Parse yarn.lock v1 into a unique set of { name, version }. */
function parseYarnLock(lockPath) {
  const text = fs.readFileSync(lockPath, "utf8")
  const packages = new Map()
  let currentNames = null
  for (const line of text.split("\n")) {
    if (line.startsWith("#") || line.trim() === "") continue
    if (!line.startsWith(" ")) {
      // Header line: one or more comma-separated "name@range" specs (possibly quoted)
      currentNames = new Set(
        line
          .replace(/:\s*$/, "")
          .split(",")
          .map(spec => {
            const s = spec.trim().replace(/^"|"$/g, "")
            return s.slice(0, s.lastIndexOf("@")) // strip range, keep scoped names intact
          })
      )
    } else if (currentNames && line.trim().startsWith("version ")) {
      const version = line.trim().slice("version ".length).replace(/"/g, "")
      for (const name of currentNames) {
        packages.set(`${name}@${version}`, { name, version })
      }
    }
  }
  return [...packages.values()]
}

/** Map OSV severity info to npm-style levels. */
function severityLevel(vuln) {
  const dbSeverity = (vuln.database_specific && vuln.database_specific.severity) || ""
  if (dbSeverity) {
    const s = dbSeverity.toLowerCase()
    if (s in SEVERITY_ORDER) return s
    if (s === "medium") return "moderate"
  }
  const cvss = (vuln.severity || []).find(s => s.type.startsWith("CVSS"))
  if (cvss) {
    const score = parseFloat(String(cvss.score).match(/[\d.]+$/) ? cvss.score : "") // score may be a vector string
    if (!isNaN(score)) {
      if (score >= 9) return "critical"
      if (score >= 7) return "high"
      if (score >= 4) return "moderate"
      return "low"
    }
  }
  return "moderate" // unknown severity: don't silently downgrade to low
}

function fixedVersions(vuln, pkgName) {
  const fixes = new Set()
  for (const affected of vuln.affected || []) {
    if (affected.package && affected.package.name !== pkgName) continue
    for (const range of affected.ranges || []) {
      for (const event of range.events || []) {
        if (event.fixed) fixes.add(event.fixed)
      }
    }
  }
  return [...fixes]
}

async function postBatch(queries) {
  const res = await fetch(OSV_BATCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queries })
  })
  if (!res.ok) throw new Error(`OSV batch query failed: HTTP ${res.status}`)
  return res.json()
}

async function getVuln(id) {
  const res = await fetch(OSV_VULN_URL + id)
  if (!res.ok) throw new Error(`OSV vuln fetch failed for ${id}: HTTP ${res.status}`)
  return res.json()
}

async function main() {
  const args = parseArgs()
  const lockPath = path.join(__dirname, "..", "yarn.lock")
  const packages = parseYarnLock(lockPath)
  if (!args.json) console.error(`Checking ${packages.length} locked packages against OSV.dev ...`)

  // Batch-query OSV: returns vuln IDs per package
  const hits = [] // { name, version, ids: [] }
  for (let i = 0; i < packages.length; i += BATCH_SIZE) {
    const chunk = packages.slice(i, i + BATCH_SIZE)
    const { results } = await postBatch(
      chunk.map(p => ({ package: { name: p.name, ecosystem: "npm" }, version: p.version }))
    )
    results.forEach((r, idx) => {
      if (r.vulns && r.vulns.length) {
        hits.push({ ...chunk[idx], ids: r.vulns.map(v => v.id) })
      }
    })
  }

  // Fetch details once per unique vuln id (severity, summary, fixed range)
  const uniqueIds = [...new Set(hits.flatMap(h => h.ids))]
  const details = new Map()
  for (const id of uniqueIds) details.set(id, await getVuln(id))

  const findings = hits.map(h => ({
    package: h.name,
    version: h.version,
    vulns: h.ids.map(id => {
      const v = details.get(id)
      return {
        id,
        aliases: v.aliases || [],
        severity: severityLevel(v),
        summary: v.summary || (v.details || "").split("\n")[0],
        fixed: fixedVersions(v, h.name)
      }
    })
  }))

  const threshold = SEVERITY_ORDER[args.level]
  const actionable = findings
    .map(f => ({ ...f, vulns: f.vulns.filter(v => SEVERITY_ORDER[v.severity] >= threshold) }))
    .filter(f => f.vulns.length)

  if (args.json) {
    console.log(JSON.stringify({ checked: packages.length, findings, actionable }, null, 2))
  } else {
    for (const f of findings) {
      for (const v of f.vulns) {
        const flag = SEVERITY_ORDER[v.severity] >= threshold ? "!!" : "  "
        console.log(
          `${flag} [${v.severity.toUpperCase().padEnd(8)}] ${f.package}@${f.version} — ${v.id}` +
            `${v.aliases.length ? ` (${v.aliases.join(", ")})` : ""}` +
            `${v.fixed.length ? ` fixed in: ${v.fixed.join(", ")}` : ""}\n     ${v.summary}`
        )
      }
    }
    console.log(
      `\n${findings.length} vulnerable package version(s), ` +
        `${actionable.length} at or above "${args.level}".`
    )
  }
  process.exit(actionable.length ? 1 : 0)
}

main().catch(err => {
  console.error(err.message)
  process.exit(2)
})
