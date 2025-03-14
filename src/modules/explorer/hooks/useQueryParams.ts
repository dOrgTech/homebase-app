// In react-router-dom v6, useHistory is deprecated and useNavigate is recommended.
// react-router-dom v5 is used in this project.
import { useCallback, useMemo } from "react"
import { useLocation, useHistory } from "react-router-dom"

const useQuery = () => {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export const useQueryParams = <T extends Record<string, string>>() => {
  const location = useLocation()
  const history = useHistory()

  const searchParams = useQuery()

  const getParam = useCallback(
    (key: keyof T) => {
      return searchParams.get(key as string) as T[keyof T] | null
    },
    [searchParams]
  )

  const setParam = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      history.replace({ pathname: location.pathname, search: searchParams.toString() })
    },
    [history, location.pathname, searchParams]
  )

  const removeParam = useCallback(
    (key: keyof T) => {
      history.replace({ pathname: location.pathname, search: searchParams.toString() })
    },
    [history, location.pathname, searchParams]
  )

  const clearParams = useCallback(() => {
    history.replace({ pathname: location.pathname, search: "" })
  }, [history, location.pathname])

  return {
    getParam,
    setParam,
    removeParam,
    clearParams
  }
}
