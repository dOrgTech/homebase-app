import mixpanel from "mixpanel-browser"

const AnalyticsService = {
  track: (event: string, properties: Record<string, any>) => {
    mixpanel.track(event, properties)
  }
}

export default AnalyticsService
