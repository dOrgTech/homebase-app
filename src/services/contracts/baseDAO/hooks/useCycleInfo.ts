import { useMemo } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"

export const useIsProposalButtonDisabled = (daoId: string) => {
  const { cycleInfo } = useDAO(daoId)

  return useMemo(() => {
    if (process.env.REACT_APP_IGNORE_DAO_CYCLE_CHECK) {
      return false
    }

    if (cycleInfo && cycleInfo.type === "voting") {
      return true
    }

    return false
  }, [cycleInfo])
}
