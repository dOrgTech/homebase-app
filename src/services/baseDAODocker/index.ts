import { Network } from "services/beacon"
import { DAOTemplate } from "modules/creator/state"
import { BaseStorageParams } from "services/contracts/baseDAO"
import { MetadataDeploymentResult } from "services/contracts/metadataCarrier/deploy"
import { storageParamsToBaseDAODockerArgs } from "./mappers"
import { GeneratorArgs, BaseDAODockerContractsDTO } from "./types"
import { getTokenMetadata } from "services/bakingBad/tokenBalances"
import { EnvKey, getEnv } from "services/config"

export const API_URL = getEnv(EnvKey.REACT_APP_BASEDAO_DOCKERISED_URL)

interface BaseDAODockerParams {
  template: DAOTemplate
  storage: BaseStorageParams
  originatorAddress: string
  metadata: MetadataDeploymentResult
  network: Network
  currentLevel: number
}

export const generateStorageContract = async ({
  storage,
  template,
  originatorAddress,
  metadata,
  network,
  currentLevel
}: BaseDAODockerParams): Promise<string> => {
  const tokenMetadata = await getTokenMetadata(
    storage.governanceToken.address,
    network,
    storage.governanceToken.tokenId
  )
  const args = storageParamsToBaseDAODockerArgs(storage, metadata, tokenMetadata, currentLevel)

  const url = `${API_URL}/${originatorAddress}/${template}?${Object.keys(args)
    .map(key => `${key}=${args[key as keyof GeneratorArgs]}`)
    .join("&")}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to make DAO Storage contract from BaseDAO-Dockerized API")
  }

  const result: BaseDAODockerContractsDTO = await response.json()

  return result.storage
}
