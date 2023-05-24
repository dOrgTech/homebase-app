import { BaseDAO } from ".."
import { useQuery } from "react-query"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getDAOLambdas } from "services/bakingBad/lambdas"
import { Lambda } from "services/bakingBad/lambdas/types"

export const useDAOLambdas = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress)
  const { network } = useTezos()

  const { data } = useQuery<Lambda[], Error>(
    ["lambdas", contractAddress],
    async () => {
      return await getDAOLambdas((dao as BaseDAO).data.address, network)
    },
    {
      enabled: !!dao
    }
  )

  return data
}
