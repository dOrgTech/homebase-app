import {
  ContractMethod,
  MichelsonMap,
  TezosToolkit,
  Wallet,
} from "@taquito/taquito";
import { char2Bytes } from "@taquito/tzip16";
import { MetadataCarrierDeploymentData } from "../metadataCarrier/types";
import { getTestProvider } from "../../utils";
import code from "./michelson/contract";
import { MemberTokenAllocation, TreasuryParams } from "./types";
import { addNewContractToIPFS } from "../../../pinata";
import { Contract, DAOItem, ProposeParams } from "../types";
import { Parser } from "@taquito/michel-codec";
import { MichelsonV1Expression } from "@taquito/rpc";
import proposeMetadataCode from "./michelson/propose";

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
}: TreasuryParams): Promise<Contract> => {
  if (!metadataCarrierDeploymentData.deployAddress) {
    throw new Error(
      "Error deploying treasury DAO: There's not address of metadata"
    );
  }
  const ledger = setMembersAllocation(membersTokenAllocation);
  const metadata = setMetadata(metadataCarrierDeploymentData);

  try {
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
    console.log("Let's store the contract address in IPFS :-D");
    await addNewContractToIPFS(c.address);
    return c;
  } catch (e) {
    console.log("error ", e);
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

  return pack.packed.length;
};

export const getTokensToStakeInPropose = (dao: DAOItem, proposalSize: number) =>
  proposalSize * dao.frozenScaleValue + dao.frozenExtraValue;
