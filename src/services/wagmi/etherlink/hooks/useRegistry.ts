import { useQuery } from "react-query"
import { ethers } from "ethers"
import { registryContractABI } from "modules/etherlink/utils"

export interface RegistryEntry {
  key: string
  value: string
}

export const useRegistry = (provider: any, registryAddress: string | undefined, network: string) => {
  return useQuery<RegistryEntry[], Error>(
    ["registry", network, registryAddress],
    async () => {
      if (!provider || !registryAddress || !network) {
        throw new Error("Missing required parameters")
      }

      if (!ethers.isAddress(registryAddress)) {
        throw new Error(`Invalid registry address: ${registryAddress}`)
      }

      console.log("[Registry RPC] Fetching from:", registryAddress, "on network:", network)

      const registryContract = new ethers.Contract(registryAddress, registryContractABI, provider)

      try {
        const [keys, values] = await Promise.all([registryContract.getAllKeys(), registryContract.getAllValues()])

        console.log("[Registry RPC] Raw keys:", keys)
        console.log("[Registry RPC] Raw values:", values)

        const keyArray = Array.isArray(keys) ? keys : []
        const valueArray = Array.isArray(values) ? values : []

        const entries: RegistryEntry[] = keyArray.map((key: string, index: number) => ({
          key,
          value: valueArray[index] || ""
        }))

        console.log("[Registry RPC] Mapped entries:", entries)
        console.log("[Registry Source] Using: RPC, data:", entries)

        return entries
      } catch (error) {
        console.error("[Registry RPC] Error fetching registry:", error)
        throw error
      }
    },
    {
      enabled: !!provider && !!registryAddress && !!network && ethers.isAddress(registryAddress || ""),
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: 1000
    }
  )
}
