import { useMemo } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"

export const useIsProposalButtonDisabled = (daoId: string) => {
  const { cycleInfo } = useDAO(daoId)

  return useMemo(() => {
    if (cycleInfo && cycleInfo.type === "voting") {
      return true
    }

    return false
  }, [cycleInfo])
}
