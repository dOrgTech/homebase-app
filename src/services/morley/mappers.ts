import { BaseStorageParams, MemberTokenAllocation } from "services/contracts/baseDAO";
import { xtzToMutez } from "services/contracts/utils";
import { GeneratorArgs } from "./types";
import { char2Bytes } from '@taquito/tzip16';
import { MetadataDeploymentResult } from 'services/contracts/metadataCarrier/deploy';

export const storageParamsToMorleyArgs = (storage: BaseStorageParams, metadata: MetadataDeploymentResult): GeneratorArgs => ({
  admin_address: storage.adminAddress,
  governance_token_address: `"${storage.governanceToken.address}"`,
  governance_token_id: `"${storage.governanceToken.tokenId}n"`,
  max_proposal_size: `${storage.extra.maxProposalSize}n`,
  slash_division_value: `${storage.extra.slashDivisionValue}n`,
  slash_scale_value: `${storage.extra.slashScaleValue}n`,
  frozen_extra_value: `${storage.extra.frozenExtraValue}n`,
  frozen_scale_value: '0n',
  ledger: formatLedger(storage.membersTokenAllocation),
  metadata_map: formatMetadata(metadata),
  quorum_treshold: `"{numerator=${storage.quorumTreshold}n; denominator=100n}"`,
  voting_period: `${storage.votingPeriod}n`,
  min_xtz_amount: `${xtzToMutez(storage.extra.minXtzAmount.toString())}mutez`,
  max_xtz_amount: `${xtzToMutez(storage.extra.maxXtzAmount.toString())}mutez`,
})

const formatLedger = (allocations: MemberTokenAllocation[]) => {
  return `'[
    ${allocations.map(({ address, amount, tokenId }) => `((("${address}": address), ${tokenId}n), ${amount}n);\n`)}
  ]'`;
}

const formatMetadata = ({ deployAddress, keyName }: MetadataDeploymentResult) => {
  return `'(Big_map.literal [
    ("", 0x${char2Bytes(`tezos-storage://${deployAddress}/${keyName}`)});
  ] : metadata_map)'`;
}