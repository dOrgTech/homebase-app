import { DisplayStatus } from "modules/etherlink/status"

export type TypeKey = "onchain" | "offchain"

// Canonical, hyphenated keys for URL usage
export type StatusKey =
  | "all"
  | "active"
  | "succeeded"
  | "queued"
  | "executable"
  | "executed"
  | "expired"
  | "no-quorum"
  | "pending"
  | "rejected"
  | "defeated"

export type OffchainStatusKey = "all" | "active" | "closed"

export type PTypeKey =
  | "registry"
  | "transfer"
  | "contract-call"
  | "mint"
  | "burn"
  | "quorum"
  | "voting-delay"
  | "voting-period"
  | "threshold"
  | "token" // alias (read time)

export interface ParsedFilters {
  type: TypeKey
  status: StatusKey[] | OffchainStatusKey[]
  ptype: PTypeKey[]
  author?: string | null
}

const STATUS_CANON_MAP: Record<string, StatusKey | OffchainStatusKey> = {
  // normalize variants (spaces, hyphens, legacy values)
  "all": "all",
  "active": "active",
  "pending": "pending",
  "queued": "queued",
  "executable": "executable",
  "executed": "executed",
  "expired": "expired",
  "rejected": "rejected",
  // legacy → canonical
  "passed": "succeeded",
  "succeeded": "succeeded",
  "failed": "defeated",
  "defeated": "defeated",
  "noquorum": "no-quorum",
  "no quorum": "no-quorum",
  "no-quorum": "no-quorum",
  // offchain alias
  "closed": "closed"
}

const PTYPE_CANON_MAP: Record<string, PTypeKey> = {
  "registry": "registry",
  "transfer": "transfer",
  "contract-call": "contract-call",
  "contract_call": "contract-call",
  "contract call": "contract-call",
  "mint": "mint",
  "burn": "burn",
  "quorum": "quorum",
  "voting-delay": "voting-delay",
  "voting delay": "voting-delay",
  "voting-period": "voting-period",
  "voting period": "voting-period",
  "threshold": "threshold",
  "proposal-threshold": "threshold",
  "proposal threshold": "threshold",
  // alias
  "token": "token"
}

const DISPLAY_FROM_STATUS: Record<Exclude<StatusKey, "all">, DisplayStatus> = {
  "active": "Active",
  "pending": "Pending",
  "succeeded": "Succeeded",
  "defeated": "Defeated",
  "no-quorum": "NoQuorum",
  "queued": "Queued",
  "executable": "Executable",
  "executed": "Executed",
  "expired": "Expired",
  "rejected": "Rejected"
}

const normalize = (s?: string | null) => (s || "").toLowerCase().trim()

const splitCsv = (v?: string | null) =>
  normalize(v)
    .split(",")
    .map(x => x.trim())
    .filter(Boolean)

export function canonicalType(value?: string | null): TypeKey {
  const v = normalize(value)
  return v === "offchain" ? "offchain" : "onchain"
}

export function canonicalStatuses(
  value?: string | null,
  scope: TypeKey = "onchain"
): (StatusKey | OffchainStatusKey)[] {
  const raw = splitCsv(value)
  if (raw.length === 0) return ["all"]

  // map/clean
  const mapped = raw.map(k => STATUS_CANON_MAP[k.replace(/\s+/g, " ").replace(/-/g, "-")]).filter(Boolean) as (
    | StatusKey
    | OffchainStatusKey
  )[]

  if (mapped.length === 0) return ["all"]

  // Offchain scope allows "closed" as alias for not-active
  if (scope === "offchain") {
    // allow 'active' explicitly; any non-active maps to 'closed'
    const keep: OffchainStatusKey[] = []
    for (const k of mapped) {
      if (k === "active") keep.push("active")
      else keep.push("closed")
    }
    const unique = Array.from(new Set(keep))
    return unique.length === 0 ? ["all"] : unique
  }

  // On-chain scope: pass-through canonical keys, ensure uniqueness
  const unique = Array.from(new Set(mapped))
  return unique.length === 0 ? ["all"] : unique
}

export function canonicalPtypes(value?: string | null): PTypeKey[] {
  const raw = splitCsv(value)
  if (raw.length === 0) return []
  const mapped = raw.map(k => PTYPE_CANON_MAP[k.replace(/\s+/g, " ")]).filter(Boolean) as PTypeKey[]

  // expand alias 'token' → mint,burn for deterministic filtering
  const expanded: PTypeKey[] = []
  for (const k of mapped) {
    if (k === "token") {
      expanded.push("mint", "burn")
    } else {
      expanded.push(k)
    }
  }

  return Array.from(new Set(expanded))
}

export function displayStatusFromKey(key: StatusKey): DisplayStatus | undefined {
  if (key === "all") return undefined
  return DISPLAY_FROM_STATUS[key]
}

export function parseFiltersFromSearch(search: string): ParsedFilters {
  const sp = new URLSearchParams(search || "")
  const t = canonicalType(sp.get("type"))
  const author = sp.get("author")
  const status = canonicalStatuses(sp.get("status"), t)
  const ptype = t === "offchain" ? [] : canonicalPtypes(sp.get("ptype"))
  return { type: t, status, ptype, author }
}

export function serializeFiltersToSearch(filters: ParsedFilters, prevSearch: string): string {
  const sp = new URLSearchParams(prevSearch || "")

  // Reset managed keys
  sp.delete("type")
  sp.delete("status")
  sp.delete("ptype")

  // type: only emit when offchain (onchain is default)
  if (filters.type === "offchain") sp.set("type", "offchain")

  // status
  const statuses = (filters.status || []).filter(Boolean) as string[]
  const statusSet = Array.from(new Set(statuses))
  if (filters.type === "offchain") {
    // offchain supports 'active' or 'closed'; omit when 'all' or empty
    const off = statusSet.filter(s => s === "active" || s === "closed")
    if (off.length === 1) sp.set("status", off[0])
    if (off.length > 1) sp.set("status", off.sort().join(","))
  } else {
    const withoutAll = statusSet.filter(s => s !== "all")
    if (withoutAll.length > 0) sp.set("status", withoutAll.sort().join(","))
  }

  // ptype: only for onchain
  if (filters.type === "onchain") {
    const p = Array.from(new Set(filters.ptype || []))
    if (p.length > 0) sp.set("ptype", p.sort().join(","))
  }

  return sp.toString()
}
