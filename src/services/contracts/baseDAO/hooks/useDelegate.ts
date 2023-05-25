import { useQuery } from "react-query"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getLatestDelegation } from "services/bakingBad/delegations"

export const useDelegate = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress)
  const { tezos, network } = useTezos()

  const result = useQuery<{ address: string; alias?: string } | null, Error>(
    ["daoDelegate", contractAddress],
    async () => {
      const latestDelegation = await getLatestDelegation(contractAddress, network)

      if (!latestDelegation) {
        return null
      }

      return latestDelegation.newDelegate
    },
    {
      enabled: !!dao && !!tezos
    }
  )

  return result
}
