import { MichelsonMap } from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";
import { MetadataCarrierDeploymentData } from "../metadataCarrier/types";
import { getTestProvider } from "../utils";
import { code } from "./code";
import { MemberTokenAllocation, TreasuryParams } from "./types";

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
}: TreasuryParams) => {
  const ledger = setMembersAllocation(membersTokenAllocation);
  const metadata = setMetadata(metadataCarrierDeploymentData);

  try {
    if (tezos) {
      const test = await tezos.wallet
        .originate({
          code,
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
        })
        .send();
      console.log("Waiting for confirmation on Treasury DAO contract...", test);
      const c = await test.contract();
      console.log("Treasury DAO deployment completed", c);
      return;
    }

    const Tezos = await getTestProvider();

    console.log("Originating Treasury DAO contract...");

    const t = await Tezos.contract.originate({
      code,
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
    console.log("Waiting for confirmation on Treasury DAO contract...", t);
    const c = await t.contract();
    console.log("Treasury DAO deployment completed", c);
    return c;
  } catch (e) {
    console.log("error ", e);
  }
};
