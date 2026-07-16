# Homebase DAO Market-Sizing Census

Date run: 2026-07-16. Read-only census across three Homebase data stores plus two external explorer APIs. The census is reproducible with the deterministic scripts in `../scripts/` (operator credentials required for the Mongo and Firestore rails; the Hasura, Blockscout and TzKT rails are public APIs). Raw JSON pulls available on request.

Classification rule used everywhere unless noted: **active** = ≥2 lifetime governance actions (poll/proposal) AND most recent one within the last 6 months (since ~2026-01-15); **dormant** = ≥2 lifetime actions but none in the last 6 months; **drive-by** = 0 or 1 lifetime actions ever (never built a governance habit).

---

## Part A — Existing DAOs across the three rails

### A1. L1 offchain ("lite") DAOs — MongoDB Atlas `Lite` DB

Source: `DAOs` (520 docs), `Polls` (704 docs), `Choices` (1,732 docs), joined on `Polls.daoID -> DAOs._id` and `Choices.pollID -> Polls._id`. Unique voters counted via `Choices.walletAddresses[].address` dedup per DAO.

**Data-quality note (fixed during this run):** `Polls.startTime` is stored inconsistently — some rows are Unix **seconds** (10-digit), others are already Unix **milliseconds** (13-digit), with no schema flag distinguishing them. The census script auto-detects by magnitude (`n < 1e12 ? seconds : ms`). An earlier pass that blindly treated all values as seconds produced garbage dates (years in the 50,000s) and therefore wrong "active" classifications — worth flagging to anyone else querying this collection.

Network breakdown (all 520 DAOs):

| network | count |
|---|---|
| ghostnet (testnet) | 431 |
| mainnet | 43 |
| etherlink_testnet | 17 |
| etherlink_mainnet | 7 (superseded by the dedicated Firestore store, see A3 note) |
| undefined/missing | 20 |
| shadownet | 2 |

**Mainnet-only classification (43 DAOs):**

| class | count |
|---|---|
| active | 4 |
| dormant | 7 |
| drive-by | 32 |
| **Total mainnet** | **43** |

Of the 32 drive-by, 24 have literally zero polls ever created; 8 have exactly one.

**All 43 mainnet lite DAOs, sorted by lifetime poll count** (name, created, polls, last activity, unique voters, class):

| Name | Created | Polls | Last activity | Unique voters | Class |
|---|---|---|---|---|---|
| Tezos Domains | 2023-10-23 | 25 | 2025-05-22 | 78 | dormant |
| Autonet | 2023-07-21 | 15 | 2026-07-08 | 1 | active |
| fsdfsdfds | 2025-11-18 | 11 | 2026-01-13 | 1 | dormant |
| Tezos Ecosystem | 2023-08-30 | 8 | 2026-03-23 | 122 | active |
| zzz'"\<iframe/src=javascript:alert(1)>\</iframe> | 2026-01-17 | 6 | 2026-03-10 | 0 | active |
| zzz'"\<p> | 2025-11-18 | 5 | 2025-11-30 | 1 | dormant |
| Autonet (2nd deploy) | 2022-12-26 | 2 | 2023-07-21 | 0 | dormant |
| Sigma Founder DAO | 2023-06-22 | 2 | 2023-06-22 | 2 | dormant |
| DOGAMÍ A.L.L.I.E.S | 2024-11-20 | 2 | 2025-01-17 | 130 | dormant |
| CX DAO | 2025-09-11 | 2 | 2025-09-11 | 1 | dormant |
| zzz'"\<iframe...> (2nd deploy) | 2026-01-17 | 2 | 2026-02-25 | 0 | active |
| NaTaS Network | 2022-12-31 | 1 | 2023-11-19 | 2 | drive-by |
| DSAA | 2023-01-15 | 1 | 2023-02-11 | 0 | drive-by |
| DAO prueba CAI | 2023-09-17 | 1 | 2023-09-17 | 0 | drive-by |
| Will's DAO | 2023-10-12 | 1 | 2023-10-12 | 1 | drive-by |
| Tezos Perth community | 2024-02-28 | 1 | 2024-02-28 | 1 | drive-by |
| TORTOZES | 2024-03-22 | 1 | 2024-03-23 | 15 | drive-by |
| Global Government | 2025-01-16 | 1 | 2025-02-01 | 2 | drive-by |
| XAI DAO | 2025-10-07 | 1 | 2025-10-07 | 0 | drive-by |
| CryptoPhunksV6 | 2022-12-14 | 0 | none | 0 | drive-by |
| TestDec | 2023-01-15 | 0 | none | 0 | drive-by |
| Trini DAO | 2023-06-01 | 0 | none | 0 | drive-by |
| SIGMA FOUNDER DAO (dup) | 2023-06-13 | 0 | none | 0 | drive-by |
| Sigma Founder DAO (dup) | 2023-06-13 | 0 | none | 0 | drive-by |
| Sigma Founder DAO (dup) | 2023-06-15 | 0 | none | 0 | drive-by |
| PFFAC.US | 2023-06-21 | 0 | none | 0 | drive-by |
| TezosPerth DAO | 2023-07-05 | 0 | none | 0 | drive-by |
| Dicey DAO | 2023-07-21 | 0 | none | 0 | drive-by |
| DAO prueba CAB | 2023-09-25 | 0 | none | 0 | drive-by |
| Real DAO | 2023-10-12 | 0 | none | 0 | drive-by |
| Rebel DAO | 2023-12-14 | 0 | none | 0 | drive-by |
| Boredboysclub | 2023-12-21 | 0 | none | 0 | drive-by |
| MEK DAO | 2023-12-28 | 0 | none | 0 | drive-by |
| The Raft DAO | 2023-12-30 | 0 | none | 0 | drive-by |
| SEED | 2024-01-05 | 0 | none | 0 | drive-by |
| Test | 2024-03-29 | 0 | none | 0 | drive-by |
| TEZINU DAO | 2024-04-28 | 0 | none | 0 | drive-by |
| Z | 2024-07-27 | 0 | none | 0 | drive-by |
| Oceania | 2025-05-06 | 0 | none | 0 | drive-by |
| Optik | 2025-05-06 | 0 | none | 0 | drive-by |
| XAI Lite | 2025-10-07 | 0 | none | 0 | drive-by |
| StorryTV | 2026-01-12 | 0 | none | 0 | drive-by |
| zzz'"\<a href=javascript:alert(1)>1\</a> | 2026-01-13 | 0 | none | 0 | drive-by |

**Anomaly:** several "active" entries are literally XSS-payload names (`zzz'"<iframe/src=javascript:alert(1)></iframe>`, `zzz'"<p>`) — these are security/fuzz-testing artifacts, not real organizations, despite technically satisfying the activity threshold. Recommend excluding name-pattern matches (`^zzz`, contains `<`/`javascript:`) from any headline count. After excluding those: **active drops from 4 to 2** (Autonet, Tezos Ecosystem — both real, recognizable Tezos ecosystem projects), and total "real" mainnet lite DAOs with any credible governance activity is closer to ~9-10 (2 active + up to 5 dormant, excluding the fuzz-test dormant entries too).

Also note "Sigma Founder DAO" appears 8 times across the lite DB and Hasura data (see A2) — almost certainly one team repeatedly redeploying/testing, not 8 distinct organizations.

---

### A2. L1 onchain (baseDAO) — Hasura/GraphQL indexer

Endpoint: `https://v3-homebase-indexer.tezos-homebase.io/v1/graphql` (the same indexer the frontend queries). Its unauthenticated role exposes the read queries used here, so the census needs no credentials on this rail.

**V2 endpoint is dead.** `REACT_APP_HASURA_URL_V2=https://v2-homebase-indexer.w3api.dev/v1/graphql` — DNS lookup for `v2-homebase-indexer.w3api.dev` returns `Non-existent domain`. The `w3api.dev` domain itself appears abandoned/expired. This means any "V2 baseDAO" deployments (if that indexer tracked a materially different DAO population) are **currently unqueryable** — a genuine coverage gap, not a data finding. `v2.tezos-homebase.io` (the frontend, not the indexer) still resolves and returns HTTP 200, so the V2 *app* may still be reachable even though its backing indexer is not — worth a manual check outside this census.

Query used: `daos(where: {network: {_eq: $network}})` pulling `address, name, network, start_level, ledgers_aggregate.count (≈holders), proposals_aggregate.count, proposals(order_by desc, limit 1) for last-activity, token{symbol,name,supply,decimals}`.

Networks queried: mainnet, ghostnet, shadownet, hangzhounet, kathmandunet, limanet (last three: 0 rows — likely fully deprecated testnets no longer indexed).

| network | DAO count |
|---|---|
| mainnet | 44 |
| ghostnet | 10 |
| shadownet | 9 |

**Mainnet classification (44 DAOs, all unique addresses — no address-level duplicates):**

| class | count |
|---|---|
| active | 3 |
| dormant | 6 |
| drive-by | 35 |
| **Total mainnet** | **44** |

**Name-level duplication:** "Sigma Founder DAO" appears **8 times** at 8 different contract addresses (same team redeploying/testing repeatedly — this is the same group visible in the Mongo lite data). "zzz'\"\<p\>" (an XSS-payload name) appears 3 times.

**All 44 mainnet onchain DAOs, sorted by lifetime proposal count** (name, address, proposals, holders/ledger entries, last proposal, token symbol, class):

| Name | Address | Proposals | Holders | Last proposal | Token | Class |
|---|---|---|---|---|---|---|
| Autonet | KT1PmvK7cYXYZwU5crbeubZ5RJ2jbnAFc78x | 13 | 2 | 2026-03-29 | THS | active |
| Tezos Pepe DAO | KT1LyPqdRVBFdQvhjyybG5osRCXnGSrk15M5 | 12 | 96 | 2025-02-14 | PEPE | dormant |
| Tezos Ecosystem | KT1VA5SvdE9AU41GY4u7ik5WkTi1pMU4PiTz | 12 | 7 | 2026-04-14 | TED | active |
| Humanitez | KT1PY9PXm8NMAgSEZg7bUtFjmV2Sj64bKuVV | 8 | 22 | 2023-10-17 | HUMAN | dormant |
| zzz'"\<p\> | KT1GXucjLP1k4XmnfvtD5Kdo3gtZj6mM2o9m | 8 | 1 | 2025-12-10 | test7 | dormant |
| zzz'"\<p\> (dup) | KT1HodmWJDMNHfjWzaLbqckQA3YAPEZ6NA5h | 5 | 1 | 2026-01-20 | test7 | active |
| Trini DAO | KT1Pe6jMadqzrGmkJA1ajEzjyV7fcxQeVqrd | 3 | 2 | 2023-06-15 | TT | dormant |
| Rebel DAO | KT1Ft4FyY8GGFYbAtxSX9mKNuSyQYRQSYfCe | 2 | 17 | 2024-01-13 | REBEL | dormant |
| Sigma Founder DAO | KT1FNJb3Fhp7K67HDbm5wU1o5r4CQTEYc6wq | 2 | 1 | 2023-06-16 | SFDT | dormant |
| Sigma Founder DAO (dup) | KT1DvaTxPQ392hdaeCGzBJb9pmDohvZPZYEd | 1 | 1 | 2023-06-23 | SFDT | drive-by |
| The Raft DAO | KT1XduPL2NXnoHfybQde4zjx21cTNtvEpqsW | 1 | 4 | 2024-01-03 | OTTEZ | drive-by |
| Oceania | KT1QRc7nPhXPVfzZ1Fb33PAcvnjJyXya2Tty | 1 | 1 | 2025-05-06 | OCN | drive-by |
| T4qDAO | KT1G8qw9AmzBn33zHQMB4a8gaqoqGkBEeXe4 | 1 | 1 | 2025-11-21 | AKX | drive-by |
| Optik | KT1MH4CJWShYNq53iF6f17FbGH2Pe7qAwHMn | 1 | 1 | 2025-05-06 | OPK | drive-by |
| Temple DAO | KT1MFxwTan4ptw6PSc3KK6e1xfzMrCb382tw | 0 | 0 | none | BRR | drive-by |
| Buffy DAO | KT1EfitTAsPQJ9ZwSZgtpeyS14JE5V2fDQhX | 0 | 0 | none | QUIPU | drive-by |
| Mango DAO | KT1BBt31T7s3p2awgn6aEELUXJWnxdrhRvYZ | 0 | 0 | none | QUIPU | drive-by |
| Sigma Founder DAO (dup) | KT1WCTd66LsF5Bs2ueJan3ydVmK1E6o5Kfmm | 0 | 1 | none | SigmafounderDAO Token | drive-by |
| Sigma Founder DAO (dup) | KT1WRzfCxCyJMdU5a6XbhLoQXJT7kJg4sbDa | 0 | 0 | none | SFDT | drive-by |
| MacanDAO | KT1GLJWdrtPuyqcbREBjvQCtwKicbvgrjqyv | 0 | 3 | none | MACAN | drive-by |
| Sigma Founder DAO (dup) | KT1WoD3XvmSeWM1M3NfJuXF3E3pX895y9nB2 | 0 | 0 | none | SFDT | drive-by |
| Sigma Founder DAO (dup) | KT1WFnBYg9iGqQA5nF6goE6xwsH5cPfD8qsK | 0 | 0 | none | SFDT | drive-by |
| TeznounsDAO | KT18vnVgseKpLBZG5Q3oVYh46rBE2PceBdD3 | 0 | 0 | none | TND | drive-by |
| Sigma Founder DAO (dup) | KT1Vp3G8U73TMATEtyy47q8hpyJKdWJwKWf4 | 0 | 0 | none | SFDT | drive-by |
| sfa | KT1WMrDj1o5u2ArNcZ5YidgoQbtyDm7izzKb | 0 | 0 | none | DICET | drive-by |
| TezosPerth DAO | KT1ARm3Utdh122aAadBgM3UqwV8rWxu8d5tu | 0 | 0 | none | tezperth | drive-by |
| Dicey DAO | KT1PAB2DZu1xe4GKJhACrbxLtWp9vJa2mEh1 | 0 | 0 | none | DICET | drive-by |
| PFFAC.US | KT19bHYtTdgRLqf1Xw4xMcMg8DdyRVoqMMsd | 0 | 1 | none | PFFAC.US | drive-by |
| DAO prueba CAB | KT1AEMX1S2izibxfUuzC4KRjpcMLBh9Z7tpt | 0 | 0 | none | TGovCAB | drive-by |
| DAO prueba CAI | KT1XuUtnww729wf25TySR5aaCpJbJYbERBJ3 | 0 | 1 | none | TCAI | drive-by |
| Sigma Founder DAO (dup) | KT1JGRv3za1ZrVAsH2Rv2dCzVjZLY1oer5pS | 0 | 0 | none | SFDT | drive-by |
| MEK DAO | KT1UnB5tDtGQD153FUGPyxTkqVhyWvEdTyzc | 0 | 7 | none | $Mek | drive-by |
| TORTOZES | KT1JXFgQKbZNjHBKnBM9Wqh6dHZvDqhgVidV | 0 | 2 | none | TORTOZES | drive-by |
| TEZINU DAO | KT1X4PoAo1vs1BKeVdzCgPmTJtkoajqd8Rw2 | 0 | 1 | none | TEZINU | drive-by |
| Waking State Team | KT1S31ZgfKbw2KYpJDJh7995achV2f3QYBii | 0 | 0 | none | WST | drive-by |
| TDAO on Mainnet | KT1CVjSStYHCzpS2jLx3WfdW9HYGdULXS6pa | 0 | 0 | none | CRNCHY | drive-by |
| Real DAO | KT1LmQAB73LvEEX1e9y2LTT7GytF582YAEbG | 0 | 0 | none | ATK | drive-by |
| DASHZ DAO | KT1A85E2sXPm9jaPmHKMMgFoqG2j9bsDCEWE | 0 | 0 | none | ASH | drive-by |
| XAIT DAO | KT1LTUHErA8aTn2KVYFRPHdbxj2dcsgDPLeH | 0 | 1 | none | ASH | drive-by |
| Boredboysclub | KT1FW1iJnqygzje2EmsGwtMb6kMUGHkYbNqQ | 0 | 6 | none | BBC | drive-by |
| DASH | KT19z15TSs96csjGTYw9LSREBW5deKQ1DsuH | 0 | 0 | none | ASH | drive-by |
| DASHX DAO | KT1KTD921iByx3289MJ1UjxL6q13evyxSyS3 | 0 | 0 | none | ASH | drive-by |
| zzz'"\<p\> (dup) | KT1BLZSdzy38cxvZuVEMz2KutiM3mgHVpAzB | 0 | 0 | none | test7 | drive-by |
| Futbol club CAB | KT19kU4HrmqmfPUwyQEDeExvhXZWiLa4vRkd | 0 | 0 | none | TGovCAB | drive-by |

**Real-org read:** excluding "Sigma Founder DAO" duplicates and the XSS-name entries, this rail has effectively **2 genuinely active, recognizable projects** (Autonet, Tezos Ecosystem — the same two that top the lite-DAO rail) plus **Tezos Pepe DAO** and **Humanitez** as credible dormant orgs with real holder counts (96 and 22 respectively — the two highest holder counts on this entire rail).

---

### A3. Etherlink mainnet — Firestore `idaosEtherlink`

Auth via local firebase-tools CLI refresh token (as in the working script). Collection has exactly **28 docs**, matching the task brief. Full documents pulled (no field mask) plus a `listCollectionIds` sweep per doc to find subcollections, plus a full `runQuery` against each doc's `proposals` subcollection where present.

**Subcollection coverage:** 16 of 28 DAOs have a `proposals` subcollection; 24 of 28 have a `members` subcollection; the other 12 (of the proposals gap) never had a proposal created. 2 DAOs (`0x0763d99...`, `0x4Cf36BB...`) have no subcollections at all — fully empty shells.

**Classification (all 28, using proposal-subcollection doc counts and `createdAt` timestamps):**

| class | count |
|---|---|
| active | 1 |
| dormant | 9 |
| drive-by | 18 |
| **Total** | **28** |

**Full table** (name, symbol, holders field on the DAO doc, created, proposal count, last proposal, class):

| Name | Symbol | Holders | Created | Proposals | Last proposal | Class |
|---|---|---|---|---|---|---|
| The Probes Bay | TPB | 2 | 2025-02-17 | 1 | 2025-02-17 | drive-by |
| Monday DAO | MON | 1 | 2025-02-17 | 0 | none | drive-by |
| Kaydot Fans | KDF | 1 | 2025-02-17 | 0 | none | drive-by |
| Waking State Team | WST | 1 | 2025-04-06 | 1 | 2025-06-17 | drive-by |
| Aster | WAST | 0 | 2025-06-16 | 2 | 2025-06-17 | dormant |
| \<img/src/onerror=alert(1)\> | () | 1 | 2025-07-16 | 0 | none | drive-by |
| Recursive Principial Body | RPB1 | 1 | 2025-09-19 | 2 | 2025-09-19 | dormant |
| Sarmale | SML | 1 | 2025-11-13 | 0 | none | drive-by |
| The Grateful Paralized | TGP | 1 | 2025-11-18 | 6 | 2025-11-18 | dormant |
| Wednesday Addams | WDA | 1 | 2025-11-19 | 1 | 2025-11-19 | drive-by |
| All kinds of fuels | AKF | 1 | 2025-11-19 | 2 | 2025-11-19 | dormant |
| Berghein NT | NST | 1 | 2025-11-19 | 7 | 2025-11-20 | dormant |
| Berghein Transferable | BGT | 1 | 2025-11-20 | 2 | 2025-11-20 | dormant |
| wBerghein | WBHD | 0 | 2025-11-20 | 0 | none | drive-by |
| Mamuca 1 | WADS | 0 | 2025-11-20 | 0 | none | drive-by |
| Wrapped Slice | WBGS | 0 | 2025-11-20 | 1 | 2025-11-20 | drive-by |
| wrapped Capac | WCPC | 0 | 2025-11-20 | 0 | none | drive-by |
| wrapped Capac (HB) | WCHB | 0 | 2025-11-20 | 0 | none | drive-by |
| wrapped Cover (HB) | WCVR | 0 | 2025-11-20 | 2 | 2025-11-20 | dormant |
| Final non-t | FNT | 1 | 2025-11-20 | 2 | 2025-11-20 | dormant |
| 2 Chains NT | 2CNT | 3 | 2025-11-22 | 10 | 2025-11-22 | dormant |
| 4 Chains NT | CNT4 | 3 | 2025-11-23 | 0 | none | drive-by |
| 4 Chains T | CT4 | 3 | 2025-11-23 | 1 | 2025-11-24 | drive-by |
| zzz'"\<p\> | ZZZ'\<P\> | 1 | 2025-11-23 | 9 | 2026-03-10 | active |
| zzz'"\<iframe/src=javascript:alert(1)\>\</iframe\> | ZZZ'"\<I | 1 | 2025-12-08 | 0 | none | drive-by |
| zzz'"\<iframe...\> (dup) | ZZZ'"\<I | 1 | 2025-12-08 | 0 | none | drive-by |
| zzz'"\<iframe...\> (dup) | ZZZ'"\<I | 1 | 2025-12-08 | 1 | 2026-01-17 | drive-by |
| Local Food | LCF | 1 | 2025-12-30 | 0 | none | drive-by |

**Critical finding: zero real organizations on this rail.**
- Every one of the 28 DAOs has **0-3 holders** on its governance token — none represents an actual token-holder community.
- Several names are **literal XSS/security-fuzzing payloads** (`<img/src/onerror=alert(1)>`, `zzz'"<iframe/src=javascript:alert(1)></iframe>`) — confirming this data is dominated by security testers and internal QA, not prospective users.
- Names like "Sarmale" (a Romanian dish), "wBerghein"/"Berghein" (Berlin club references), "4 Chains NT/T" all read as one team's internal test fixtures, likely testing the "wrap non-transferable token" feature (`underlyingToken` field links 6 of these DAOs to each other in wrap/unwrap chains).
- The single "active" DAO (`zzz'"<p>`, 9 proposals, most recent 2026-03-10) is itself an XSS-payload name — i.e., **the most active Etherlink DAO in Homebase's own database is a security test artifact**, not a customer.
- Net: **the entire Firestore Etherlink DAO store contains 0 organizations that would count as real prospective customers** — everything here is internal testing.

---

## Part B — Etherlink prospect denominator (Blockscout)

API: `https://explorer.etherlink.com/api/v2/tokens?type=ERC-20`, paginated via `next_page_params`.

**Pagination bug encountered and fixed:** the first pass naively passed `next_page_params` values (including JS `null`) straight into `URLSearchParams`, which serialized `null` as the literal string `"null"` inconsistently and caused the API to return the same first page repeatedly (750 rows fetched, only 50 unique). Fixed by explicit `String(v)` coercion; confirmed a follow-up manual round-trip test showed the API's cursor pagination works correctly when params are passed as-is. After the fix: **49 pages, 2,443 unique ERC-20 tokens** pulled (full list on the "any-holder-count" tail; stopped when `next_page_params` was absent).

**Filtered to ≥50 holders: 92 tokens.**

Classification into 4 buckets (name/symbol pattern matching against known bridge/stable/LP naming conventions):

| Category | Count |
|---|---|
| Bridged/wrapped/stablecoin (WETH, WBTC, WBNB, WXTZ, USDC, USDT, LBTC, VNXAU, etc.) | 17 |
| LP/vault/lending-receipt tokens (Superlend `sl*`, Hanji `hXTZ`/`hUSD`/`HJLP`, variable-debt tokens) | 9 |
| RWA/tokenized-fund tokens (Midas mTBILL/mBASIS, Spiko EUTBL/EURSAFO — note: 2 of these fell below the 50-holder cutoff and appear only in the raw pull, not this table) | 3 |
| **Candidate project tokens** (remaining — real or plausible token communities) | **63** |

Cross-referencing all 63 candidate token contract addresses (and the 28 Firestore DAOs' `token`/`underlyingToken` addresses) found **zero overlap** — expected, since every Firestore Etherlink DAO's own token has 0-3 holders and none would appear in a ≥50-holder list anyway.

**Etherlink prospect count (candidate tokens with no DAO): 63 of 63** (100% — trivially true since none of our 28 DAOs' tokens even clear the 50-holder bar).

**Important honesty caveat on the "63":** automated name-pattern classification cannot reliably distinguish a real organization/protocol from a memecoin or joke token — both look identical in a token list (a symbol, a name, a holder count). Manually skimming the 63: roughly **15-20 look like genuine projects or protocols** with an identifiable product (Sogni AI/Sogni Spark — an AI compute network; Kora — payments infra; Lyzi — a French crypto-payments app; Sugarverse; Superloop `sloopXTZ` — a restaking/liquid-staking wrapper; Midas Re7 Yield — a yield vault; Spiko EURSAFO — a tokenized money-market fund). The remaining ~40-45 (Cocaine, AssEater, DEGENERATOR.EXE, Devil Token, Wojak, DoggWifHat, 💎🔥GEMS🔥💎, Crow Coin, etc.) are unmistakably memecoins/joke tokens with no organizational structure to govern. **Recommend treating "~15-20" as the defensible serious-prospect number and "63" as the generous upper bound**, and treating both as requiring manual verification before outreach — this census did not verify team identity, socials, or contract-verification status for any of them.

**Top 20 candidate tokens by holder count:**

| Name | Symbol | Holders | Has DAO | Address |
|---|---|---|---|---|
| Sogni Spark | tSPARK | 66,376 | no | 0xE6EAE8E2E3150E5422FfD3fdF72318EF13Ec93eC |
| Ecoo Coin | E-Coin | 43,250 | no | 0x04EdF4C1cF268E8fc803A3BDA0aE9369B3a4eB86 |
| Spark point | SPARK | 6,300 | no | 0x12B11c246BD3aF9b1F18C5A9710Ef889Ca1C9B28 |
| Apple XTZ | applXTZ | 3,755 | no | 0xcFD2f5FAF6D92D963238E74321325A90BA67fCA3 |
| Uranium | xU3O8 | 3,151 | no | 0x79052Ab3C166D4899a1e0DD033aC3b379AF0B1fD |
| Apples | APPL | 2,559 | no | 0x6E9C1F88a960fE63387eb4b71BC525a9313d8461 |
| USDSM | USDSM | 1,483 | no | 0x6bDE51212203aE5d592Cc5180DA2ABBd41c922dE |
| Apple stXTZ | applstXTZ | 1,243 | no | 0x0008b6C5b44305693bEB4Cd6E1A91b239D2A041E |
| Kora Token | KORA | 1,131 | no | 0x029Bcb6e04609a498bBb3451d1a45AD6DA0Ab190 |
| Lyzi | LYZI | 1,028 | no | 0x19418d0af0F36865cDfbB2437dFEd29BA34d3190 |
| Sugarverse | CNDY | 967 | no | 0x6b43732a9AE9F8654d496c0A075Aa4Aa43057A0B |
| Sogni AI | SOGNI | 613 | no | 0x2767Fc1048cd0ae4fd952eeF09853301c9DC7173 |
| Tezos Artist | BROKE | 591 | no | 0xa02869C70fB0764e7f4262b4A9f3e678Ff6831B3 |
| Tezticles | TEZT | 570 | no | 0xd0E1f2FbA8213cf69A94ea5d0C2D9ad289513d7D |
| Etherlonk | nocoin | 477 | no | 0xc00cB883b41c800D434947243D537a3896d3e636 |
| Apple Farm Sogni | afSOGNI | 462 | no | 0xE1F2074857414e1b18665691eaaD3aC2364E7b45 |
| TezosPEPE Goose | GOOSE | 442 | no | 0x2d69e0605949EBfFECB9b309049e015752CAFD82 |
| Little Sushi | LSUSHI | 400 | no | 0xFE69127Af0B20D70197c23aE8685e7C39FF04783 |
| BabyTurbo | BTURB | 385 | no | 0xf1289118Ff03F197f0D0A50E4774984e7977965e |
| 蛙闘 (Frog Fight) | KTO | 383 | no | 0x176b6EE8DA6E7e07530960Eaa03707cE6F4FA4E5 |

(Full 63-row list and the 17/9/3 excluded-category lists available on request; reproducible via the Blockscout API pull described above.)

**Coverage gap:** Blockscout's `holders_count` is a point-in-time snapshot with no historical/creation-date field returned by this endpoint, so "created since 2024" filtering (used for the TzKT side, Part C) wasn't applied here — Etherlink mainnet itself only launched in 2024, so this is largely moot, but a token could technically predate Etherlink mainnet if migrated/bridged. Not verified further.

---

## Part C — Tezos L1 prospect sketch (light touch, via TzKT)

API: `https://api.tzkt.io/v1/tokens?standard.in=fa1.2,fa2&holdersCount.ge=100&firstTime.ge=2024-01-01&sort.desc=holdersCount&limit=1000`.

**Raw pull:** 1,000 rows returned (API max page size), i.e. **the true count of tokens meeting the ≥100-holders / created-since-2024 filter is ≥1,000** — this pull hit the pagination ceiling and undercounts the true population. A full count would require paginating with `offset`, which the brief said to skip ("light touch") — noting as a coverage gap rather than doing it.

**Critical shape issue:** TzKT's `/v1/tokens` endpoint returns **one row per token-ID, not one row per contract** — this collection is dominated by NFT drop platforms (OBJKT.com mints, sports-collectible series like "Collect United" and "McLaren F1 Team 23/23", per-edition PFP series) where a single project can own dozens of token-ID rows. Deduping the 1,000-row pull by contract address yields **412 unique contracts**.

Applying a fungible-token heuristic (`metadata.decimals > 0` AND no `attributes`/`royalties`/`artifactUri` NFT-marker fields — proxying for "this is a governance/utility token, not an NFT edition") narrows this to **35 unique contracts**.

**Further dedup issue found in the 35:** "Kolibri DAO" (`kdao.app`) appears as **10 separate contract addresses** in this list — these are per-vault/per-CDP-position tokens from the Kolibri stablecoin protocol (a single project), not 10 different organizations. After collapsing Kolibri to one entry, the realistic unique-project count in the top tier is **~26**.

**Top 20 by holder count** (pre-Kolibri-collapse, contract-deduped, fungible-filtered):

| Name | Symbol | Holders | First seen | Contract |
|---|---|---|---|---|
| TZ Apex by TZ APAC | APEX | 7,397 | 2024-06-07 | KT1LcNFDj66TTXKFBjQLQwo9J7tENbrq8AJE |
| Kolibri DAO | kdao.app | 6,279 | 2024-10-11 | KT1LrmBr6fgM2eFSNLRJm4H17gAxVXJH2FCB |
| MEW | mew | 5,744 | 2024-04-01 | KT1Hc6KSHp3pLLiCXUkuHva62PRJQ8JmyAcP |
| Aubergine | GINE | 4,233 | 2024-03-10 | KT1FfjhvJZppBFQuUzNAdFPR1Z2jpD4XiXrF |
| Kolibri DAO (dup vault) | kdao.app | 4,101 | 2024-10-22 | KT1WKtfmeZUXUDT2wzsx4DYNF9LSbMijnxNn |
| Kolibri DAO (dup vault) | kdao.app | 4,002 | 2024-07-17 | KT1U9gs664QfMAUipgJKVJP8rC4dAf1iptfC |
| Pup Tez | PUPTEZ | 3,770 | 2024-03-21 | KT1R3MxnFa4Ce9mrkvnnNAScBG8xgWi9WrJv |
| Kolibri DAO (dup vault) | kdao.app | 3,585 | 2024-09-15 | KT1HEBS2qDsGkrawacrWJfDgpqrvcjSuWFW1 |
| Kolibri DAO (dup vault) | kdao.app | 3,004 | 2024-07-19 | KT1VfHLq1mibHxSHDNWsL2eN7xLt5i7jV57R |
| kusd | kusd.fi | 3,002 | 2024-07-15 | KT1PhvQiKGVsg32tqiqWEhm8UD5TPDikMFCE |
| Kolibri DAO (dup vault) | kdao.app | 3,001 | 2024-07-20 | KT1C3dBLGnmFknCtVwMsrz7NJ6MjkYL7LoVy |
| Kolibri DAO (dup vault) | kdao.app | 2,601 | 2024-07-16 | KT1UE2UpjSJa3tbBMTCY9H9qpPtakVJDHDps |
| Kolibri DAO (dup vault) | kdao.app | 2,501 | 2024-07-23 | KT1TpzrtbwUe8yYxRzMorLo2iEdgwWjQAaSY |
| Kolibri DAO (dup vault) | kdao.app | 2,495 | 2024-09-27 | KT1QVjkhUPCuAr7CzwpkiauNpKg7QWHAogur |
| Tezos Inu | TEZINU | 1,925 | 2024-04-04 | KT1Avad9GZXRSoKzUukD5qSen44WxPRGsQCN |
| $clint | $clint | 1,191 | 2024-01-02 | KT1Vfc3EMLzHdZapxxyC9zForN3Qas9TEed7 |
| Everstake.app | STKR | 868 | 2024-07-18 | KT1DDgiZ5bS6pfnNL8wwXdszXZHbwxFPTX3t |
| DEEPLOY ECOSYSTEM TOKEN | DEEP | 818 | 2024-02-27 | KT1Fzw3uNEM7Ez8tysopUGwzDsoU2YZKUYuA |
| tPICLES | tPICLES | 795 | 2024-12-19 | KT1WLqrZGc5Nm2tGm5Vd1xqphhsGhN84A9rS |
| JOELMA | JOELMA | 596 | 2024-03-23 | KT1FrrkFKvXgDr9GNWBjJD3nG4fc6Lk6C49d |

**No cross-reference to Tezos-Homebase L1 DAOs was performed for Part C** (brief said light touch / "don't go deep") — but given Tezos Inu (TEZINU) already has a Homebase mainnet lite DAO (see A1, "TEZINU DAO", 0 polls, drive-by) and a Hasura baseDAO entry (also 0 proposals), that's at least one direct hit worth flagging: **a token community exists (1,925 holders) but its Homebase DAO was never actually used.** That pattern — token launched, DAO deployed as a checkbox, never governed — may be common and is a good qualitative finding even without a full cross-reference pass.

**L1 prospect count: ≥1,000 tokens meet the raw ≥100-holders/since-2024 filter (undercounted, hit API page limit); 412 unique contracts after dedup; 35 unique fungible-token contracts after NFT-collection filtering; ~26 unique projects after collapsing Kolibri's 10 vault-token contracts into one.** Recommend the **~26** figure as the "light touch" defensible number for genuinely fungible, non-NFT token communities created since 2024, with the strong caveat that a full paginated pull (removing the 1,000-row ceiling) would likely raise this by an unknown but probably substantial amount, since NFT filtering was the dominant exclusion and TzKT's corpus of Tezos tokens is large.

---

## Cross-cutting anomalies and coverage gaps (summary)

1. **Hasura V2 indexer is dead** (`v2-homebase-indexer.w3api.dev` — NXDOMAIN). Any DAOs unique to a V2-only baseDAO deployment are currently invisible to this census and to the live app's data layer, if the app still tries to hit it.
2. **MongoDB `Polls.startTime` has mixed units** (seconds vs. milliseconds, no schema flag) — silently produces wrong dates if naively parsed. Fixed in this census; flagging for anyone else who queries this collection directly.
3. **"Sigma Founder DAO" and "zzz'\"\<p\>" / XSS-payload-named DAOs are heavily duplicated test/fuzz artifacts** across all three rails (lite Mongo, Hasura onchain, and — differently named but same pattern — Firestore Etherlink). They inflate raw counts and, in the Etherlink case, constitute the *only* "active" DAO on that entire rail. All headline numbers above are given both raw and adjusted for this.
4. **Etherlink Firestore DAOs (all 28) are 100% internal test/QA data** — 0-3 holders each, several literally named with security-fuzzing payloads. There is currently no real-world Etherlink DAO usage to report.
5. **TzKT `/v1/tokens` pull hit the 1,000-row API ceiling** — the true count of L1 tokens meeting the filter is understated; a full paginated crawl was out of scope per the "light touch" instruction but should be considered if Part C numbers are used for anything more than a sketch.
6. **Blockscout token list required a pagination-cursor fix mid-run** (an initial pass silently returned the same 50 tokens 15 times due to `null`-value serialization in `next_page_params`) — the corrected pull (2,443 unique tokens) is the one used throughout Part B.
7. **Automated real-org-vs-memecoin classification is inherently imprecise** for both the Etherlink candidate list (63, generous) and the TzKT L1 list — a name/symbol regex cannot verify team identity or product existence. Both numbers should be treated as upper bounds pending manual/qualitative review.
