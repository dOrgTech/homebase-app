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

# Verify a release against the ON-CHAIN registry (trustless: commit + hash
# are read from the release-registry contract, then rebuilt and compared)
distribution/verify.sh --registry <mainnet|shadownet> <registry-address> <version-key>
```

`BUILDHASH` is the sha256 over the sorted per-file sha256s of `build/`
(`BUILDMANIFEST` holds the per-file list, so any mismatch can be localized
to the exact file).

## Release flow

Pushing a `v*` tag triggers `.github/workflows/reproducible-build.yml`,
which builds, **rebuilds from scratch and fails unless both hashes match**,
then publishes the artifact, `BUILDHASH.txt`, and the manifest on the
GitHub Release.

## On-chain release registry

Releases are recorded in the Registry contract of a Homebase EVM DAO (the
app's own audited governance stack — the release process dogfoods the
product). Each approved release is a registry entry: key `vX.Y.Z`, value
`{"commit":"<sha>","buildhash":"<sha256>","artifact":"<url>"}`. Entries only
change through a governance proposal (propose → vote → timelock → execute),
so "the official build" is a DAO decision, not a hosting-account setting.
`verify.sh --registry` closes the loop: on-chain record → source commit →
reproducible rebuild → hash comparison, with no trusted intermediary.

Current registries:

| Network | DAO | Registry | Status |
|---|---|---|---|
| Shadownet | `0xEeDCa7F405210cBCB4E63a67F18e974c821F4Ca1` ("Homebase Distribution (Rehearsal)") | `0x2A847c27663aB55aa36387c4Ce719789e3bc8cE9` | rehearsal, live |
| Mainnet | — | — | planned |

## Boundaries (honest ones)

- `env.build` must never contain a secret. A browser bundle cannot keep
  secrets; anything here is public the moment the app ships.
- Reproducibility certifies the *bundle*, not the *services* it talks to —
  the app still depends on the indexer/API endpoints listed in `env.build`.
- The hosted deployment (Netlify) builds separately and is not expected to
  match `BUILDHASH`; verifiable distribution channels (content-addressed
  mirrors) are the next phase and will serve exactly the fingerprinted
  artifact.
