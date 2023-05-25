import { BaseDAO } from ".."
import { useQuery } from "react-query"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getDAOLambda } from "services/bakingBad/lambdas"
import { Lambda } from "services/bakingBad/lambdas/types"

export const useDAOLambda = (contractAddress: string, lambda_name: string) => {
  const { data: dao } = useDAO(contractAddress)
  const { network } = useTezos()

  const { data } = useQuery<Lambda, Error>(
    ["lambdas", contractAddress, lambda_name],
    async () => {
      return await getDAOLambda((dao as BaseDAO).data.address, network, lambda_name)
    },
    {
      enabled: !!dao
    }
  )

  return data
}
