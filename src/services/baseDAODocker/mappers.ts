import { BaseStorageParams } from "services/contracts/baseDAO"
import { formatUnits, xtzToMutez } from "services/contracts/utils"
import { GeneratorArgs } from "./types"
import { char2Bytes } from "@taquito/tzip16"
import { MetadataDeploymentResult } from "services/contracts/metadataCarrier/deploy"
import { BigNumber } from "bignumber.js"
import { Token } from "models/Token"

export const storageParamsToBaseDAODockerArgs = (
  storage: BaseStorageParams,
  metadata: MetadataDeploymentResult,
  token: Token,
  currentLevel: number
): GeneratorArgs => ({
  admin_address: storage.adminAddress,
  guardian_address: storage.guardian,
  governance_token_address: `"${storage.governanceToken.address}"`,
  governance_token_id: `"${storage.governanceToken.tokenId}n"`,
  max_proposal_size: `2500n`,
  slash_division_value: `100n`,
  slash_scale_value: `${storage.extra.slashScaleValue.toFixed()}n`,
  frozen_extra_value: `${formatUnits(storage.extra.frozenExtraValue, token.decimals).toFixed()}n`,
  frozen_scale_value: "0n",
  metadata_map: formatMetadata(metadata),
  quorum_threshold: `${storage.quorumThreshold.toFixed()}n`,
  min_quorum: `${storage.minQuorumAmount}n`,
  max_quorum: `${storage.maxQuorumAmount}n`,
  quorum_change: `${storage.quorumChange}n`,
  max_quorum_change: `${storage.quorumMaxChange}n`,
  proposal_flush_level: `${storage.proposalFlushPeriod}n`,
  proposal_expired_level: `${storage.proposalExpiryPeriod}n`,
  governance_total_supply: `${token.supply.toFixed()}n`,
  period: `${storage.votingPeriod}n`,
  start_level: `${currentLevel}n`,
  min_xtz_amount: `${xtzToMutez(new BigNumber(storage.extra.minXtzAmount)).toFixed()}mutez`,
  max_xtz_amount: `${xtzToMutez(new BigNumber(storage.extra.maxXtzAmount)).toFixed()}mutez`
})

const formatMetadata = ({ deployAddress, keyName }: MetadataDeploymentResult) => {
  return `'(Big_map.literal [
    ("", 0x${char2Bytes(`tezos-storage://${deployAddress}/${keyName}`)});
  ])'`
}
