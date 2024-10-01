import { Network } from "services/beacon"
import { BlockchainStats } from "./types"
import { networkNameMap } from ".."

export const getNetworkStats = async (network: Network): Promise<BlockchainStats> => {
  if (network.startsWith("etherlink")) {
    const [_, etherlinkNetwork] = network.split("_")

    const reqUrl = `https://${
      etherlinkNetwork === "mainnet" ? "" : "testnet-"
    }explorer.etherlink.com/api/v2/blocks?type=block`

    const etherlinkData = await fetch(reqUrl).then(x => x.json())
    const firstTwoBlocks = [etherlinkData.items[0], etherlinkData.items[1]]
    const timeDifference = Math.ceil(
      (new Date(firstTwoBlocks[0].timestamp).getTime() - new Date(firstTwoBlocks[1].timestamp).getTime()) / 1000
    )

    return {
      constants: {
        timeBetweenBlocks: timeDifference
      }
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
