import { BaseStorageParams } from "services/contracts/baseDAO";
import { xtzToMutez } from "services/contracts/utils";
import { GeneratorArgs } from "./types";
import { char2Bytes } from '@taquito/tzip16';
import { MetadataDeploymentResult } from 'services/contracts/metadataCarrier/deploy';

export const storageParamsToMorleyArgs = (storage: BaseStorageParams, metadata: MetadataDeploymentResult): GeneratorArgs => ({
  admin_address: storage.adminAddress,
  governance_token_address: `"${storage.governanceToken.address}"`,
  governance_token_id: `"${storage.governanceToken.tokenId}n"`,
  max_proposal_size: `2500n`,
  slash_division_value: `${storage.extra.slashDivisionValue}n`,
  slash_scale_value: `${storage.extra.slashScaleValue}n`,
  frozen_extra_value: `${storage.extra.frozenExtraValue}n`,
  frozen_scale_value: '0n',
  metadata_map: formatMetadata(metadata),
  quorum_treshold: `"{numerator=${storage.quorumTreshold}n; denominator=100n}"`,
  voting_period: `${storage.votingPeriod}n`,
  min_xtz_amount: `${xtzToMutez(storage.extra.minXtzAmount.toString())}mutez`,
  max_xtz_amount: `${xtzToMutez(storage.extra.maxXtzAmount.toString())}mutez`,
})

const formatMetadata = ({ deployAddress, keyName }: MetadataDeploymentResult) => {
  return `'(Big_map.literal [
    ("", 0x${char2Bytes(`tezos-storage://${deployAddress}/${keyName}`)});
  ] : metadata_map)'`;
}