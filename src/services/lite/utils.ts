import { stringToBytes } from "@taquito/utils"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import { Choice } from "models/Choice"
import { networkNameMap } from "services/bakingBad"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk"
import BigNumber from "bignumber.js"
import { Network } from "services/beacon"

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

export const calculateWeightXTZ = (choice: Choice, totalXTZ: BigNumber) => {
  let choiceTotal = new BigNumber(0)
  let percent = new BigNumber(0)
  if (choice && choice.walletAddresses.length > 0) {
    choiceTotal = calculateChoiceTotal(choice.walletAddresses, 6)
    percent = choiceTotal.div(totalXTZ).multipliedBy(100)
  }
  return percent
}

export const calculateXTZTotal = (choices: Choice[] | undefined) => {
  let totalXTZ = new BigNumber(0)
  let choiceTotal = new BigNumber(0)
  if (choices) {
    choices.forEach((choice: Choice) => {
      choiceTotal = calculateChoiceTotal(choice.walletAddresses, 6)
      totalXTZ = totalXTZ.plus(choiceTotal)
    })
  }
  return totalXTZ
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

const getUsers = (options: Choice[]) => {
  const addresses: string[] = options.flatMap(option => option.walletAddresses.map(wallet => (wallet as any)?.address))
  return new Set(addresses)
}

export const getGroupedVotes = (options: Choice[]) => {
  const usersList = getUsers(options)
  const array = Array.from(usersList)

  const groupedVotes = array.map((address: string) => {
    const optionsList: any[] = []
    options.map((option: Choice) => {
      option.walletAddresses.map(addressVote => {
        if (addressVote.address === address) {
          const obj = {
            name: option.name,
            balance: addressVote.balanceAtReferenceBlock,
            cidLink: addressVote.cidLink,
            signature: addressVote.signature,
            payloadBytes: addressVote.payloadBytes
          }
          optionsList.push(obj)
        }
      })
    })
    const voteObj = {
      address: address,
      options: optionsList
    }
    return voteObj
  })
  return groupedVotes
}

export const getTotalVoters = (choices: Choice[]) => {
  const totalVoters = getUsers(choices)

  return totalVoters.size
}

export const getTreasuryPercentage = (proposalTotal: BigNumber, totalSupply: number, decimals: any) => {
  const formattedTotalSupply = new BigNumber(totalSupply).div(new BigNumber(10).pow(decimals))
  const value = proposalTotal.div(new BigNumber(formattedTotalSupply)).multipliedBy(100)
  return value
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
