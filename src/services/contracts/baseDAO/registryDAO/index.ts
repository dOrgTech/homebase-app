import { Parser, Expr, unpackDataBytes } from "@taquito/michel-codec";
import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { BaseDAOData, getContract } from "..";
import { BaseDAO } from "..";
import { RegistryProposeArgs } from "./types";
import { bytes2Char, char2Bytes } from "@taquito/tzip16";
import proposeCode from "./michelson/propose";
import { RegistryExtraDTO } from "services/indexer/types";
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal";

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
    bytes: listMichelsonString,
  }) as RegistryItemDTO[];

  return data.map((item) => ({
    key: bytes2Char(item.args[0].string),
    value: bytes2Char(item.args[1].string),
  }));
};

const mapStorageRegistryAffectedList = (
  listMichelsonString: string
): {
  key: string;
  proposalId: string;
}[] => {
  const data = unpackDataBytes({
    bytes: listMichelsonString,
  }) as RegistryAffectedDTO[];

  return data.map((item) => ({
    key: bytes2Char(item.args[0].string),
    proposalId: item.args[1].bytes,
  }));
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
  };

  public constructor(public data: RegistryDAOData) {
    super(data);

    this.decoded = {
      decodedRegistry: mapStorageRegistryList(this.data.extra.registry),
      decodedRegistryAffected: mapStorageRegistryAffectedList(
        this.data.extra.registry_affected
      ),
    };
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
}
