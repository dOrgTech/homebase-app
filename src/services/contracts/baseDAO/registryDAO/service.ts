import { TezosToolkit, MichelsonMap, Wallet } from "@taquito/taquito";
import {
  fromStateToBaseStorage,
  setMembersAllocation,
  setMetadata,
} from "../utils";
import { RegistryParams } from "./types";
import code from "services/contracts/baseDAO/registryDAO/michelson/contract";
import { MigrationParams } from "services/contracts/baseDAO/types";
import { ContractAbstraction } from "@taquito/taquito";

export const deployRegistryDAO = async ({
  storage: {
    membersTokenAllocation,
    adminAddress,
    extra: {
      frozenScaleValue,
      frozenExtraValue,
      slashScaleValue,
      slashDivisionValue,
      minXtzAmount,
      maxXtzAmount,
      maxProposalSize,
    },
    quorumTreshold,
    totalSupply,
    votingPeriod,
  },
  metadataCarrierDeploymentData,
  tezos,
}: RegistryParams & { tezos: TezosToolkit }): Promise<
  ContractAbstraction<Wallet>
> => {
  if (!metadataCarrierDeploymentData.deployAddress) {
    throw new Error(
      "Error deploying Registry DAO: There's not address of metadata"
    );
  }
  const ledger = setMembersAllocation(membersTokenAllocation);
  const metadata = setMetadata(metadataCarrierDeploymentData);

  try {
    console.log("Originating Registry DAO contract...");

    const t = await tezos.wallet.originate({
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
          proposal_receivers: [],
          registry: new MichelsonMap(),
        },
        proposals: new MichelsonMap(),
        proposal_key_list_sort_by_date: [],
        permits_counter: 0,
        metadata,
        total_supply: totalSupply,
      },
    });
    const operation = await t.send();
    console.log("Waiting for confirmation on Registry DAO contract...", t);
    const c = await operation.contract();
    return c;
  } catch (e) {
    console.log("error ", e);
    throw new Error("Error deploying Treasury DAO");
  }
};

export const fromStateToRegistryStorage = (
  info: MigrationParams
): RegistryParams["storage"] => {
  const storageData = fromStateToBaseStorage(info);

  return storageData;
};
