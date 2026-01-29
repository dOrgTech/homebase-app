import { Network } from "services/beacon"
import { BlockchainStats } from "./types"
import { networkNameMap } from ".."
import { EnvKey, getEnv } from "services/config"

export const getNetworkStats = async (network: Network): Promise<BlockchainStats> => {
  if (network.startsWith("etherlink")) {
    const url = `${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/blocks/stats?network=${network}`
    const data = await fetch(url)
    if (!data.ok) {
      throw new Error("Failed to fetch contract storage from BakingBad API")
    }
    const result = await data.json()
    return {
      constants: result
    }
  }
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/protocols/current`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }

  const result: BlockchainStats = await response.json()

  return result
}

export const getNetworkHead = async (network: Network): Promise<number> => {
  if (network.startsWith("etherlink")) {
    const [_, etherlinkNetwork] = network.split("_")
    const reqUrl = `https://${
      etherlinkNetwork === "mainnet" ? "" : "testnet-"
    }explorer.etherlink.com/api/v2/blocks?type=block`

    const etherlinkData = await fetch(reqUrl).then(x => x.json())
    return etherlinkData.items[0].height || 0
  }
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/blocks/count`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }

  const result = await response.json()
  return result
}
