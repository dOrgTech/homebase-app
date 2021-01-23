import { MichelsonMap, TezosToolkit } from "@taquito/taquito";
import { code } from '../contracts/treasuryDAO/code'
import { InMemorySigner } from "@taquito/signer";
import {
  MemberTokenAllocation,
  TreasuryStorageParams,
} from "../contracts/treasuryDAO/types";

const Tezos = new TezosToolkit("https://api.tez.ie/rpc/delphinet");

const membersAllocationToMichelsonMap = (
  allocations: MemberTokenAllocation[]
) => {
  const map = new MichelsonMap();

  allocations.forEach((allocation) => {
    map.set(
      { 0: allocation.address, 1: allocation.tokenId },
      allocation.amount
    );
  });

  return map;
};

export const deployContract = async ({
  membersTokenAllocation,
  adminAddress,
  frozenScaleValue,
  frozenExtraValue,
  slashScaleValue,
  slashDivisionValue,
  minXtzAmount,
  maxXtzAmount,
  maxProposalSize,
}: TreasuryStorageParams) => {
  
  const ledger = membersAllocationToMichelsonMap(membersTokenAllocation)
  const operators = new MichelsonMap();
  const proposals = new MichelsonMap();

  try {
    Tezos.setProvider({
      signer: await InMemorySigner.fromSecretKey(
        "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
      ),
    });
    console.log("Originating");
    const t = await Tezos.contract.originate({
      code,
      storage: {
        sLedger: ledger,
        sOperators: operators,
        sTokenAddress: "",
        sAdmin: adminAddress,
        sPendingOwner: "",
        sMigrationStatus: { notInMigration: "Unit" },
        sVotingPeriod: 1,
        sQuorumThreshold: 1,
        sExtra: {
          frozen_scale_value: frozenScaleValue,
          frozen_extra_value: frozenExtraValue,
          slash_scale_value: slashScaleValue,
          slash_division_value: slashDivisionValue,
          min_xtz_amount: minXtzAmount,
          max_xtz_amount: maxXtzAmount,
          max_proposal_size: maxProposalSize,
        },
        sProposals: proposals,
        sProposalKeyListSortByDate: [],
        sPermitsCounter: 0,
      },
    });
    console.log("waiting for confirmation ", t);
    const c = await t.contract();
    console.log("deployment completed", c);
  } catch (e) {
    console.log("error ", e);
  }
};
