import { useQuery } from "react-query"
import { BaseDAO } from "services/contracts/baseDAO"
import { LambdaProposal } from "../mappers/proposal/types"
import { getProposal } from "../services"
import { useDAO } from "./useDAO"

export const useProposal = (contractAddress: string, proposalKey: string) => {
  const { data: dao, isLoading, error, cycleInfo } = useDAO(contractAddress)

  const queryResults = useQuery(
    ["proposal", contractAddress, proposalKey],
    async () => {
      const response = await getProposal(contractAddress as string, proposalKey)
      const proposal = response.daos[0].proposals[0]

      switch (dao?.data.type) {
        case "lambda":
          return new LambdaProposal(proposal, dao)
        default:
          throw new Error(`DAO with address '${dao?.data.address}' has an unrecognized type '${dao?.data.type}'`)
      }
    },
    {
      refetchInterval: 30000,
      enabled: !!dao && !!cycleInfo
    }
  )

  return {
    data: queryResults.data,
    isLoading: isLoading || queryResults.isLoading,
    error: error || queryResults.error
  }
}
