import { usePostHog } from "posthog-js/react"

const AnalyticsService = {
  track: (event: string, properties: Record<string, any>) => {
    // PostHog tracking will be handled via usePostHog hook in components
    // This service is maintained for backward compatibility
    if (typeof window !== "undefined" && (window as any).posthog) {
      ;(window as any).posthog.capture(event, properties)
    }
  }
}

export default AnalyticsService
