#!/usr/bin/env bash
# Verifiable production build.
#
# Builds ONLY committed code: the Docker context is `git archive HEAD`, so
# uncommitted changes and untracked files cannot enter the artifact. The
# environment is fully pinned by distribution/Dockerfile.build.
#
# Usage:  distribution/build.sh [--no-cache] [git-ref]
#   git-ref defaults to HEAD. Output lands in distribution/out/:
#     build/                 the deployable bundle
#     homebase-build.tar.gz  deterministic tarball of build/
#     BUILDHASH              sha256 fingerprint of the bundle
#     BUILDMANIFEST          per-file sha256s (for pinpointing any mismatch)
set -euo pipefail

NO_CACHE=""
REF="HEAD"
for arg in "$@"; do
  case "$arg" in
    --no-cache) NO_CACHE="--no-cache" ;;
    *) REF="$arg" ;;
  esac
done

cd "$(git rev-parse --show-toplevel)"

# Commit timestamp of the ref being built — the only "time" the build sees.
SDE="$(git log -1 --format=%ct "$REF")"
COMMIT="$(git rev-parse "$REF")"

echo "Building $REF ($COMMIT, SOURCE_DATE_EPOCH=$SDE)"

git archive --format=tar "$REF" | docker build $NO_CACHE \
  -f distribution/Dockerfile.build \
  --build-arg SOURCE_DATE_EPOCH="$SDE" \
  -t homebase-verifiable-build:latest \
  -

cid="$(docker create homebase-verifiable-build:latest true)"
trap 'docker rm -f "$cid" >/dev/null' EXIT
rm -rf distribution/out
mkdir -p distribution/out
docker cp "$cid":/app/build distribution/out/build
docker cp "$cid":/app/homebase-build.tar.gz distribution/out/
docker cp "$cid":/app/BUILDHASH distribution/out/
docker cp "$cid":/app/BUILDMANIFEST distribution/out/

echo "commit:    $COMMIT"
echo "BUILDHASH: $(cat distribution/out/BUILDHASH)"
