import { useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useNotification } from "modules/common/hooks/useNotification"

const OUTCOMES: Record<string, { message: string; variant: "success" | "info" | "error" }> = {
  confirmed: { message: "Email alerts confirmed", variant: "success" },
  unsubscribed: { message: "Unsubscribed from email alerts", variant: "info" },
  invalid: { message: "This email alerts link is no longer valid", variant: "error" }
}

/**
 * The confirm/unsubscribe links in the alert emails land back in the app with
 * ?alerts=confirmed|unsubscribed|invalid. Show the outcome once and drop the
 * param, leaving any other query params untouched.
 */
export const useAlertsOutcomeToast = () => {
  const location = useLocation()
  const history = useHistory()
  const openNotification = useNotification()
  const alertsParam = new URLSearchParams(location.search).get("alerts")

  useEffect(() => {
    if (!alertsParam) {
      return
    }

    const outcome = OUTCOMES[alertsParam]
    if (outcome) {
      openNotification({
        message: outcome.message,
        autoHideDuration: 5000,
        variant: outcome.variant
      })
    }

    const searchParams = new URLSearchParams(location.search)
    searchParams.delete("alerts")
    history.replace({ pathname: location.pathname, search: searchParams.toString() })
    // openNotification is recreated on every render, so it is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertsParam])
}
