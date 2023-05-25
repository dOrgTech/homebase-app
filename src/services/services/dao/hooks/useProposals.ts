import { useQuery } from "react-query"
import { BaseDAO, CycleInfo } from "services/contracts/baseDAO"
import { getProposals } from "services/services/dao/services"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useDAO } from "./useDAO"

export const useProposals = (contractAddress: string, status?: ProposalStatus) => {
  const { data: daoData, isLoading, error, cycleInfo } = useDAO(contractAddress)

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

  return {
    data: queryResults.data,
    isLoading: isLoading || queryResults.isLoading,
    error: error || queryResults.error
  }
}
