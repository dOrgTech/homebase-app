# Verifiable builds

This directory makes Homebase releases **reproducible**: the same git ref
always produces a byte-identical bundle, on any machine. That turns "the
deployed app matches the public source" from a promise into a check.

**Why it matters here:** for a governance platform, control of the frontend
is a governance question — a tampered bundle can misrepresent what users
sign, without any trace in the source repository. Reproducibility is the
foundation for distributing Homebase through channels that don't require
trusting any single host or maintainer (content-addressed hosting, release
registries, independent build attestation). It runs **in parallel** with the
existing hosted deployment, which continues unchanged.

## How determinism is achieved

| Leak | Fix |
|---|---|
| Toolchain drift (node/yarn versions) | Builder image pinned by **digest** in `Dockerfile.build` (node 22.12.0, matching `.nvmrc`) |
| Machine paths in output | Build always runs at `/app` inside the container; source maps disabled for the artifact |
| Timestamps | `SOURCE_DATE_EPOCH` = the commit's timestamp; `gzip -n`; fixed tar mtimes |
| Uncommitted/untracked files | Docker context is `git archive <ref>` — only committed code can enter a build |
| Environment variance | `env.build` is the canonical, committed, public-only production env — the only `.env` a verifiable build sees |

## Usage

```bash
# Build the current commit; artifact + fingerprint land in distribution/out/
distribution/build.sh

# Verify a release against its published hash (from the GitHub Release page)
distribution/verify.sh v1.2.3 <expected-sha256>
```

`BUILDHASH` is the sha256 over the sorted per-file sha256s of `build/`
(`BUILDMANIFEST` holds the per-file list, so any mismatch can be localized
to the exact file).

## Release flow

Pushing a `v*` tag triggers `.github/workflows/reproducible-build.yml`,
which builds, **rebuilds from scratch and fails unless both hashes match**,
then publishes the artifact, `BUILDHASH.txt`, and the manifest on the
GitHub Release.

## Boundaries (honest ones)

- `env.build` must never contain a secret. A browser bundle cannot keep
  secrets; anything here is public the moment the app ships.
- Reproducibility certifies the *bundle*, not the *services* it talks to —
  the app still depends on the indexer/API endpoints listed in `env.build`.
- The hosted deployment (Netlify) builds separately and is not expected to
  match `BUILDHASH`; verifiable distribution channels (content-addressed
  mirrors) are the next phase and will serve exactly the fingerprinted
  artifact.
