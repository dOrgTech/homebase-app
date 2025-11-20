import { stringToBytes, hex2buf, validateContractAddress } from "@taquito/utils"
import { isAddress as isEtherAddress } from "ethers"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import { Choice } from "models/Choice"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk"
import BigNumber from "bignumber.js"
import { Network } from "services/beacon"
import { networkNameMap } from "services/bakingBad"
import { signMessage } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { EnvKey, getEnv } from "services/config"

export const hexStringToBytes = (hex: string): string => {
  return Buffer.from(hex2buf(hex)).toString("utf8")
}

export const getCurrentBlock = async (network: Network) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/head`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract current block")
  }

  const result = await response.json()

  return result.level
}

export const getTotalSupplyAtReferenceBlock = async (network: Network, address: string, level: number) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${address}/bigmaps/token_total_supply/historical_keys/${level}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract current block")
  }

  const result = await response.json()

  return result[0].value
}

export const getTokenHoldersCount = async (network: Network, address: string, tokenID: number) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens?tokenId=${tokenID}&contract=${address}`
  if (network.startsWith("etherlink")) {
    const url = `${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/token?network=${network}&contract=${address}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Failed to fetch contract current block")
    }
    const result = await response.json()
    return result[0].holders
  } else {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch contract current block")
    }

    const result = await response.json()
    return result[0].holdersCount
  }
}

export const hasTokenBalance = async (network: Network, account: string, contract: any) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/balances?account=${account}&token.contract=${contract}`
  // Temporary fix for etherlink
  if (network.startsWith("etherlink")) {
    return false
  }
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract current block")
  }

  const result = await response.json()

  let hasBalance = false

  if (result && result[0]) {
    if (result[0].balance > 0) {
      hasBalance = true
    } else {
      hasBalance = false
    }
  } else {
    hasBalance = false
  }

  return hasBalance
}

export const getTurnoutValue = async (
  network: Network,
  address: string,
  tokenID: number,
  level: number,
  voters: number
) => {
  const tokenHoldersCount = await getTokenHoldersCount(network, address, tokenID)

  if (tokenHoldersCount) {
    return (voters * 100) / Number(tokenHoldersCount)
  }
}

export const isProposalActive = (date: number) => {
  const config = {
    rounding: Math.floor
  }
  dayjs.extend(relativeTime, config)
  dayjs.extend(updateLocale)
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "%s left",
      past: "%s ago",
      s: "a few seconds",
      m: "1 minute",
      mm: "%d minutes",
      h: "1 hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "1 month",
      MM: "%d months",
      y: "1 year",
      yy: "%d years"
    }
  })
  const remainingDate = dayjs(date).fromNow()
  return remainingDate
}

export const calculateWeight = (totalSupply: any, balance: any, decimals: any) => {
  const formattedTotalSupply = new BigNumber(totalSupply).div(new BigNumber(10).pow(decimals))
  const percent = balance.div(formattedTotalSupply).multipliedBy(100)
  return percent
}

export const calculateChoiceTotal = (choice_voters: any[], decimals: any) => {
  let total = new BigNumber(0)
  choice_voters.map(voter => {
    total = new BigNumber(voter.balanceAtReferenceBlock).plus(total)
  })
  const result = new BigNumber(total).div(new BigNumber(10).pow(decimals))

  return result
}

export const calculateProposalTotal = (choices: Choice[], decimals: any) => {
  let total = new BigNumber(0)
  choices.map((choice: any) => {
    choice.walletAddresses.map((elem: any) => {
      total = new BigNumber(elem.balanceAtReferenceBlock).plus(total)
    })
  })
  const result = total.div(new BigNumber(10).pow(decimals))
  return result
}

export const getTotalVoters = (choices: Choice[]) => {
  let votersTotal = 0
  choices.map((choice: Choice) => {
    votersTotal += choice.walletAddresses.length
  })
  return votersTotal
}

export const getTreasuryPercentage = (proposalTotal: BigNumber, totalSupply: number, decimals: any) => {
  const formattedTotalSupply = new BigNumber(totalSupply).div(new BigNumber(10).pow(decimals))
  const value = proposalTotal.div(new BigNumber(formattedTotalSupply)).multipliedBy(100)
  return value
}

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]

export const nFormatter = (num: any, digits: number) => {
  return num.toString()
}

export const formatByDecimals = (value: string, decimals: string) => {
  return nFormatter(new BigNumber(value).div(new BigNumber(10).pow(decimals)), 1)
}

export const getSignature = async (userAddress: string, wallet: BeaconWallet, data?: string) => {
  const formattedInput: string = [
    "Tezos Signed Message:",
    process.env.REACT_APP_BASE_URL,
    new Date().toISOString(),
    data
  ].join(" ")

  const bytes = stringToBytes(formattedInput)
  const payloadBytes = "05" + "0100" + stringToBytes(bytes.length.toString()) + bytes

  const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
    sourceAddress: userAddress
  }

  const signedPayload = await wallet?.client.requestSignPayload(payload)
  const { signature } = signedPayload

  return { signature, payloadBytes }
}

export const getEthSignature = async (userAddress: any, data?: string) => {
  const formattedInput: string = [
    "Tezos Signed Message:",
    process.env.REACT_APP_BASE_URL,
    new Date().toISOString(),
    data
  ].join(" ")
  const signature = await signMessage(wagmiConfig, {
    account: userAddress,
    message: formattedInput
  })
  return {
    signature,
    payloadBytes: formattedInput
  }
}

export const getStatusDate = async (level: number, network: Network) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/blocks/${level}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract current block")
  }

  const result = await response.json()

  return result.timestamp
}

export const validateTokenAddress = (network: Network, tokenAddress: string) => {
  // console.log({ network, tokenAddress, isValid: isEtherAddress(tokenAddress) })
  if (!network.startsWith("etherlink")) return validateContractAddress(tokenAddress)
  if (network.startsWith("etherlink")) return isEtherAddress(tokenAddress) ? 3 : false
  return false
}

export const sendProposalCreatedEvent = async (
  network: Network,
  proposerAddress: string,
  daoName: string,
  daoAddress: string
) => {
  const url = getEnv(EnvKey.REACT_APP_PROPOSAL_WEBHOOK_URL)
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      network,
      proposer: proposerAddress,
      dao_name: daoName,
      dao_address: daoAddress
    })
  })
  if (!response.ok) {
    console.error("Failed to send proposal created event", response)
    return false
  }
  return true
}
