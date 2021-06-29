import { TezosToolkit } from "@taquito/taquito";

import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getProposalDTO, getProposalsDTO } from "services/bakingBad/proposals";
import { getStorage } from "services/bakingBad/storage";
import { Network } from "services/beacon/context";
import { DAOListMetadata } from "../../metadataCarrier/types";
import { Schema } from "@taquito/michelson-encoder";
import { Storage } from "services/bakingBad/storage/types";
import { Parser, Expr, unpackDataBytes } from "@taquito/michel-codec";
import { BaseDAO, getContract, unpackExtraNumValue } from "..";
import { ProposalDTO, TreasuryProposal } from "services/bakingBad/proposals/types";
import { TreasuryExtraDTO, TreasuryProposeArgs } from "./types";
import { getExtra } from "services/bakingBad/extra";
import proposeCode from "./michelson/propose";
import {
  extractTransfersData,
  mapProposalBase,
  mapTransfersArgs,
} from "services/bakingBad/proposals/mappers";
import { PMTreasuryProposal } from "../registryDAO/types";

const parser = new Parser();

const micheline = parser.parseMichelineExpression(proposeCode) as Expr;
const schema = new Schema(micheline as Expr);

const mapProposal = (dto: ProposalDTO, storage: Storage) => {
  const unpackedMetadata = unpackDataBytes(
    { bytes: dto.value.metadata },
    micheline as any
  ) as any;
  const proposalMetadataDTO: PMTreasuryProposal = schema.Execute(unpackedMetadata)

  const transfers = extractTransfersData(proposalMetadataDTO.transfers);

  return {
    ...mapProposalBase(
      dto,
      "treasury",
      storage.governanceToken.supply,
      storage.governanceToken.decimals
    ),
    agoraPostId: proposalMetadataDTO.agora_post_id.toString(),
    transfers,
  };
}

export class TreasuryDAO extends BaseDAO {
  public static create = async (
    contractAddress: string,
    network: Network,
    tezos: TezosToolkit,
    metadata: DAOListMetadata
  ) => {
    const storage = await getStorage(contractAddress, network);
    const extraDTO = await getExtra<TreasuryExtraDTO>(
      storage.extraMapNumber,
      network
    );
    const extra = {
      frozenExtraValue: unpackExtraNumValue(extraDTO[5].value),
      slashExtraValue: unpackExtraNumValue(extraDTO[0].value),
      minXtzAmount: unpackExtraNumValue(extraDTO[3].value),
      maxXtzAmount: unpackExtraNumValue(extraDTO[2].value),
      frozenScaleValue: unpackExtraNumValue(extraDTO[1].value),
      slashDivisionScale: unpackExtraNumValue(extraDTO[4].value),
    };
    const ledger = await getLedgerAddresses(
      storage.ledgerMapNumber,
      storage.governanceToken.decimals,
      network
    );

    return new TreasuryDAO({
      address: contractAddress,
      ledger,
      template: "treasury",
      storage,
      metadata,
      tezos,
      extra,
      network,
    });
  };

  public proposals = async (network: Network): Promise<TreasuryProposal[]> => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = await getProposalsDTO(proposalsMapNumber, network);
    const proposals = proposalsDTO.map((dto) => mapProposal(dto, this.storage));

    return proposals;
  };

  public proposal = async (proposalId: string, network: Network): Promise<TreasuryProposal> => {
    const { proposalsMapNumber } = this.storage;
    const proposalDTO = await getProposalDTO(proposalsMapNumber, proposalId, network);
    const proposal = mapProposal(proposalDTO, this.storage);

    return proposal;
  };

  public propose = async (
    { agoraPostId, transfers }: TreasuryProposeArgs,
    tezos: TezosToolkit
  ) => {
    const contract = await getContract(tezos, this.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);
    const data = schema.Encode({
      agora_post_id: agoraPostId,
      transfers: mapTransfersArgs(transfers, this.address),
    });

    const { packed: proposalMetadata } = await tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      this.extra.frozenExtraValue,
      proposalMetadata
    );

    const result = await contractMethod.send();
    return result;
  };
}
