import BigNumber from "bignumber.js"

export const formatNumber = (number: BigNumber) => {
  if (number.isLessThan(1e3))
    return number
      .dp(1)
      .toString()
      .replace(/[.,]0$/, "")
  if (number.isGreaterThanOrEqualTo(1e3) && number.isLessThan(1e6)) return +number.dividedBy(1e3).dp(1).toString() + "K"
  if (number.isGreaterThanOrEqualTo(1e6) && number.isLessThan(1e9)) return +number.dividedBy(1e6).dp(1).toString() + "M"
  if (number.isGreaterThanOrEqualTo(1e9) && number.isLessThan(1e12))
    return +number.dividedBy(1e9).dp(1).toString() + "B"
  if (number.isGreaterThanOrEqualTo(1e12)) return +number.dividedBy(1e12).dp(1).toString() + "T"
}
