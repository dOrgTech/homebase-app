import { useQuery } from "react-query"
import { ethers } from "ethers"
import HbTokenAbi from "assets/abis/hb_evm.json"
import { getTokenHolders } from "modules/etherlink/utils"

interface DaoMember {
  address: string
  personalBalance: number
}

export const useDaoMembers = (network: string, token: string, decimals: number, provider: any) => {
  return useQuery<DaoMember[], Error>(
    ["daoMembers", network, token],
    async () => {
      if (!provider || !token || !network) {
        throw new Error("Missing required parameters")
      }

      // Fetch token holders from Blockscout
      const holdersData = await getTokenHolders(network, token)
      const holders = holdersData?.items || []

      if (holders.length === 0) {
        return []
      }

      const tokenContract = new ethers.Contract(token, HbTokenAbi.abi, provider)

      const results = await Promise.all(
        holders.map(async (holder: any) => {
          const address = holder.address.hash
          const blockscoutBalance = holder.value || "0"

          try {
            const balanceRaw = await tokenContract.balanceOf(address)
            const personalBalance = Number(balanceRaw) / Math.pow(10, decimals)
            return {
              address,
              personalBalance
            }
          } catch (_) {
            // Fallback to Blockscout balance if on-chain read fails
            const personalBalance = Number(blockscoutBalance) / Math.pow(10, decimals)
            return {
              address,
              personalBalance
            }
          }
        })
      )

      return results
    },
    {
      enabled: !!provider && !!token && !!network,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      retryDelay: 1000
    }
  )
}
