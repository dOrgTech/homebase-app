import { bytes2Char, char2Bytes } from "@taquito/tzip16"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import { Choice } from "models/Choice"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk"
import BigNumber from "bignumber.js"
import { Network } from "services/beacon"
import { networkNameMap } from "services/bakingBad"
import { TezosToolkit } from "@taquito/taquito"
import { EnvKey, getEnv } from "services/config"

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

export const getUserTotalSupplyAtReferenceBlock = async (
  network: Network,
  address: string,
  level: number,
  userAddress: string
) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${address}/bigmaps/ledger/historical_keys/${level}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract current block")
  }

  const result = await response.json()

  let userBalance

  if (result && result.length > 0) {
    userBalance = result.find((elem: any) => elem.key.address === userAddress)
    return userBalance.value
  }
  return 0
}

export const hasTokenBalance = async (network: Network, account: string, contract: any) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/balances?account=${account}&token.contract=${contract}`
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

export const getTurnoutValue = async (network: Network, address: string, level: number, voters: number) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${address}/bigmaps/ledger/historical_keys/${level}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract current block")
  }
  const result = await response.json()

  if (result) {
    return (voters * 100) / result.length
  }

  return 0
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

export const getSignature = async (
  userAddress: string,
  wallet: BeaconWallet,
  network: Network,
  data?: string,
  tezos?: TezosToolkit
) => {
  const formattedInput: string = [
    "Tezos Signed Message:",
    process.env.REACT_APP_BASE_URL,
    new Date().toISOString(),
    data
  ].join(" ")

  const bytes = char2Bytes(formattedInput)
  const payloadBytes = "05" + "0100" + char2Bytes(bytes.length.toString()) + bytes

  const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
    sourceAddress: userAddress
  }

  let signature

  if (getEnv(EnvKey.REACT_APP_IS_NOT_TESTING) !== "true" && tezos) {
    const { sig: walletSign } = await tezos?.signer.sign(bytes)
    signature = walletSign
  } else {
    const signedPayload = await wallet?.client.requestSignPayload(payload)
    const { signature: walletSign } = signedPayload
    signature = walletSign
  }

  return { signature, payloadBytes }
}
