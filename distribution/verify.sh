#!/usr/bin/env bash
# Independently verify a Homebase release.
#
# Two modes:
#
# 1) Against a hash you already trust (e.g. from the GitHub Release):
#      distribution/verify.sh <git-ref> <expected-sha256>
#
# 2) Against the on-chain release registry (trustless — the expected hash
#    and the source commit are read from an Etherlink registry contract
#    governed by the Homebase Distribution DAO):
#      distribution/verify.sh --registry <network> <registry-address> <version-key>
#    e.g.
#      distribution/verify.sh --registry shadownet 0x2A847c27663aB55aa36387c4Ce719789e3bc8cE9 v6.0.0-rc-rehearsal
#
#    <network> is mainnet | shadownet, or a full JSON-RPC URL.
#    The registry value must be JSON: {"commit":"<sha>","buildhash":"<sha256>",...}
#    The build is then made from that exact commit and compared to that hash,
#    so a MATCH proves: on-chain record -> source -> bundle, end to end.
#
# Exit codes: 0 = MATCH (the source provably produces the published bundle)
#             1 = MISMATCH (investigate: toolchain drift or tampering)
#             2 = usage / lookup error
set -euo pipefail

# getRegistryValue(string) on the Registry contract deployed with every
# Homebase EVM DAO (trustless-contracts Registry.sol).
REGISTRY_SELECTOR="0x2e9c247b"

rpc_url_for() {
  case "$1" in
    mainnet)   echo "https://node.mainnet.etherlink.com" ;;
    shadownet) echo "https://node.shadownet.etherlink.com" ;;
    http*)     echo "$1" ;;
    *)         echo "unknown network '$1' (use mainnet, shadownet, or a URL)" >&2; return 2 ;;
  esac
}

read_registry() { # <rpc-url> <registry-address> <key>  -> prints value string
  RPC_URL="$1" REG_ADDR="$2" REG_KEY="$3" SELECTOR="$REGISTRY_SELECTOR" python3 - <<'PYEOF'
import json, os, sys, urllib.request

rpc, addr, key, sel = (os.environ[v] for v in ("RPC_URL", "REG_ADDR", "REG_KEY", "SELECTOR"))
kb = key.encode()
padded = kb.hex().ljust(((len(kb) + 31) // 32) * 64, "0")
data = sel + f"{32:064x}" + f"{len(kb):064x}" + padded
req = {"jsonrpc": "2.0", "method": "eth_call",
       "params": [{"to": addr, "data": data}, "latest"], "id": 1}
resp = json.loads(urllib.request.urlopen(
    urllib.request.Request(rpc, json.dumps(req).encode(),
                           {"Content-Type": "application/json"}), timeout=30).read())
if "error" in resp:
    sys.exit(f"eth_call failed: {resp['error']}")
raw = resp["result"][2:]
if not raw:
    sys.exit("empty eth_call result — wrong address or no code")
length = int(raw[64:128], 16)
value = bytes.fromhex(raw[128:128 + length * 2]).decode()
if not value:
    sys.exit("registry returned an empty value for this key")
print(value)
PYEOF
}

if [ "${1:-}" = "--registry" ]; then
  if [ $# -ne 4 ]; then
    echo "usage: $0 --registry <network|rpc-url> <registry-address> <version-key>" >&2
    exit 2
  fi
  RPC="$(rpc_url_for "$2")"
  echo "reading key '$4' from registry $3 ..."
  VALUE="$(read_registry "$RPC" "$3" "$4")"
  echo "on-chain record: $VALUE"
  REF="$(echo "$VALUE" | python3 -c 'import json,sys; print(json.load(sys.stdin)["commit"])')"
  EXPECTED="$(echo "$VALUE" | python3 -c 'import json,sys; print(json.load(sys.stdin)["buildhash"])')"
  echo "commit:   $REF"
elif [ $# -eq 2 ]; then
  REF="$1"
  EXPECTED="$2"
else
  echo "usage: $0 <git-ref> <expected-sha256>" >&2
  echo "       $0 --registry <network|rpc-url> <registry-address> <version-key>" >&2
  exit 2
fi

"$(dirname "$0")/build.sh" --no-cache "$REF"

ACTUAL="$(cat "$(git rev-parse --show-toplevel)/distribution/out/BUILDHASH")"

echo
echo "expected: $EXPECTED"
echo "actual:   $ACTUAL"
if [ "$ACTUAL" = "$EXPECTED" ]; then
  echo "MATCH — the published bundle is exactly this source."
else
  echo "MISMATCH — do not trust the published bundle until explained." >&2
  echo "Compare distribution/out/BUILDMANIFEST against the published one to locate differing files." >&2
  exit 1
fi
