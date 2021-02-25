import { MichelsonMap, TezosToolkit, Wallet } from "@taquito/taquito";
import { Parser } from "@taquito/michel-codec";
import { MichelsonV1Expression } from "@taquito/rpc";

import { TreasuryParams } from "services/contracts/baseDAO/treasuryDAO/types";
import { addNewContractToIPFS } from "services/pinata";
import {
  MigrationParams,
  ProposeParams,
} from "services/contracts/baseDAO/types";
import code from "services/contracts/baseDAO/treasuryDAO/michelson/contract";
import proposeMetadataCode from "services/contracts/baseDAO/treasuryDAO/michelson/propose";
import {
  fromStateToBaseStorage,
  setMembersAllocation,
  setMetadata,
} from "../utils";
import { xtzToMutez } from "services/contracts/utils";
import { ContractAbstraction } from "@taquito/taquito";

export const deployTreasuryDAO = async ({
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
    votingPeriod,
  },
  metadataCarrierDeploymentData,
  tezos,
}: TreasuryParams & { tezos: TezosToolkit }): Promise<
  ContractAbstraction<Wallet>
> => {
  console.log({
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
    votingPeriod,
  });
  if (!metadataCarrierDeploymentData.deployAddress) {
    throw new Error(
      "Error deploying treasury DAO: There's not address of metadata"
    );
  }
  const ledger = setMembersAllocation(membersTokenAllocation);
  const metadata = setMetadata(metadataCarrierDeploymentData);

  console.log(ledger, metadata);

  try {
    console.log("Originating Treasury DAO contract...");
    console.log(votingPeriod);

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
          min_xtz_amount: xtzToMutez(minXtzAmount.toString()),
          max_xtz_amount: xtzToMutez(maxXtzAmount.toString()),
          max_proposal_size: maxProposalSize,
        },
        proposals: new MichelsonMap(),
        proposal_key_list_sort_by_date: [],
        permits_counter: 0,
        metadata,
      },
    });
    const operation = await t.send();
    console.log("Waiting for confirmation on Treasury DAO contract...", t);
    const c = await operation.contract();
    console.log("Treasury DAO deployment completed", c);
    console.log("Let's store the contract address in IPFS :-D");
    await addNewContractToIPFS(c.address);
    return c;
  } catch (e) {
    console.log("error ", e);
    throw new Error("Error deploying Treasury DAO");
  }
};

export const calculateProposalSize = async (
  contractAddress: string,
  {
    transfers,
    agoraPostId,
  }: Omit<ProposeParams["contractParams"], "tokensToFreeze">,
  tezos: TezosToolkit
): Promise<number> => {
  const contract = await tezos.wallet.at(contractAddress);

  const p = new Parser();

  const { parameter } = contract.methods
    .propose(
      0,
      agoraPostId,
      transfers.map(({ amount, recipient }) => ({
        transfer_type: {
          amount,
          recipient,
        },
      }))
    )
    .toTransferParams();
  const dataJSON = (parameter?.value as any).args[1];

  const typeJSON = p.parseMichelineExpression(proposeMetadataCode);
  delete (typeJSON as any).annots;

  const pack = await tezos.rpc.packData({
    data: dataJSON as MichelsonV1Expression,
    type: typeJSON as MichelsonV1Expression,
  });

  return pack.packed.length / 2;
};

export const getTokensToStakeInPropose = (
  {
    frozenScaleValue,
    frozenExtraValue,
  }: { frozenScaleValue: number; frozenExtraValue: number },
  proposalSize: number
) => proposalSize * frozenScaleValue + frozenExtraValue;

export const fromStateToTreasuryStorage = (
  info: MigrationParams
): TreasuryParams["storage"] => {
  const storageData = fromStateToBaseStorage(info);

  return storageData;
};
