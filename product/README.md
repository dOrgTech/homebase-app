# Product research & metrics

Product-level research and the deterministic data pipeline behind it — the layer above the codebase: who actually uses Homebase, how usage trends, and how big the addressable market is.

## Research

- [2026-07-16 — DAO denominator census](research/2026-07-16-denominator-census.md): full usage classification of every mainnet DAO across all three data rails (L1 offchain, L1 baseDAO, Etherlink), plus market sizing of token communities on Etherlink (Blockscout) and Tezos L1 (TzKT). Includes data-quality findings (test-data pollution, a dead indexer endpoint, a mixed-units timestamp field) discovered along the way.

## Scripts

Read-only census scripts, re-runnable to refresh the numbers:

| Script | Rail | Credentials |
|---|---|---|
| `scripts/mongo-census.js` | L1 offchain (lite DAOs / polls) | `ATLAS_URI` env var |
| `scripts/firestore-census.js` | Etherlink DAOs | local `firebase login` |

The L1 baseDAO rail needs no script or credentials — the public Hasura endpoint (`v3-homebase-indexer.tezos-homebase.io`) serves the queries documented in the census report. Credentials are never stored in this repository.
