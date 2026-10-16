import { useQuery } from "@tanstack/react-query"
import { BaseDAO, CycleInfo } from "services/contracts/baseDAO"
import { getProposals } from "services/services/dao/services"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useDAO } from "./useDAO"
import { useMemo } from "react"

/**
 * Proposals of a DAO, optionally narrowed to one status.
 * The list is fetched once per DAO and the status filter is applied at render time with the current cycle info,
 * so it follows the chain instead of freezing at whatever level was known when the query first ran.
 */
export const useProposals = (contractAddress: string, status?: ProposalStatus) => {
  const { data: daoData, error, cycleInfo } = useDAO(contractAddress)

  const queryResults = useQuery({
    queryKey: ["proposals", contractAddress],
    queryFn: async () => getProposals(daoData as BaseDAO),
    refetchInterval: 30000,
    enabled: !!daoData
  })

  const data = useMemo(() => {
    const proposals = queryResults.data ?? []
    if (!status) {
      return proposals
    }
    if (!cycleInfo) {
      return []
    }
    return proposals.filter(proposal => proposal.getStatus((cycleInfo as CycleInfo).currentLevel).status === status)
  }, [queryResults.data, status, cycleInfo])

  return {
    data,
    isLoading: queryResults.isLoading,
    error: error || queryResults.error
  }
}
