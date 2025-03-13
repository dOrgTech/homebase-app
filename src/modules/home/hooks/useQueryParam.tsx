import { useLocation, useHistory } from "react-router-dom"

// TODO: remove hook on path change
export const useQueryParam = (param: string) => {
  const location = useLocation()
  const history = useHistory()
  const searchParams = new URLSearchParams(location.search)
  const paramValue = searchParams.get(param)

  const setValue = (value: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (value === null) {
      newSearchParams.delete(param)
    } else {
      newSearchParams.set(param, value)
    }
    history.push({ search: newSearchParams.toString() })
  }

  return [paramValue, setValue] as const
}
