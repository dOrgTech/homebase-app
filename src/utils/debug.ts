// Lightweight debug logger for Etherlink-related paths
// Prints only when REACT_APP_DEBUG_ETHERLINK is truthy.
// Common tag used across logs: [HB-DBG]
// Usage: dbg('message', data)

// Convert values to a single text line so they are easy to copy
// Handles BigInt and circular structures gracefully
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toText(value: any): string {
  if (typeof value === "string") return value
  try {
    const seen = new WeakSet()
    const asJson = JSON.stringify(value, (key, val) => {
      if (typeof val === "bigint") return val.toString()
      if (typeof val === "object" && val !== null) {
        if (seen.has(val)) return "[Circular]"
        seen.add(val as Record<string, unknown> as object)
      }
      return val
    })
    if (typeof asJson === "string") return asJson
  } catch (_) {
    // fallthrough
  }
  try {
    return String(value)
  } catch (_) {
    return "[Unserializable]"
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dbg = (...args: any[]) => {
  if (!process.env.REACT_APP_DEBUG_ETHERLINK) return
  const line = ["[HB-DBG]", ...args.map(toText)].join(" ")
  // eslint-disable-next-line no-console
  console.log(line)
}
