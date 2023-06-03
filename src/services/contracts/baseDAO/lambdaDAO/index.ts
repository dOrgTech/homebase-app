import { Expr, Parser, unpackDataBytes, MichelsonData, MichelsonType, packDataBytes } from "@taquito/michel-codec"
import { TezosToolkit } from "@taquito/taquito"
import { Schema } from "@taquito/michelson-encoder"
import { BaseDAO, BaseDAOData, getContract } from ".."
import { RegistryProposeArgs } from "./types"
import { bytes2Char, char2Bytes } from "@taquito/tzip16"
import proposeCode from "./michelson/propose"
import proposelambda from "./michelson/proposelambda"
import { LambdaExtraDTO, RegistryExtraDTO } from "services/services/types"
import { mapTransfersArgs } from "services/services/dao/mappers/proposal"
import { BigNumber } from "bignumber.js"
import { formatUnits } from "../../utils"
import { LambdaAddArgs, LambdaExecuteArgs, LambdaRemoveArgs } from "./types"

import transfer_arg_type_michelson from "./michelson/supported_lambda_types/transfer_proposal_type.json"
import transfer_proposal_type_before_fa12 from "./michelson/supported_lambda_types/transfer_proposal_type_before_fa1.2.json"
import update_contract_delegate_type_michelson from "./michelson/supported_lambda_types/update_contract_delegate_proposal.json"
import update_guardian_type_michelson from "./michelson/supported_lambda_types/update_guardian_proposal.json"
import { Community } from "models/Community"
import { HUMANITEZ_DAO } from "services/config"

const parser = new Parser()

interface LambdaDAOData extends BaseDAOData {
  extra: LambdaExtraDTO
  liteDAO: Community | undefined
}

interface RegistryItemDTO {
  prim: "Pair"
  args: [{ string: string }, { string: string }]
}

interface RegistryAffectedDTO {
  prim: "Elt"
  args: [{ string: string }, { bytes: string }]
}

const mapStorageRegistryList = (
  listMichelsonString: string
): {
  key: string
  value: string
}[] => {
  const data = unpackDataBytes({
    bytes: listMichelsonString
  }) as RegistryItemDTO[]

  return data.map(item => ({
    key: bytes2Char(item.args[0].string),
    value: bytes2Char(item.args[1].string)
  }))
}

const mapStorageRegistryAffectedList = (
  listMichelsonString: string
): {
  key: string
  proposalId: string
}[] => {
  const data = unpackDataBytes({
    bytes: listMichelsonString
  }) as RegistryAffectedDTO[]

  return data.map(item => ({
    key: bytes2Char(item.args[0].string),
    proposalId: item.args[1].bytes
  }))
}

export class LambdaDAO extends BaseDAO {
  public liteDAOData: Community | undefined
  public decoded: {
    decodedRegistry: {
      key: string
      value: string
    }[]
    decodedRegistryAffected: {
      key: string
      proposalId: string
    }[]
  }

  public constructor(public data: LambdaDAOData) {
    super(data)

    this.decoded = {
      decodedRegistry: mapStorageRegistryList(this.data.extra.registry),
      decodedRegistryAffected: mapStorageRegistryAffectedList(this.data.extra.registry_affected)
    }

    this.data.extra.returnedPercentage = new BigNumber(100)
      .minus(new BigNumber(this.data.extra.slash_scale_value))
      .toString()

    this.liteDAOData = data.liteDAO
  }

  public async proposeGuardianChange(newGuardianAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)

    const p = new Parser()

    const update_guardian_arg_schema = new Schema(update_guardian_type_michelson as MichelsonData)

    const packed_transfer_proposal_arg = packDataBytes(
      update_guardian_arg_schema.Encode(newGuardianAddress) // as MichelsonData
    )

    const proposal_meta_michelson_type = p.parseMichelineExpression(proposelambda) as MichelsonType
    const proposal_meta_schema = new Schema(proposal_meta_michelson_type)

    const proposalMetadata = packDataBytes(
      proposal_meta_schema.Encode({
        execute_handler: {
          handler_name: "update_guardian_proposal",
          packed_argument: packed_transfer_proposal_arg.bytes
        }
      }),
      proposal_meta_michelson_type
    )

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata.bytes
    )

    return await contractMethod.send()
  }

  public async proposeDelegationChange(newDelegationAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)
    const p = new Parser()

    const transfer_arg_schema = new Schema(update_contract_delegate_type_michelson as MichelsonData)

    const packed_transfer_proposal_arg = packDataBytes(
      transfer_arg_schema.Encode(newDelegationAddress) // as MichelsonData
    )

    const proposal_meta_michelson_type = p.parseMichelineExpression(proposelambda) as MichelsonType
    const proposal_meta_schema = new Schema(proposal_meta_michelson_type)
    const proposalMetadata = packDataBytes(
      proposal_meta_schema.Encode({
        execute_handler: {
          handler_name: "update_contract_delegate_proposal",
          packed_argument: packed_transfer_proposal_arg.bytes
        }
      }),
      proposal_meta_michelson_type
    )

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata.bytes
    )

    return await contractMethod.send()
  }

  public propose = async ({ agoraPostId, transfer_proposal }: RegistryProposeArgs, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address)
    const p = new Parser()

    const transfer_michelson =
      this.data.address === HUMANITEZ_DAO ? transfer_proposal_type_before_fa12 : transfer_arg_type_michelson

    const transfer_arg_schema = new Schema(transfer_michelson as MichelsonData)
    const transfer_proposal_args = {
      transfers: mapTransfersArgs(transfer_proposal.transfers, this.data.address),
      registry_diff: transfer_proposal.registry_diff.map(item => [char2Bytes(item.key), char2Bytes(item.value)]),
      agora_post_id: agoraPostId
    }

    const packed_transfer_proposal_arg = packDataBytes(
      transfer_arg_schema.Encode(transfer_proposal_args) // as MichelsonData
    )

    const proposal_meta_michelson_type = p.parseMichelineExpression(proposelambda) as MichelsonType
    const proposal_meta_schema = new Schema(proposal_meta_michelson_type)
    const proposalMetadata = packDataBytes(
      proposal_meta_schema.Encode({
        execute_handler: {
          handler_name: "transfer_proposal",
          packed_argument: packed_transfer_proposal_arg.bytes
        }
      }),
      proposal_meta_michelson_type
    )

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata.bytes
    )

    return await contractMethod.send()
  }

  public async proposeLambdaExecute(
    { handler_name, agoraPostId, handler_code, handler_params, lambda_arguments }: LambdaExecuteArgs,
    tezos: TezosToolkit
  ) {
    const contract = await getContract(tezos, this.data.address)
    const p = new Parser()
    const transfer_arg_type = JSON.parse(lambda_arguments)
    const transfer_arg_schema = new Schema(transfer_arg_type as MichelsonData)

    const handler_params_object = JSON.parse(handler_params)

    const packed_transfer_proposal_arg = packDataBytes(
      transfer_arg_schema.Encode(handler_params_object) // as MichelsonData
    )

    const proposal_meta_michelson_type = p.parseMichelineExpression(proposelambda) as MichelsonType
    const proposal_meta_schema = new Schema(proposal_meta_michelson_type)
    const proposalMetadata = packDataBytes(
      proposal_meta_schema.Encode({
        execute_handler: {
          handler_name,
          packed_argument: packed_transfer_proposal_arg.bytes
        }
      }),
      proposal_meta_michelson_type
    )

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata.bytes
    )

    return await contractMethod.send()
  }

  public async proposeLambdaAdd({ data }: LambdaAddArgs, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)

    const proposalMetadata = await BaseDAO.encodeLambdaAddMetadata(data, proposelambda, tezos)

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata.bytes
    )

    return await contractMethod.send()
  }

  public async proposeLambdaRemove({ handler_name }: LambdaRemoveArgs, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)

    const michelsonType = parser.parseData(proposelambda)
    const schema = new Schema(michelsonType as Expr)

    const dataToEncode = {
      remove_handler: handler_name
    }

    const data = schema.Encode(dataToEncode)

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
