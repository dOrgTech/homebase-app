import { TezosToolkit } from "@taquito/taquito"
import { Schema } from "@taquito/michelson-encoder"
import { Expr, Parser } from "@taquito/michel-codec"
import { BaseDAO, BaseDAOData, getContract } from ".."
import { TreasuryProposeArgs } from "./types"
import proposeCode from "./michelson/propose"
import proposeLambdaCode from "./michelson/proposelambda"
import { TreasuryExtraDTO } from "services/indexer/types"
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal"
import { BigNumber } from "bignumber.js"
import { formatUnits } from "../../utils"
import { char2Bytes } from "@taquito/tzip16"
import { packDataBytes, MichelsonType, MichelsonData } from "@taquito/michel-codec"

const parser = new Parser()

interface TreasuryDAOData extends BaseDAOData {
  extra: TreasuryExtraDTO
}

export class TreasuryDAO extends BaseDAO {
  constructor(public data: TreasuryDAOData) {
    super(data)

    this.data.extra.returnedPercentage = new BigNumber(100)
      .minus(new BigNumber(this.data.extra.slash_scale_value))
      .toString()
  }

  public async proposeGuardianChange(newGuardianAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)
    const parser = new Parser()
    const michelsonType = parser.parseData(proposeCode)

    const { packed: proposalMetadata } = await tezos.rpc.packData({
      data: { prim: "Right", args: [{ string: newGuardianAddress }] },
      type: michelsonType as Expr
    })

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata
    )

    return await contractMethod.send()
  }

  public async proposeDelegationChange(newDelegationAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)

    const lambdaData = char2Bytes(
      {
        update_contract_delegate: newDelegationAddress
      }.toString()
    )

    const parser = new Parser()

    const dataToEncode = {
      execute_handler: {
        handler_name: "update_contract_delegate_proposal",
        packed_argument: lambdaData
      }
    }

    const dataJSON = parser.parseMichelineExpression(dataToEncode.toString()) as MichelsonData
    const typeJSON = parser.parseMichelineExpression(proposeLambdaCode) as MichelsonType

    const proposalMetadata = packDataBytes(
      dataJSON, // as MichelsonData
      typeJSON // as MichelsonType
    )

    // const proposalMetadata = await BaseDAO.encodeProposalMetadata(
    //   {
    //     execute_handler: {
    //       handler_name: "update_contract_delegate_proposal",
    //       packed_argument: lambdaData,
    //     },
    //   },
    //   proposeLambdaCode,
    //   tezos
    // );

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata
    )

    return await contractMethod.send()
  }

  public propose = async ({ agoraPostId, transfers }: TreasuryProposeArgs, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address)

    const michelsonType = parser.parseData(proposeCode)
    const schema = new Schema(michelsonType as Expr)
    const data = schema.Encode({
      transfer_proposal: {
        agora_post_id: agoraPostId,
        transfers: mapTransfersArgs(transfers, this.data.address)
      }
    })

    const { packed: proposalMetadata } = await tezos.rpc.packData({
      data,
      type: michelsonType as Expr
    })

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata
    )

    return await contractMethod.send()
  }
}
