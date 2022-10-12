import { Expr, Parser, unpackDataBytes, MichelsonData, MichelsonType, packDataBytes } from "@taquito/michel-codec"
import { TezosToolkit } from "@taquito/taquito"
import { Schema } from "@taquito/michelson-encoder"
import { BaseDAO, BaseDAOData, getContract } from ".."
import { RegistryProposeArgs } from "./types"
import { bytes2Char, char2Bytes } from "@taquito/tzip16"
import proposeCode from "./michelson/propose"
import proposelambda from "./michelson/proposelambda"
import { LambdaExtraDTO, RegistryExtraDTO } from "services/indexer/types"
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal"
import { BigNumber } from "bignumber.js"
import { formatUnits } from "../../utils"
import { LambdaAddArgs, LambdaExecuteArgs, LambdaRemoveArgs } from "../registryDAO/types"

const parser = new Parser()

interface LambdaDAOData extends BaseDAOData {
  extra: LambdaExtraDTO
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
  }

  public async proposeGuardianChange(newGuardianAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)

    const proposalMetadata = await BaseDAO.encodeProposalMetadata(
      {
        update_guardian: newGuardianAddress
      },
      proposeCode,
      tezos
    )

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata
    )

    // const contract = await getContract(tezos, this.data.address);
    // const p = new Parser();
    // const proposeDelegationType = `address`

    // const proposal_data = {
    //   key_hash: newDelegationAddress,
    // };

    // const lambdaData = char2Bytes(JSON.stringify(proposal_data));
    // console.log("lambdaData: ", lambdaData);

    // const transfer_arg_michelson_type = p.parseMichelineExpression(
    //   proposeDelegationType
    // ) as MichelsonType;
    // const transfer_arg_schema = new Schema(transfer_arg_michelson_type);

    // const packed_transfer_proposal_arg = packDataBytes(
    //   transfer_arg_schema.Encode(newDelegationAddress), // as MichelsonData
    // );

    // const michelsonType = parser.parseData(proposelambda);
    // const schema = new Schema(michelsonType as Expr);

    // const parser = new Parser();

    // const dataToEncode = {
    //   execute_handler: {
    //     handler_name: "update_contract_delegate_proposal",
    //     packed_argument: lambdaData,
    //   },
    // }

    // const dataJSON = parser.parseMichelineExpression(dataToEncode.toString()) as MichelsonData;
    // const typeJSON = parser.parseMichelineExpression(proposeLambdaCode) as MichelsonType;

    // const proposalMetadata = packDataBytes(
    //   dataJSON, // as MichelsonData
    //   typeJSON // as MichelsonType
    // );

    // const proposalMetadata = await BaseDAO.encodeProposalMetadata(
    //   {
    //     execute_handler: {
    //       handler_name: "update_guardian_proposal",
    //       packed_argument: packed_transfer_proposal_arg.bytes,
    //     },
    //   },
    //   proposelambda,
    //   tezos
    // );

    // const contractMethod = contract.methods.propose(
    //   await tezos.wallet.pkh(),
    //   formatUnits(
    //     new BigNumber(this.data.fixed_proposal_fee_in_token),
    //     this.data.token.decimals
    //   ),
    //   proposalMetadata
    // );

    // return await contractMethod.send();

    return await contractMethod.send()
  }

  public async proposeDelegationChange(newDelegationAddress: string, tezos: TezosToolkit) {
    const contract = await getContract(tezos, this.data.address)
    const p = new Parser()
    const proposeDelegationType = `(option key_hash)`

    const transfer_arg_michelson_type = p.parseMichelineExpression(proposeDelegationType) as MichelsonType
    const transfer_arg_schema = new Schema(transfer_arg_michelson_type)

    const packed_transfer_proposal_arg = packDataBytes(
      transfer_arg_schema.Encode(newDelegationAddress) // as MichelsonData
    )
    console.log("packed_transfer_proposal_arg: ", packed_transfer_proposal_arg.bytes)

    // const michelsonType = parser.parseData(proposelambda);
    // const schema = new Schema(michelsonType as Expr);

    // const parser = new Parser();

    // const dataToEncode = {
    //   execute_handler: {
    //     handler_name: "update_contract_delegate_proposal",
    //     packed_argument: lambdaData,
    //   },
    // }

    // const dataJSON = parser.parseMichelineExpression(dataToEncode.toString()) as MichelsonData;
    // const typeJSON = parser.parseMichelineExpression(proposeLambdaCode) as MichelsonType;

    // const proposalMetadata = packDataBytes(
    //   dataJSON, // as MichelsonData
    //   typeJSON // as MichelsonType
    // );

    const proposalMetadata = await BaseDAO.encodeProposalMetadata(
      {
        execute_handler: {
          handler_name: "update_contract_delegate_proposal",
          packed_argument: packed_transfer_proposal_arg.bytes
        }
      },
      proposelambda,
      tezos
    )

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata
    )

    return await contractMethod.send()
  }

  public propose = async ({ agoraPostId, transfer_proposal }: RegistryProposeArgs, tezos: TezosToolkit) => {
    console.log("transfer_proposal: ", transfer_proposal)
    const contract = await getContract(tezos, this.data.address)
    const p = new Parser()
    // const parser = new Parser();
    const transfer_arg_type = `(pair (pair (nat %agora_post_id) (list %registry_diff (pair string (option string))))
    (list %transfers
       (or (pair %xtz_transfer_type (mutez %amount) (address %recipient))
           (pair %token_transfer_type
              (address %contract_address)
              (list %transfer_list
                 (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount)))))))))`

    const transfer_arg_michelson_type = p.parseMichelineExpression(transfer_arg_type) as MichelsonType
    const transfer_arg_schema = new Schema(transfer_arg_michelson_type)

    const map = {
      transfer_proposal: {
        transfers: mapTransfersArgs(transfer_proposal.transfers, this.data.address),
        registry_diff: transfer_proposal.registry_diff.map(item => [char2Bytes(item.key), char2Bytes(item.value)]),
        agora_post_id: agoraPostId
      }
    }
    console.log("map: ", map)

    const packed_transfer_proposal_arg = packDataBytes(
      transfer_arg_schema.Encode({
        transfers: mapTransfersArgs(transfer_proposal.transfers, this.data.address),
        registry_diff: transfer_proposal.registry_diff.map(item => [char2Bytes(item.key), char2Bytes(item.value)]),
        agora_post_id: agoraPostId
      }), // as MichelsonData
      transfer_arg_michelson_type
    )

    // Next we encode the proposal metadata for the 'execute proposal'.
    const proposal_meta_type = `(or (or (pair %add_handler
      (pair (lambda %code
              (pair (pair (map %handler_storage string bytes) (bytes %packed_argument))
                    (pair %proposal_info
                        (address %from)
                        (nat %frozen_token)
                        (bytes %proposal_metadata)))
              (pair (pair (option %guardian address) (map %handler_storage string bytes))
                    (list %operations operation)))
            (lambda %handler_check (pair bytes (map string bytes)) unit))
      (string %name))
    (pair %execute_handler (string %handler_name) (bytes %packed_argument)))
    (string %remove_handler))`
    const proposal_meta_michelson_type = p.parseMichelineExpression(proposal_meta_type) as MichelsonType
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
    console.log("proposalMetadata: ", proposalMetadata)

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
    console.log("tezos: ", tezos)
    console.log("handler_params: ", handler_params)
    console.log("handler_code: ", handler_code)
    console.log("agoraPostId: ", agoraPostId)
    console.log("handler_name: ", handler_name)
    console.log("lambda_arguments: ", lambda_arguments)

    const contract = await getContract(tezos, this.data.address)
    const p = new Parser()
    // const parser = new Parser();
    const transfer_arg_type = JSON.parse(lambda_arguments)
    console.log("transfer_arg_type: ", transfer_arg_type)
    // const transfer_arg_michelson_type = p.parseMichelineExpression(transfer_arg_type) as MichelsonType
    const transfer_arg_schema = new Schema(transfer_arg_type as MichelsonData)

    console.log("handler_params: ", handler_params)
    const handler_params_object = JSON.parse(handler_params)
    console.log("handler_params_object: ", handler_params_object)

    const packed_transfer_proposal_arg = packDataBytes(
      transfer_arg_schema.Encode(handler_params_object) // as MichelsonData
      // transfer_arg_michelson_type
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
    console.log("here")
    console.log("tezos: ", tezos)
    const contract = await getContract(tezos, this.data.address)

    const proposalMetadata = await BaseDAO.encodeLambdaAddMetadata(data, proposelambda, tezos)
    console.log("proposalMetadata: ", proposalMetadata)

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata.bytes
    )

    return await contractMethod.send()
  }

  public async proposeLambdaRemove({ handler_name }: LambdaRemoveArgs, tezos: TezosToolkit) {
    console.log("handler_name: ", handler_name)
    console.log("here remove")
    console.log("tezos: ", tezos)
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
