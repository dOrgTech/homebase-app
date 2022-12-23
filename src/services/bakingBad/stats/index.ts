import { Network } from "services/beacon"
import { BlockchainStats } from "./types"
import { networkNameMap } from ".."

export const getNetworkStats = async (network: Network): Promise<BlockchainStats> => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/protocols/current`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }

  const result: BlockchainStats = await response.json()

  return result
}

export const getNetworkHead = async (network: Network): Promise<number> => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/blocks/count`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }

  const result = await response.json()
  return result
}
