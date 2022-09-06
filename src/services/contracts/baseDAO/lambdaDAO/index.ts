import { Expr, Parser, unpackDataBytes } from "@taquito/michel-codec";
import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { BaseDAO, BaseDAOData, getContract } from "..";
import { RegistryProposeArgs } from "./types";
import { bytes2Char, char2Bytes } from "@taquito/tzip16";
import proposeCode from "./michelson/propose";
import proposelambda from "./michelson/proposelambda";
import { RegistryExtraDTO } from "services/indexer/types";
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal";
import { BigNumber } from "bignumber.js";
import { formatUnits } from "../../utils";
import { LambdaAddArgs, LambdaRemoveArgs } from "../registryDAO/types";

const parser = new Parser();

interface LambdaDAOData extends BaseDAOData {
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

export class LambdaDAO extends BaseDAO {
  // public decoded: {
  //   decodedRegistry: {
  //     key: string;
  //     value: string;
  //   }[];
  //   decodedRegistryAffected: {
  //     key: string;
  //     proposalId: string;
  //   }[];
  // };

  public constructor(public data: LambdaDAOData) {
    super(data);

    // this.decoded = {
    //   decodedRegistry: mapStorageRegistryList(this.data.extra.registry),
    //   decodedRegistryAffected: mapStorageRegistryAffectedList(this.data.extra.registry_affected),
    // };

    // this.data.extra.returnedPercentage = new BigNumber(100)
    //   .minus(new BigNumber(this.data.extra.slash_scale_value))
    //   .toString();
  }

  public async proposeGuardianChange(newGuardianAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address);

    const proposalMetadata = await BaseDAO.encodeProposalMetadata(
      {
        update_guardian: newGuardianAddress,
      },
      proposeCode,
      tezos
    );

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
      proposalMetadata
    );

    return await contractMethod.send();
  }

  public async proposeDelegationChange(newDelegationAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address);

    const proposalMetadata = await BaseDAO.encodeProposalMetadata(
      {
        update_contract_delegate: newDelegationAddress,
      },
      proposeCode,
      tezos
    );

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
      proposalMetadata
    );

    return await contractMethod.send();
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

  public async proposeLambdaAdd({data}: LambdaAddArgs, tezos: TezosToolkit) {
    console.log("here")
    console.log("tezos: ", tezos);
    const contract = await getContract(tezos, this.data.address);

    const proposalMetadata = await BaseDAO.encodeLambdaAddMetadata(
      data,
      proposelambda,
      tezos
    );
    console.log("proposalMetadata: ", proposalMetadata);

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
      proposalMetadata.bytes
    );

    return await contractMethod.send();
  }

  public async proposeLambdaRemove({handler_name}: LambdaRemoveArgs, tezos: TezosToolkit) {
    console.log("handler_name: ", handler_name);
    console.log("here remove")
    console.log("tezos: ", tezos);
    const contract = await getContract(tezos, this.data.address);

    const michelsonType = parser.parseData(proposelambda);
    const schema = new Schema(michelsonType as Expr);

    const dataToEncode = {
      remove_handler: handler_name
    }

    const data = schema.Encode(dataToEncode);

    const { packed: proposalMetadata } = await tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
      proposalMetadata
    );

    return await contractMethod.send();
  }
}
