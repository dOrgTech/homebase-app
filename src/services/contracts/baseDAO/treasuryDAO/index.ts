import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { Parser, Expr, unpackDataBytes } from "@taquito/michel-codec";
import { BaseDAO, BaseDAOData, getContract } from "..";
import { TreasuryProposal } from "services/bakingBad/proposals/types";
import { TreasuryProposeArgs } from "./types";
import proposeCode from "./michelson/propose";
import {
  extractTransfersData,
  mapProposalBase,
  mapTransfersArgs,
} from "services/bakingBad/proposals/mappers";
import { PMTreasuryProposal } from "../registryDAO/types";
import { ProposalDTO, TreasuryExtraDTO } from "services/indexer/types";
import { TokenMetadata } from "services/bakingBad/tokens";

const parser = new Parser();

const micheline = parser.parseMichelineExpression(proposeCode) as Expr;
const schema = new Schema(micheline as Expr);

const mapProposal = (dto: ProposalDTO, governanceToken: TokenMetadata) => {
  const unpackedMetadata = unpackDataBytes(
    { bytes: dto.metadata },
    micheline as any
  ) as any;
  const proposalMetadataDTO: PMTreasuryProposal =
    schema.Execute(unpackedMetadata);

  const transfers = extractTransfersData(proposalMetadataDTO.transfers);

  return {
    ...mapProposalBase(
      dto,
      "treasury",
      governanceToken.supply,
      governanceToken.decimals
    ),
    agoraPostId: proposalMetadataDTO.agora_post_id.toString(),
    transfers,
  };
};

interface TreasuryDAOData extends BaseDAOData {
  extra: TreasuryExtraDTO;
}

export class TreasuryDAO extends BaseDAO {
  constructor(public data: TreasuryDAOData) {
    super(data);
  }

  public proposals = async (): Promise<TreasuryProposal[]> => {
    const proposalsDTO = this.data.proposals;
    const proposals = proposalsDTO.map((dto) =>
      mapProposal(dto, this.data.token)
    );

    return proposals;
  };

  public proposal = async (proposalId: string): Promise<TreasuryProposal> => {
    const proposalDTO = this.data.proposals.find(
      (p) => p.key.toLowerCase() === proposalId.toLowerCase()
    );

    if(!proposalDTO) {
      throw new Error(`No proposal found with key: '${proposalId}'`)
    }

    return mapProposal(proposalDTO, this.data.token);
  };

  public propose = async (
    { agoraPostId, transfers }: TreasuryProposeArgs,
    tezos: TezosToolkit
  ) => {
    const contract = await getContract(tezos, this.data.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);
    const data = schema.Encode({
      agora_post_id: agoraPostId,
      transfers: mapTransfersArgs(transfers, this.data.address),
    });

    const { packed: proposalMetadata } = await tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      this.data.extra.frozen_extra_value,
      proposalMetadata
    );

    const result = await contractMethod.send();
    return result;
  };
}
