import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { Parser, Expr } from "@taquito/michel-codec";
import { BaseDAO, BaseDAOData, getContract } from "..";
import { TreasuryProposeArgs } from "./types";
import proposeCode from "./michelson/propose";
import { TreasuryExtraDTO } from "services/indexer/types";
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal";

const parser = new Parser();

interface TreasuryDAOData extends BaseDAOData {
  extra: TreasuryExtraDTO;
}

export class TreasuryDAO extends BaseDAO {
  constructor(public data: TreasuryDAOData) {
    super(data);
  }

  public propose = async (
    { discoursePostId, transfers }: TreasuryProposeArgs,
    tezos: TezosToolkit
  ) => {
    const contract = await getContract(tezos, this.data.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);
    const data = schema.Encode({
      transfer_proposal: {
        agora_post_id: discoursePostId,
        transfers: mapTransfersArgs(transfers, this.data.address),
      },
    });

    const { packed: proposalMetadata } = await tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      this.data.extra.frozen_extra_value,
      proposalMetadata
    );

    console.log(contractMethod);
    console.log(contract);

    const result = await contractMethod.send();
    return result;
  };
}
