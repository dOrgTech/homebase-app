import { LambdaCode } from "services/bakingBad/lambdas"

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
