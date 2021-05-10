import { DAOTemplate } from "modules/creator/state"
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
}

export const generateStorageContract = async ({ storage, template, originatorAddress, metadata }: MorleyParams): Promise<string> => {
  const args = storageParamsToMorleyArgs(storage, metadata)

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