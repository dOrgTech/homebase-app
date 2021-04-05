import { DAOTemplate } from "modules/creator/state"
import { BaseStorageParams } from "services/contracts/baseDAO"
import { dtoToMorleyContracts, storageToArgs } from "./mappers"
import { GeneratorArgs, MorleyContractsDTO } from "./types"

export const API_URL = "https://cors-container.herokuapp.com/https://morley-large-originator.herokuapp.com/steps"

export const generateMorleyContracts = async (template: DAOTemplate, storage: BaseStorageParams, originatorAddress: string) => {

  const args = storageToArgs(storage)

  const url = `${API_URL}/${originatorAddress}/${template}?${Object.keys(args).map(
    (key) => `${key}=${args[key as keyof GeneratorArgs]}`
  ).join("&")}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch ledger addresses from BakingBad API");
  }

  const result: MorleyContractsDTO = await response.json();
  
  return dtoToMorleyContracts(result)
}