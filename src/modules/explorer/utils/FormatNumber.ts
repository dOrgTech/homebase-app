import BigNumber from "bignumber.js";

export const formatNumber = (number: BigNumber) => {
  if (number.isLessThan(1e3)) return number.toFixed(1).replace(/[.,]0$/, "");
  if (number.isGreaterThanOrEqualTo(1e3) && number.isLessThan(1e6)) return +(number.dividedBy(1e3)).toFixed(1) + "K";
  if (number.isGreaterThanOrEqualTo(1e6) && number.isLessThan(1e9)) return +(number.dividedBy(1e6)).toFixed(1) + "M";
  if (number.isGreaterThanOrEqualTo(1e9) && number.isLessThan(1e12)) return +(number.dividedBy(1e9)).toFixed(1) + "B";
  if (number.isGreaterThanOrEqualTo(1e12)) return +(number.dividedBy(1e12)).toFixed(1) + "T";
};
