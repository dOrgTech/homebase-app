# Migration: Tezos Ghostnet → Shadownet

> **Note:** This file should be removed once the migration is complete and merged.

## Overview

Tezos is replacing Ghostnet with Shadownet as the long-term testnet. This document tracks what needs to change for Homebase to support Shadownet.

Reference: https://teztnets.com/shadownet-about

## Shadownet Technical Details

- **RPC:** `https://rpc.shadownet.teztnets.com`
- **Faucet:** `https://faucet.shadownet.teztnets.com`
- **Network Name:** `TEZOS_SHADOWNET_2025-08-07T20:00:00Z`
- **Activation Date:** 2025-08-07

## External Service Compatibility

| Service | Status | Endpoint |
|---------|--------|----------|
| TzKT API | ✅ Ready | `api.shadownet.tzkt.io` |
| TzKT Explorer | ✅ Ready | `shadownet.tzkt.io` |
| Shadownet Faucet | ✅ Ready | `faucet.shadownet.teztnets.com` |
| SmartPy RPC | ❓ Unknown | May not support shadownet |
| Beacon Wallet SDK | ⚠️ Custom | Needs `NetworkType.CUSTOM` |
| Better Call Dev | ❓ Unknown | May not support shadownet |

---

## Changes Required

### 1. Frontend App (this repo)

#### Files to modify:

| File | Change |
|------|--------|
| `src/services/beacon/utils.ts` | Replace `ghostnet` with `shadownet` in Network type, RPC nodes, colors, and wallet config |
| `src/services/config/constants.ts` | Rename env key to `REACT_APP_RPC_NETWORK_SHADOWNET` |
| `src/modules/common/Footer.tsx` | Update explorer link to `shadownet.tzkt.io` |
| `src/modules/creator/state/context.tsx` | Update network checks from `ghostnet` to `shadownet` |
| `src/services/tzprofiles/hooks/useProfileClaim.tsx` | Update network validation |
| `.env` | Update env var name |

### 2. Hasura/Indexer

The Homebase indexer needs to be reconfigured:

- [ ] Point indexer to shadownet RPC (`https://rpc.shadownet.teztnets.com`)
- [ ] Reset/migrate database (shadownet is a new chain)
- [ ] Redeploy Hasura instance
- [ ] Update any hardcoded network references

**Indexer endpoints:**
- V1: `https://v3-homebase-indexer.tezos-homebase.io/v1/graphql`
- V2: `https://v2-homebase-indexer.w3api.dev/v1/graphql`

### 3. Smart Contracts

All contracts must be **redeployed on Shadownet** (it's a completely new chain):

- [ ] Token contracts (FA1.2/FA2)
- [ ] BaseDAO contracts
- [ ] Registry contracts
- [ ] Metadata carrier contracts
- [ ] DAO deployer service contracts

### 4. Environment Variables

```bash
# Old
REACT_APP_RPC_NETWORK_GHOSTNET=https://ghostnet.smartpy.io

# New
REACT_APP_RPC_NETWORK_SHADOWNET=https://rpc.shadownet.teztnets.com
```

---

## Testing Checklist

- [ ] Get tez from shadownet faucet
- [ ] Test wallet connection with Temple/Kukai
- [ ] Test token creation
- [ ] Test DAO creation flow
- [ ] Test staking
- [ ] Test proposal creation
- [ ] Test voting
- [ ] Test proposal execution
- [ ] Verify TzKT links work correctly
- [ ] Verify indexer picks up new DAOs

---

## Migration Strategy

**Approach: Replace ghostnet with shadownet**

Since Ghostnet is being deprecated, we're replacing it entirely rather than adding shadownet alongside it. Users will lose access to existing ghostnet DAOs, but those would become inaccessible anyway once Ghostnet shuts down.

---

## Rollback Plan

If issues arise:
1. Revert this branch
2. Re-enable ghostnet configuration
3. Investigate and fix shadownet issues in a new branch
