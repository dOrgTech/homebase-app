import { Expr, Parser, unpackDataBytes } from "@taquito/michel-codec";
import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { BaseDAO, BaseDAOData, getContract } from "..";
import { RegistryBatchProposeArgs, RegistryProposeArgs } from "./types";
import { bytes2Char, char2Bytes } from "@taquito/tzip16";
import proposeCode from "./michelson/propose";
import { RegistryExtraDTO } from "services/indexer/types";
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal";
import { BigNumber } from "bignumber.js";
import { formatUnits } from "../../utils";

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
      decodedRegistryAffected: mapStorageRegistryAffectedList(this.data.extra.registry_affected),
    };

    this.data.extra.returnedPercentage = new BigNumber(100)
      .minus(new BigNumber(this.data.extra.slash_scale_value))
      .toString();
  }

  public propose = async ({ agoraPostId, transfer_proposal }: RegistryProposeArgs, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);

    const dataToEncode = {
      transfer_proposal: {
        transfers: mapTransfersArgs(transfer_proposal.transfers, this.data.address),
        registry_diff: transfer_proposal.registry_diff.map((item) => [char2Bytes(item.key), char2Bytes(item.value)]),
        agora_post_id: agoraPostId,
      },
    };

    const data = schema.Encode(dataToEncode);

    const { packed: proposalMetadata } = await tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata
    );

    return await contractMethod.send();
  };

  public batchPropose = async ({ agoraPostId, transfer_proposal }: RegistryBatchProposeArgs, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address);
    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);
    let batch = await tezos.wallet.batch();
    if (transfer_proposal.registry_diff.length) {
      const dataToEncode = {
        transfer_proposal: {
          registry_diff: transfer_proposal.registry_diff.map((item) => [char2Bytes(item.key), char2Bytes(item.value)]),
          agora_post_id: agoraPostId,
          transfers: [],
        },
      };
      const data = schema.Encode(dataToEncode);
      const { packed: proposalMetadata } = await tezos.rpc.packData({
        data,
        type: michelsonType as Expr,
      });
      batch.withContractCall(
        contract.methods.propose(
          await tezos.wallet.pkh(),
          formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
          proposalMetadata
        )
      );
    }
    if (transfer_proposal.transfersBatches.length && transfer_proposal.transfersBatches[0].length) {
      for await (const transfers of transfer_proposal.transfersBatches) {
        const data = schema.Encode({
          transfer_proposal: {
            registry_diff: [],
            agora_post_id: agoraPostId,
            transfers: mapTransfersArgs(transfers, this.data.address),
          },
        });
        const { packed: proposalMetadata } = await tezos.rpc.packData({
          data,
          type: michelsonType as Expr,
        });
        batch = await batch.withContractCall(
          contract.methods.propose(
            await tezos.wallet.pkh(),
            formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
            proposalMetadata
          )
        );
      }
    }
    return await batch.send();
  };
}
