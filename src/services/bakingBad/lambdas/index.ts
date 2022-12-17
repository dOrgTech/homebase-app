import { Network } from "services/beacon"
import { Lambda } from "./types"
import { networkNameMap } from ".."

export * from "./types"
export * from "./constants"

export const getDAOLambdas = async (daoId: string, network: Network): Promise<Array<Lambda>> => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${daoId}/bigmaps/extra.lambdas/keys`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }

  const result: Lambda[] = await response.json()

  return result
}

export const getDAOLambda = async (daoId: string, network: Network, lambda_name: string): Promise<Lambda> => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${daoId}/bigmaps/extra.lambdas/keys/${lambda_name}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch contract storage from BakingBad API")
  }

  const result: Lambda = await response.json()

  return result
}
