export interface Lambda {
  id: number
  active: boolean
  hash: string
  key: string
  value: LambdaCode
  firstLevel: number
  lastLevel: number
  updates: number
}

export interface LambdaCode {
  code: string
  is_active: boolean
  handler_check: string
}
