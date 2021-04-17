// import { MemberTokenAllocation } from './../contracts/baseDAO/types';
import { BaseStorageParams } from "services/contracts/baseDAO";
import { xtzToMutez } from "services/contracts/utils";
import { GeneratorArgs, MorleyContracts, MorleyContractsDTO } from "./types";
import { char2Bytes } from '@taquito/tzip16';
import { MetadataDeploymentResult } from 'services/contracts/metadataCarrier/deploy';

export const dtoToMorleyContracts = (dto: MorleyContractsDTO): MorleyContracts => {
  return {
    steps: {
      originator: dto.steps["00_originator.tz"],
      storage: `(${dto.steps["00_storage.tz"]})`,
      lambdas: [
        formatBytes(dto.steps["01_packed_lambda.tz"]),
        formatBytes(dto.steps["02_packed_lambda.tz"])
      ]
    },
    storage: dto.storage
  }
}

export const storageParamsToMorleyArgs = (storage: BaseStorageParams, metadata: MetadataDeploymentResult): GeneratorArgs => ({
  admin_address: storage.adminAddress,
  token_address: storage.adminAddress,
  max_proposal_size: `${storage.extra.maxProposalSize}n`,
  slash_division_value: `${storage.extra.slashDivisionValue}n`,
  slash_scale_value: `${storage.extra.slashScaleValue}n`,
  frozen_extra_value: `${storage.extra.frozenExtraValue}n`,
  // ledger: formatLedger(storage.membersTokenAllocation),
  metadata_map: formatMetadata(metadata),
  // quorum_treshold: `${storage.quorumTreshold}n`,
  // total_supply: formatTotalSupply(storage.membersTokenAllocation),
  // voting_period: `${storage.votingPeriod}n`,
  min_xtz_amount: `${xtzToMutez(storage.extra.minXtzAmount.toString())}mutez`,
  max_xtz_amount: `${xtzToMutez(storage.extra.maxXtzAmount.toString())}mutez`,
  //neutral - unused
})

const formatBytes = (value: string) => value.startsWith("0x") ? value.substring(2, value.length): value

// const formatLedger = (allocations: MemberTokenAllocation[]) => {
//   return `"(Big_map.literal [
//     ${allocations.map(({ address, amount, tokenId }) => `(("${address}", ${tokenId}), ${amount});\n`)}
//   ])"`;
// }

// const formatTotalSupply = (allocations: MemberTokenAllocation[]) => {
//   const allocationsByTokenId = allocations.reduce((prev, current) => {
//     const id = Number(current.tokenId)
//     prev[id] = prev[id]? prev[id] + Number(current.amount) : 0
//     return prev
//   }, {} as Record<number, number>)

//   return `"(Map.literal [
//     ${Object.entries(allocationsByTokenId).map(([tokenId, amount]) => `(${tokenId}, ${amount});\n`)}
//   ])"`
// }

const formatMetadata = ({ deployAddress, keyName }: MetadataDeploymentResult) => {
  return `'(Big_map.literal [
    ("", 0x${char2Bytes(`tezos-storage://${deployAddress}/${keyName}`)});
  ] : metadata_map)'`;
}