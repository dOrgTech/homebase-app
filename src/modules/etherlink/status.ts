// Utilities to map Homebase internal/Etherlink statuses to WeRule-style names

export type WeRuleStatus =
  | "Pending"
  | "Active"
  | "Succeeded"
  | "Defeated"
  | "NoQuorum"
  | "Queued"
  | "Executable"
  | "Executed"
  | "Expired"
  | "Canceled"
  | "Rejected"

const LEGACY_TO_WERULE: Record<string, WeRuleStatus> = {
  // primary mappings
  "pending": "Pending",
  "active": "Active",
  "passed": "Succeeded",
  "failed": "Defeated",
  "no quorum": "NoQuorum",
  "queued": "Queued",
  "executable": "Executable",
  "executed": "Executed",
  "expired": "Expired",
  "canceled": "Canceled",
  "rejected": "Rejected",
  // internal placeholder
  "queue_to_execute": "Succeeded"
}

const QUERY_TO_WERULE: Record<string, WeRuleStatus> = {
  // support existing query param values
  "all": "Pending", // sentinel, handled separately by callers
  "pending": "Pending",
  "active": "Active",
  "passed": "Succeeded",
  "failed": "Defeated",
  "no quorum": "NoQuorum",
  "noquorum": "NoQuorum",
  "queued": "Queued",
  "executable": "Executable",
  "executed": "Executed",
  "expired": "Expired",
  "canceled": "Canceled",
  "rejected": "Rejected",
  "defeated": "Defeated",
  "succeeded": "Succeeded"
}

export function toWeRuleStatus(status?: string | null): WeRuleStatus | undefined {
  if (!status) return undefined
  const key = String(status).toLowerCase()
  return LEGACY_TO_WERULE[key]
}

export function parseStatusQuery(value?: string | null): WeRuleStatus | undefined {
  if (!value) return undefined
  const key = String(value).toLowerCase().replace(/\s+/g, "")
  return QUERY_TO_WERULE[key]
}

export function isReadyToQueue(status?: string | null): boolean {
  return String(status).toLowerCase() === "queue_to_execute"
}
