import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { Expr, Parser } from "@taquito/michel-codec";
import { BaseDAO, BaseDAOData, getContract } from "..";
import { TreasuryBatchProposeArgs, TreasuryProposeArgs } from "./types";
import proposeCode from "./michelson/propose";
import { TreasuryExtraDTO } from "services/indexer/types";
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal";
import { BigNumber } from "bignumber.js";
import { formatUnits } from "../../utils";

const parser = new Parser();

interface TreasuryDAOData extends BaseDAOData {
  extra: TreasuryExtraDTO;
}

export class TreasuryDAO extends BaseDAO {
  constructor(public data: TreasuryDAOData) {
    super(data);

    this.data.extra.returnedPercentage = new BigNumber(100)
      .minus(new BigNumber(this.data.extra.slash_scale_value))
      .toString();
  }

  public propose = async (
    { agoraPostId, transfers }: TreasuryProposeArgs,
    tezos: TezosToolkit
    ) => {
    const contract = await getContract(tezos, this.data.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);
    const data = schema.Encode({
      transfer_proposal: {
        agora_post_id: agoraPostId,
        transfers: mapTransfersArgs(transfers, this.data.address),
      },
    });

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

  public batchPropose = async ({ agoraPostId, transfersBatches }: TreasuryBatchProposeArgs, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address);
    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);
    let batch = await tezos.wallet.batch();
    for await (const transfers of transfersBatches) {
      const data = schema.Encode({
        transfer_proposal: {
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
    return await batch.send();
  };
}
