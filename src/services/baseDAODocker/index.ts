import { Network } from '../beacon/context';
import { DAOTemplate } from "modules/creator/state"
import { getTokenMetadata } from "services/bakingBad/tokens"
import { BaseStorageParams } from "services/contracts/baseDAO"
import { MetadataDeploymentResult } from "services/contracts/metadataCarrier/deploy"
import { storageParamsToBaseDAODockerArgs } from "./mappers"
import { GeneratorArgs, BaseDAODockerContractsDTO } from "./types"

export const API_URL = "https://basedao-dockerized.herokuapp.com/steps"

interface BaseDAODockerParams {
  template: DAOTemplate;
  storage: BaseStorageParams;
  originatorAddress: string;
  metadata: MetadataDeploymentResult
  network: Network
}

export const generateStorageContract = async ({ storage, template, originatorAddress, metadata, network }: BaseDAODockerParams): Promise<string> => {
  const tokenMetadata = await getTokenMetadata(storage.governanceToken.address, network, storage.governanceToken.tokenId)
  const args = storageParamsToBaseDAODockerArgs(storage, metadata, tokenMetadata)

  const url = `${API_URL}/${originatorAddress}/${template}?${Object.keys(args).map(
    (key) => `${key}=${args[key as keyof GeneratorArgs]}`
  ).join("&")}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to make DAO Storage contract from BaseDAO-Dockerized API");
  }

  const result: BaseDAODockerContractsDTO = await response.json();
  
  return result.storage
}