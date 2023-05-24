import BigNumber from "bignumber.js"

export const numberWithCommas = (x: number | BigNumber) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
