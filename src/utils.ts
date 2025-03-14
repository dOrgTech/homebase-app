import { LambdaCode } from "services/bakingBad/lambdas"
import BigNumber from "bignumber.js"
import { EnvKey } from "services/config/constants"
import { getEnv } from "services/config/env"

export const roundNumber = ({ number, decimals }: { number: number; decimals: number }) =>
  Math.round(number * 10 ** decimals) / 10 ** decimals

export const parseLambdaCode = (lambdaCode: LambdaCode | undefined) => {
  if (!lambdaCode) {
    return ""
  }
  const code = JSON.stringify(
    {
      code: JSON.parse(lambdaCode.code),
      handler_check: JSON.parse(lambdaCode.handler_check),
      is_active: lambdaCode.is_active
    },
    null,
    2
  )

  return code
}

export const numberWithCommas = (x: number | BigNumber) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const getDaoHref = (daoId: string, daoType: string) => {
  const daoRouteIfLambda = daoType === "lambda" ? `dao/${daoId}` : `lite/dao/${daoId}`
  const daoHref =
    daoType !== "lambda" && daoType !== "lite"
      ? `${getEnv(EnvKey.REACT_APP_V2_URL)}/explorer/dao/${daoId}`
      : daoRouteIfLambda

  if (daoType === "etherlink_onchain") return `/explorer/etherlink/dao/${daoId}`
  return daoHref
}
