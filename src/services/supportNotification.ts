const ERROR_COUNT_KEY = "homebase_error_count"
const ERROR_THRESHOLD = 2

export const SUPPORT_SHOWN_KEY = "homebase_support_shown"
export const DISCORD_SUPPORT_LINK = "https://discord.gg/ZRVk6zu3xR"

export function hasSupportThresholdBeenMet(): boolean {
  try {
    const errorCount = parseInt(sessionStorage.getItem(ERROR_COUNT_KEY) || "0", 10)
    return errorCount >= ERROR_THRESHOLD
  } catch {
    return false
  }
}

export function trackAppError() {
  try {
    const errorCount = parseInt(sessionStorage.getItem(ERROR_COUNT_KEY) || "0", 10) + 1
    sessionStorage.setItem(ERROR_COUNT_KEY, String(errorCount))

    if (errorCount >= ERROR_THRESHOLD) {
      window.dispatchEvent(new CustomEvent("homebase-support-needed"))
    }
  } catch {
    // sessionStorage may be unavailable in some contexts
  }
}
