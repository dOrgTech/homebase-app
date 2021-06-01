import { BaseStorageParams } from "services/contracts/baseDAO";
import { xtzToMutez } from "services/contracts/utils";
import { GeneratorArgs } from "./types";
import { char2Bytes } from '@taquito/tzip16';
import { MetadataDeploymentResult } from 'services/contracts/metadataCarrier/deploy';
import { TokenMetadata } from "services/bakingBad/tokens";

export const storageParamsToBaseDAODockerArgs = (storage: BaseStorageParams, metadata: MetadataDeploymentResult, tokenMetadata: TokenMetadata): GeneratorArgs => ({
  admin_address: storage.adminAddress,
  guardian_address: storage.guardian,
  governance_token_address: `"${storage.governanceToken.address}"`,
  governance_token_id: `"${storage.governanceToken.tokenId}n"`,
  max_proposal_size: `2500n`,
  slash_division_value: `${storage.extra.slashDivisionValue}n`,
  slash_scale_value: `${storage.extra.slashScaleValue}n`,
  frozen_extra_value: `${storage.extra.frozenExtraValue}n`,
  frozen_scale_value: '0n',
  metadata_map: formatMetadata(metadata),
  quorum_threshold: `${storage.quorumThreshold}n`,
  min_quorum: `${storage.minQuorumAmount}n`,
  max_quorum: `${storage.maxQuorumAmount}n`,
  quorum_change: `${storage.quorumChange}n`,
  max_quorum_change: `${storage.maxQuorumAmount}n`,
  proposal_flush_time: `${storage.proposalFlushPeriod}n`,
  proposal_expired_time: `${storage.proposalExpiryPeriod}n`,
  governance_total_supply: `${tokenMetadata.supply}n`,
  period: `${storage.votingPeriod}n`,
  max_votes: `${tokenMetadata.supply}n`,
  min_xtz_amount: `${xtzToMutez(storage.extra.minXtzAmount.toString())}mutez`,
  max_xtz_amount: `${xtzToMutez(storage.extra.maxXtzAmount.toString())}mutez`,
})

const formatMetadata = ({ deployAddress, keyName }: MetadataDeploymentResult) => {
  return `'(Big_map.literal [
    ("", 0x${char2Bytes(`tezos-storage://${deployAddress}/${keyName}`)});
  ])'`;
}