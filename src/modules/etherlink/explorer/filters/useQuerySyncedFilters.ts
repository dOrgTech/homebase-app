import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { parseFiltersFromSearch, serializeFiltersToSearch, ParsedFilters, canonicalType } from "./queryFilters"

const DEFAULTS: ParsedFilters = {
  type: "onchain",
  status: ["all"],
  ptype: [],
  author: null
}

export function useQuerySyncedFilters() {
  const location = useLocation()
  const history = useHistory()
  const [filters, setFiltersState] = useState<ParsedFilters>(() => parseFiltersFromSearch(location.search))
  const lastSearchRef = useRef<string>(location.search || "")

  // keep in sync with back/forward navigation
  useEffect(() => {
    if (location.search === lastSearchRef.current) return
    setFiltersState(parseFiltersFromSearch(location.search))
    lastSearchRef.current = location.search
  }, [location.search])

  const setFilters = useCallback(
    (patch: Partial<ParsedFilters>, opts?: { replace?: boolean }) => {
      const next: ParsedFilters = {
        ...filters,
        ...patch
      }
      // ensure type stays canonical
      next.type = canonicalType(next.type)

      // write to URL
      const newSearch = serializeFiltersToSearch(next, location.search)
      if (newSearch !== (location.search || "").replace(/^\?/, "")) {
        const method = opts?.replace ? history.replace : history.push
        method({ search: newSearch })
        lastSearchRef.current = `?${newSearch}`
      }
      setFiltersState(next)
    },
    [filters, history, location.search]
  )

  const clearFilters = useCallback(() => {
    const newSearch = serializeFiltersToSearch(DEFAULTS, location.search)
    history.replace({ search: newSearch })
    lastSearchRef.current = `?${newSearch}`
    setFiltersState(DEFAULTS)
  }, [history, location.search])

  return useMemo(() => ({ filters, setFilters, clearFilters }), [filters, setFilters, clearFilters])
}
