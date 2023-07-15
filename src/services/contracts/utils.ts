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
    .slice(0, limit)
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
