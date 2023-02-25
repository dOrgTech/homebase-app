export type TokenContractSettings = {
  name: string
  description: string
  totalSupply: number | null
  decimals: number | null
  symbol: string
  icon: string
}

export type TokenDistributionSettings = {
  holders: Holder[]
}

export type Holder = {
  walletAddress: string
  amount: number | null
}

export interface TokenContractParams {
  tokenSettings: TokenContractSettings
  tokenDistribution: TokenDistributionSettings
}

export type ErrorValues<T> = Partial<Record<keyof T, string>>

type DeploymentStatus = {
  deploying: boolean
  successful: boolean
  contract?: string
}

export type DeploymentState = {
  data: TokenContractParams
  deploymentStatus: DeploymentStatus
}

export interface StepInfo {
  title: string
  index: number
  path: string
}

function updateTokenSettings(contractInfo: TokenContractSettings) {
  return <const>{
    type: ActionTypes.UPDATE_TOKEN_SETTINGS,
    contractInfo
  }
}

function updateTokenDistribution(distribution: TokenDistributionSettings) {
  return <const>{
    type: ActionTypes.UPDATE_TOKEN_DISTRIBUTION,
    distribution
  }
}

function updateDeploymentStatus({ deploying, contract }: DeploymentStatus) {
  return <const>{
    type: ActionTypes.UPDATE_DEPLOYMENT_STATUS,
    status: { deploying, contract }
  }
}

function clearCache() {
  return <const>{
    type: ActionTypes.CLEAR_CACHE
  }
}

export type DeploymentAction = ReturnType<
  typeof updateTokenSettings | typeof updateDeploymentStatus | typeof clearCache | typeof updateTokenDistribution
>

export enum ActionTypes {
  UPDATE_TOKEN_SETTINGS = "UPDATE_TOKEN_SETTINGS",
  UPDATE_TOKEN_DISTRIBUTION = "UPDATE_TOKEN_DISTRIBUTION",
  UPDATE_DEPLOYMENT_STATUS = "UPDATE_DEPLOYMENT_STATUS",
  CLEAR_CACHE = "CLEAR_CACHE"
}
export interface TokenHolder {
  address: string
  balance: number
  name?: string
}
