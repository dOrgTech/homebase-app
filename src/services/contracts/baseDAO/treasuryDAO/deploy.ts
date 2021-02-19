import {
  MichelsonMap,
  OriginationWalletOperation,
  TezosToolkit,
} from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";

import { MetadataCarrierDeploymentData } from "services/contracts/baseDAO/metadataCarrier/types";
import contractCode from "services/contracts/baseDAO/treasuryDAO/michelson/contract";
import {
  MemberTokenAllocation,
  TreasuryParams,
} from "services/contracts/baseDAO/treasuryDAO/types";

const setMembersAllocation = (allocations: MemberTokenAllocation[]) => {
  const map = new MichelsonMap();

  allocations.forEach((allocation) => {
    map.set(
      { 0: allocation.address, 1: allocation.tokenId },
      allocation.amount
    );
  });

  return map;
};

const setMetadata = ({
  deployAddress,
  keyName,
}: MetadataCarrierDeploymentData) => {
  const map = new MichelsonMap();

  map.set("", char2Bytes(`tezos-storage://${deployAddress}/${keyName}`));

  return map;
};

export const deployTreasuryDAO = async ({
  storage: {
    membersTokenAllocation,
    adminAddress,
    frozenScaleValue,
    frozenExtraValue,
    slashScaleValue,
    slashDivisionValue,
    minXtzAmount,
    maxXtzAmount,
    maxProposalSize,
    quorumTreshold,
    votingPeriod,
  },
  metadataCarrierDeploymentData,
  tezos,
}: TreasuryParams & {
  tezos: TezosToolkit;
}): Promise<OriginationWalletOperation | void> => {
  if (!metadataCarrierDeploymentData.deployAddress) {
    throw new Error(
      "Error deploying treasury DAO: There's not address of metadata"
    );
  }
  const ledger = setMembersAllocation(membersTokenAllocation);
  const metadata = setMetadata(metadataCarrierDeploymentData);

  try {
    const t = await tezos.wallet.originate({
      code: contractCode,
      storage: {
        ledger,
        operators: new MichelsonMap(),
        token_address: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
        admin: adminAddress,
        pending_owner: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
        migration_status: { notInMigration: "Unit" },
        voting_period: votingPeriod,
        quorum_threshold: quorumTreshold,
        extra: {
          frozen_scale_value: frozenScaleValue,
          frozen_extra_value: frozenExtraValue,
          slash_scale_value: slashScaleValue,
          slash_division_value: slashDivisionValue,
          min_xtz_amount: minXtzAmount,
          max_xtz_amount: maxXtzAmount,
          max_proposal_size: maxProposalSize,
        },
        proposals: new MichelsonMap(),
        proposal_key_list_sort_by_date: [],
        permits_counter: 0,
        metadata,
      },
    });

    return await t.send();
  } catch (e) {
    if (e.name === "UnconfiguredSignerError") {
      console.log("Please connect your wallet before deploying");
    }
    console.log("error ", e);
  }
};
