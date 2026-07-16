#!/usr/bin/env bash
# Independently verify a Homebase release.
#
# Rebuilds the given git ref from source in the pinned environment and
# compares the resulting fingerprint against an expected hash (e.g. the
# BUILDHASH published on the GitHub Release, or — in later phases — the
# hash recorded in the on-chain release registry).
#
# Usage:  distribution/verify.sh <git-ref> <expected-sha256>
#
# Exit codes: 0 = MATCH (the source provably produces the published bundle)
#             1 = MISMATCH (investigate: toolchain drift or tampering)
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "usage: $0 <git-ref> <expected-sha256>" >&2
  exit 2
fi
REF="$1"
EXPECTED="$2"

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
