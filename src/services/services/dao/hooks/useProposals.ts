import { useQuery } from "react-query"
import { BaseDAO, CycleInfo } from "services/contracts/baseDAO"
import { getProposals } from "services/services/dao/services"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useDAO } from "./useDAO"
import { useEffect, useState } from "react"

export const useProposals = (contractAddress: string, status?: ProposalStatus) => {
  const [isLoading, setIsLoading] = useState(true)
  const [proposalData, setProposalData] = useState<any[]>([])
  const { data: daoData, isLoading: isLoadingDAO, error, cycleInfo } = useDAO(contractAddress)

  const queryResults = useQuery(
    ["proposals", contractAddress, status],
    async () => {
      const dao = daoData as BaseDAO
      const proposals = await getProposals(dao)

      if (!status) {
        return proposals
      }

      return proposals.filter(
        proposalData => proposalData.getStatus((cycleInfo as CycleInfo).currentLevel).status === status
      )
    },
    {
      refetchInterval: 30000,
      enabled: !!daoData && !!cycleInfo
    }
  )

  useEffect(() => {
    if (queryResults.data) {
      setProposalData(queryResults.data)
    }
  }, [queryResults.data])

  return {
    data: proposalData,
    isLoading: isLoading || queryResults.isLoading,
    error: error || queryResults.error
  }
}
