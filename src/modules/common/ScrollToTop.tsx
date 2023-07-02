import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop(): null {
  const { pathname } = useLocation()

  useEffect(() => {
  }, [pathname])

  return null
}
