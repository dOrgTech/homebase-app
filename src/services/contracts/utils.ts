import { BigNumber } from "bignumber.js"
import blockies from "blockies-ts"

export const stringToHex = (value: string): string => {
  let result = ""

  for (let i = 0; i < value.length; i++) {
    result += value.charCodeAt(i).toString(16).slice(-4)
  }

  return result
}

export const toShortAddress = (address: string, limit = 4): string => {
  return address
    ?.slice(0, limit)
    .concat("...")
    .concat(address.slice(address.length - limit, address.length))
}

export const mutezToXtz = (mutez: BigNumber) => {
  return parseUnits(mutez, 6)
}

export const xtzToMutez = (xtz: BigNumber) => {
  return formatUnits(xtz, 6)
}

export const parseUnits = (amount: BigNumber, decimals: number | string) => {
  return amount.div(new BigNumber(10).pow(decimals))
}

export const formatUnits = (amount: BigNumber, decimals: number | string) => {
  return amount.multipliedBy(new BigNumber(10).pow(decimals))
}

const b582int = (val: string): string => {
  let rv = new BigNumber(0)
  const alpha = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  for (let i = 0; i < val.length; i++) {
    rv = rv.plus(
      new BigNumber(alpha.indexOf(val[val.length - 1 - i])).multipliedBy(new BigNumber(alpha.length).exponentiatedBy(i))
    )
  }

  return rv.toString(16)
}

export const getBlockie = (address: string): string => {
  if (address.startsWith("tz") || address.startsWith("kt")) {
    return blockies
      .create({
        seed: `0${b582int(address)}`,
        spotcolor: "#000"
      })
      .toDataURL()
  }

  return blockies.create({ seed: address }).toDataURL()
}

/**
 * Format voting weight with decimal adjustment and abbreviations (K, M, B, T)
 * @param amount - The raw amount as string or BigInt
 * @param decimals - Token decimals
 * @returns Formatted string with abbreviation
 */
export const formatVotingWeight = (amount: string | bigint, decimals: number): string => {
  const amountBigInt = typeof amount === "string" ? BigInt(amount) : amount
  const divisor = BigInt(10) ** BigInt(decimals)
  const nominalValue = amountBigInt / divisor

  const value = Number(nominalValue)

  if (value < 1000) {
    return value.toFixed(0)
  } else if (value < 1000000) {
    const result = value / 1000
    return result === Math.floor(result) ? `${result.toFixed(0)}K` : `${result.toFixed(1)}K`
  } else if (value < 1000000000) {
    const result = value / 1000000
    return result === Math.floor(result) ? `${result.toFixed(0)}M` : `${result.toFixed(1)}M`
  } else if (value < 1000000000000) {
    const result = value / 1000000000
    return result === Math.floor(result) ? `${result.toFixed(0)}B` : `${result.toFixed(1)}B`
  } else {
    const result = value / 1000000000000
    return result === Math.floor(result) ? `${result.toFixed(0)}T` : `${result.toFixed(1)}T`
  }
}
