import { BaseDAO } from ".."
import { useQuery } from "@tanstack/react-query"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import BigNumber from "bignumber.js"
import { mutezToXtz } from "services/contracts/utils"

export const useTezosBalance = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress)
  const { tezos } = useTezos()

  const result = useQuery<BigNumber, Error>({
    queryKey: ["tezosBalance", contractAddress],
    queryFn: async () => {
      const balance = await tezos.tz.getBalance((dao as BaseDAO).data.address)
      return mutezToXtz(new BigNumber(balance.toString()))
    },
    enabled: !!dao && !!tezos
  })

  return result
}
