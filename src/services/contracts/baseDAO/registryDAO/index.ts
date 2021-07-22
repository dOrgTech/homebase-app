import { Parser, Expr, unpackDataBytes } from "@taquito/michel-codec";
import {
  extractTransfersData,
  mapProposalBase,
  mapTransfersArgs,
} from "./../../../bakingBad/proposals/mappers";
import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { BaseDAOData, getContract } from "..";
import { BaseDAO } from "..";
import { PMRegistryProposal, RegistryProposeArgs } from "./types";
import { RegistryProposal, Transfer } from "services/bakingBad/proposals/types";
import { bytes2Char, char2Bytes } from "@taquito/tzip16";
import proposeCode from "./michelson/propose";
import { ProposalDTO, RegistryExtraDTO } from "services/indexer/types";
import { TokenMetadata } from "services/bakingBad/tokens";

const parser = new Parser();

interface RegistryDAOData extends BaseDAOData {
  extra: RegistryExtraDTO;
}

interface RegistryItemDTO {
  prim: "Pair";
  args: [{ string: string }, { string: string }];
}

interface RegistryAffectedDTO {
  prim: "Elt";
  args: [{ string: string }, { bytes: string }];
}

const mapStorageRegistryList = (
  listMichelsonString: string
): {
  key: string;
  value: string;
}[] => {
  const data = unpackDataBytes({
    bytes: listMichelsonString
  }) as RegistryItemDTO[]

  console.log(listMichelsonString, data)

  console.log(data.map(item => ({
    key: bytes2Char(item.args[0].string),
    value: bytes2Char(item.args[1].string)
  })))

  return data.map(item => ({
    key: bytes2Char(item.args[0].string),
    value: bytes2Char(item.args[1].string)
  }))
};

const mapStorageRegistryAffectedList = (
  listMichelsonString: string
): {
  key: string;
  proposalId: string;
}[] => {
  const data = unpackDataBytes({
    bytes: listMichelsonString
  }) as RegistryAffectedDTO[]

  console.log(data.map(item => ({
    key: bytes2Char(item.args[0].string),
    proposalId: item.args[1].bytes
  })))

  return data.map(item => ({
    key: bytes2Char(item.args[0].string),
    proposalId: item.args[1].bytes
  }))
};

const mapProposal = (
  dto: ProposalDTO,
  governanceToken: TokenMetadata
): RegistryProposal => {
  const micheline = parser.parseMichelineExpression(proposeCode) as Expr;
  const schema = new Schema(micheline as Expr);

  const unpackedMetadata = unpackDataBytes(
    { bytes: dto.metadata },
    micheline as any
  ) as any;
  const proposalMetadataDTO: PMRegistryProposal =
    schema.Execute(unpackedMetadata);

  let transfers: Transfer[] = [];

  if (proposalMetadataDTO.transfer_proposal.transfers) {
    transfers = extractTransfersData(
      proposalMetadataDTO.transfer_proposal.transfers
    );
  }

  const agoraPostId = proposalMetadataDTO.transfer_proposal.agora_post_id;
  const registryDiff = proposalMetadataDTO.transfer_proposal.registry_diff.map(
    (item) => ({
      key: bytes2Char(item[0]),
      value: bytes2Char(item[1]),
    })
  );

  return {
    ...mapProposalBase(
      dto,
      "registry",
      governanceToken.supply,
      governanceToken.decimals
    ),
    transfers,
    list: registryDiff,
    agoraPostId,
  };
};

export class RegistryDAO extends BaseDAO {
  public decoded: {
    decodedRegistry: {
      key: string;
      value: string;
    }[];
    decodedRegistryAffected: {
      key: string;
      proposalId: string;
    }[];
  }

  public constructor(public data: RegistryDAOData) {
    super(data);

    this.decoded = {
      decodedRegistry: mapStorageRegistryList(this.data.extra.registry),
      decodedRegistryAffected: mapStorageRegistryAffectedList(
        this.data.extra.registry_affected
      ),
    }
  }

  public propose = async (
    { agoraPostId, transfer_proposal }: RegistryProposeArgs,
    tezos: TezosToolkit
  ) => {
    const contract = await getContract(tezos, this.data.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);

    const dataToEncode = {
      transfer_proposal: {
        transfers: mapTransfersArgs(
          transfer_proposal.transfers,
          this.data.address
        ),
        registry_diff: transfer_proposal.registry_diff.map((item) => [
          char2Bytes(item.key),
          char2Bytes(item.value),
        ]),
        agora_post_id: agoraPostId,
      },
    };

    const data = schema.Encode(dataToEncode);

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

  public proposals = async (): Promise<RegistryProposal[]> => {
    const proposals = this.data.proposals
      .map((dto) => mapProposal(dto, this.data.token))
      .filter((p) => !!p);

    return proposals;
  };

  public proposal = async (proposalId: string): Promise<RegistryProposal> => {
    const proposalDTO = this.data.proposals.find(
      (p) => p.key.toLowerCase() === proposalId.toLowerCase()
    );

    if (!proposalDTO) {
      throw new Error(`No proposal found with key: '${proposalId}'`);
    }

    return mapProposal(proposalDTO, this.data.token);
  };
}
