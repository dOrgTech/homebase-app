import { BaseStorageParams } from "services/contracts/baseDAO";
import { xtzToMutez } from "services/contracts/utils";
import { GeneratorArgs, MorleyContracts, MorleyContractsDTO } from "./types";

export const dtoToMorleyContracts = (dto: MorleyContractsDTO): MorleyContracts => {
  return {
    steps: {
      originator: dto.steps["00_originator.tz"],
      storage: `(${dto.steps["00_storage.tz"]})`,
      lambda1: formatBytes(dto.steps["01_packed_lambda.tz"]),
      lambda2: formatBytes(dto.steps["02_packed_lambda.tz"])
    },
    storage: dto.storage
  }
}

export const storageToArgs = (storage: BaseStorageParams): GeneratorArgs => ({
  admin_address: storage.adminAddress,
  //TODO: token address = admin address?
  token_address: storage.adminAddress,
  frozen_extra_value: `${storage.extra.frozenExtraValue}n`,
  frozen_scale_value: `${storage.extra.frozenScaleValue}n`,
  max_proposal_size: `${storage.extra.maxProposalSize}n`,
  slash_division_value: `${storage.extra.slashDivisionValue}n`,
  slash_scale_value: `${storage.extra.slashScaleValue}n`,
  min_xtz_amount: `${xtzToMutez(storage.extra.minXtzAmount.toString())}mutez`,
  max_xtz_amount: `${xtzToMutez(storage.extra.maxXtzAmount.toString())}mutez`
})

export const formatBytes = (value: string) => value.startsWith("0x") ? value.replace("0x", ""): value