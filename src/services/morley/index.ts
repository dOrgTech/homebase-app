import { Network } from './../beacon/context';
import { DAOTemplate } from "modules/creator/state"
import { getTokenMetadata } from "services/bakingBad/tokens"
import { BaseStorageParams } from "services/contracts/baseDAO"
import { MetadataDeploymentResult } from "services/contracts/metadataCarrier/deploy"
import { storageParamsToMorleyArgs } from "./mappers"
import { GeneratorArgs, MorleyContractsDTO } from "./types"

export const API_URL = "https://morley-large-originator.herokuapp.com/steps"

interface MorleyParams {
  template: DAOTemplate;
  storage: BaseStorageParams;
  originatorAddress: string;
  metadata: MetadataDeploymentResult
  network: Network
}

export const generateStorageContract = async ({ storage, template, originatorAddress, metadata, network }: MorleyParams): Promise<string> => {
  const tokenMetadata = await getTokenMetadata(storage.governanceToken.address, network, storage.governanceToken.tokenId)
  const args = storageParamsToMorleyArgs(storage, metadata, tokenMetadata)

  const url = `${API_URL}/${originatorAddress}/${template}?${Object.keys(args).map(
    (key) => `${key}=${args[key as keyof GeneratorArgs]}`
  ).join("&")}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch ledger addresses from BakingBad API");
  }

  const result: MorleyContractsDTO = await response.json();
  
  return result.storage
}