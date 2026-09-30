import { useQuery } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { networkNameMap } from "services/bakingBad"
import { Network } from "services/beacon"
import { mutezToXtz } from "services/contracts/utils"

/**
 * XTZ balance of an on-chain DAO contract, read straight from TzKT.
 *
 * The explorer already has `useTezosBalance`, but that one depends on `useDAO`
 * and therefore on the indexer plus the DAO route context. Lite pages live
 * outside that context, so they read the balance directly by address.
 */
export const useDAOTreasuryBalance = (daoAddress: string | undefined, network: Network) => {
  return useQuery<BigNumber, Error>({
    queryKey: ["daoTreasuryBalance", daoAddress, network],
    queryFn: async () => {
      const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/accounts/${daoAddress}/balance`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch DAO treasury balance")
      }

      const mutez = await response.json()
      return mutezToXtz(new BigNumber(mutez))
    },
    enabled: !!daoAddress && !!networkNameMap[network]
  })
}
