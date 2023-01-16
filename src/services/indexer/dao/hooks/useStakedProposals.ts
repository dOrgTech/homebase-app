import { useQuery } from "react-query"
import { BaseDAO, CycleInfo } from "services/contracts/baseDAO"
import { getProposals } from "services/indexer/dao/services"
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
import { useDAO } from "./useDAO"

export const useProposals = (contractAddress: string, address: string) => {
  const { data: daoData, isLoading, error, cycleInfo } = useDAO(contractAddress)

  const queryResults = useQuery(
    ["proposals", contractAddress],
    async () => {
      const dao = daoData as BaseDAO
      const proposals = await getProposals(dao)

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
