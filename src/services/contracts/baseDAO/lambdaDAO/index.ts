import { Expr, Parser, unpackDataBytes, MichelsonData, MichelsonType, packDataBytes } from "@taquito/michel-codec"
import { TezosToolkit } from "@taquito/taquito"
import { Schema } from "@taquito/michelson-encoder"
import { BaseDAO, BaseDAOData, getContract } from ".."
import { RegistryProposeArgs } from "./types"
import { bytes2Char, char2Bytes } from "@taquito/tzip16"
import proposeCode from "./michelson/propose"
import proposelambda from "./michelson/proposelambda"
import { RegistryExtraDTO } from "services/indexer/types"
import { mapTransfersArgs } from "services/indexer/dao/mappers/proposal"
import { BigNumber } from "bignumber.js"
import { formatUnits } from "../../utils"
import { LambdaAddArgs, LambdaRemoveArgs } from "../registryDAO/types"

const parser = new Parser()

interface LambdaDAOData extends BaseDAOData {
  extra: RegistryExtraDTO
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
    super(data)

    // this.decoded = {
    //   decodedRegistry: mapStorageRegistryList(this.data.extra.registry),
    //   decodedRegistryAffected: mapStorageRegistryAffectedList(this.data.extra.registry_affected),
    // };

    // this.data.extra.returnedPercentage = new BigNumber(100)
    //   .minus(new BigNumber(this.data.extra.slash_scale_value))
    //   .toString();
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
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
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
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
      proposalMetadata
    )

    return await contractMethod.send()
  }

  public propose = async ({ agoraPostId, transfer_proposal }: RegistryProposeArgs, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address)
    const p = new Parser()
    // const parser = new Parser();
    const transfer_arg_type = {
      prim: "pair",
      args: [
        {
          prim: "pair",
          args: [
            {
              prim: "nat",
              annots: ["%agora_post_id"]
            },
            {
              prim: "list",
              annots: ["%registry_diff"],
              args: [
                {
                  prim: "pair",
                  args: [
                    {
                      prim: "string"
                    },
                    {
                      prim: "option",
                      args: [
                        {
                          prim: "string"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          prim: "list",
          annots: ["%transfers"],
          args: [
            {
              prim: "or",
              args: [
                {
                  prim: "pair",
                  annots: ["%xtz_transfer_type"],
                  args: [
                    {
                      prim: "mutez",
                      annots: ["%amount"]
                    },
                    {
                      prim: "address",
                      annots: ["%recipient"]
                    }
                  ]
                },
                {
                  prim: "pair",
                  annots: ["%token_transfer_type"],
                  args: [
                    {
                      prim: "address",
                      annots: ["%contract_address"]
                    },
                    {
                      prim: "list",
                      annots: ["%transfer_list"],
                      args: [
                        {
                          prim: "pair",
                          args: [
                            {
                              prim: "address",
                              annots: ["%from_"]
                            },
                            {
                              prim: "list",
                              annots: ["%txs"],
                              args: [
                                {
                                  prim: "pair",
                                  args: [
                                    {
                                      prim: "address",
                                      annots: ["%to_"]
                                    },
                                    {
                                      prim: "nat",
                                      annots: ["%token_id"]
                                    },
                                    {
                                      prim: "nat",
                                      annots: ["%amount"]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }

    // const transfer_arg_michelson_type = p.parseMichelineExpression(
    //   transfer_arg_type
    // ) as MichelsonType;
    const transfer_arg_schema = new Schema(transfer_arg_type)

    // const michelsonType = parser.parseData(proposelambda);
    // const schema = new Schema(michelsonType as Expr);

    const map = {
      transfer_proposal: {
        transfers: mapTransfersArgs(transfer_proposal.transfers, this.data.address),
        registry_diff: transfer_proposal.registry_diff.map(item => [char2Bytes(item.key), char2Bytes(item.value)]),
        agora_post_id: agoraPostId
      }
    }
    console.log("map: ", map)

    const packed_transfer_proposal_arg = packDataBytes(
      transfer_arg_schema.Encode(map.transfer_proposal) // as MichelsonData
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

    // const proposal_data = {
    //   transfer_proposal: {
    //     transfers: mapTransfersArgs(transfer_proposal.transfers, this.data.address),
    //     registry_diff: transfer_proposal.registry_diff.map((item) => [char2Bytes(item.key), char2Bytes(item.value)]),
    //     agora_post_id: agoraPostId,
    //   }
    // }
    // console.log("proposal_data: ", JSON.stringify(proposal_data));

    // const utf8Encode = new TextEncoder();
    // const byteArr = utf8Encode.encode(JSON.stringify(proposal_data));
    // console.log("byteArr: ", byteArr.join(''));

    // const lambdaData = char2Bytes(
    //   JSON.stringify(proposal_data)
    // );
    // console.log("lambdaDataasd: ", lambdaData);

    // const dataJSON = parser.parseMichelineExpression(JSON.stringify(proposal_data)) as MichelsonData;
    // const packed = packDataBytes(
    //   dataJSON, // as MichelsonData
    // );
    // console.log("packed: ", packed);

    // const dataToEncode = {
    //   execute_handler: {
    //     handler_name: "transfer_proposal",
    //     packed_argument: packed,
    //   },
    // };

    // const data = schema.Encode(dataToEncode);

    // const { packed: proposalMetadata } = await tezos.rpc.packData({
    //   data,
    //   type: michelsonType as Expr,
    // });

    const contractMethod = contract.methods.propose(
      await tezos.wallet.pkh(),
      formatUnits(new BigNumber(this.data.extra.frozen_extra_value), this.data.token.decimals),
      proposalMetadata
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
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
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
      formatUnits(new BigNumber(this.data.fixed_proposal_fee_in_token), this.data.token.decimals),
      proposalMetadata
    )

    return await contractMethod.send()
  }
}
