import { TezosToolkit } from "@taquito/taquito"
import { validateAddress, encodePubKey, encodeKey, encodeKeyHash } from "@taquito/utils"
import { TokenSchema, Schema } from "@taquito/michelson-encoder"
import { rpcNodes } from "services/beacon"
import { assertNever } from "assert-never"
import type { token, tokenValueType } from "."
import type { MichelineMichelsonV1Expression } from "@airgap/beacon-sdk"

function getFieldName(id: any): string {
  return `input-${id.toString()}`
}

function initTokenTable(init: any, counter: any, defaultInit: tokenValueType = "") {
  init[getFieldName(counter)] = defaultInit
}

function parseSchema(counter: number, token: TokenSchema, init: Record<string, any>, name?: string): [token, number] {
  switch (token.__michelsonType) {
    case "bls12_381_fr":
    case "bls12_381_g1":
    case "bls12_381_g2":
    case "chain_id":
    case "key_hash":
    case "key":
    case "bytes":
    case "signature":
    case "string":
      initTokenTable(init, counter)
      return [
        {
          counter,
          name,
          type: token.__michelsonType,
          children: [],
          placeholder: token.__michelsonType,
          initValue: ""
        },
        counter
      ]
    case "address":
      initTokenTable(init, counter)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          placeholder: token.__michelsonType,
          validate(value) {
            if (validateAddress(value) !== 3) {
              return `invalid address ${value}`
            }
          },
          initValue: ""
        },
        counter
      ]
    case "contract":
      initTokenTable(init, counter)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          placeholder: "contract",
          validate(value) {
            if (validateAddress(value) !== 3) {
              return `invalid address ${value}`
            }
          },
          initValue: ""
        },
        counter
      ]
    case "bool":
      initTokenTable(init, counter, false)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          placeholder: token.__michelsonType,
          initValue: false
        },
        counter
      ]
    case "int":
    case "nat":
      initTokenTable(init, counter)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          placeholder: token.__michelsonType,
          validate(value) {
            if (value && isNaN(Number(value))) {
              return `Invalid number, got: ${value}`
            }
          },
          initValue: ""
        },
        counter
      ]
    case "mutez":
    case "timestamp":
      initTokenTable(init, counter)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          placeholder: token.__michelsonType,
          validate(value) {
            const n = Number(value)
            if (isNaN(n)) {
              return `Invalid number, got: ${value}`
            }
            if (n < 0) {
              return `Number should be greater or equal to 0, got ${value}`
            }
          },
          initValue: ""
        },
        counter
      ]
    case "never":
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          initValue: ""
        },
        counter
      ]
    case "operation":
      throw new Error("can't happen: operation is forbidden in the parameter")
    case "chest":
    case "chest_key":
      throw new Error(
        "can't happen(Tezos bug): time lock related instructions is disabled in the client because of a vulnerability"
      )
    case "unit":
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          initValue: ""
        },
        counter
      ]
    case "or": {
      const schemas = Object.entries(token.schema)
      let new_counter = counter
      const children: token[] = []
      let child
      schemas.forEach(([k, v]) => {
        ;[child, new_counter] = parseSchema(new_counter + 1, v, init, k)
        children.push(child)
      })
      initTokenTable(init, counter, schemas[0][0])
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children,
          initValue: schemas[0][0]
        },
        new_counter
      ]
    }
    case "set":
    case "list": {
      initTokenTable(init, counter, [])
      const [child, new_counter] = parseSchema(counter + 1, token.schema, init)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [child],
          initValue: []
        },
        new_counter
      ]
    }
    case "pair": {
      const schemas = Object.entries(token.schema)
      let new_counter = counter
      const children: token[] = []
      let child
      schemas.forEach(([k, v]) => {
        ;[child, new_counter] = parseSchema(new_counter + 1, v, init, k)
        children.push(child)
      })
      initTokenTable(init, counter, [])
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children,
          initValue: []
        },
        new_counter
      ]
    }
    case "map":
    case "big_map": {
      const schemas = Object.entries(token.schema)
      let new_counter = counter
      const children: token[] = []
      let child
      schemas.forEach(([k, v]) => {
        ;[child, new_counter] = parseSchema(new_counter + 1, v, init, k)
        children.push(child)
      })
      initTokenTable(init, counter, [])
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children,
          initValue: []
        },
        new_counter
      ]
    }
    case "option": {
      const [child, new_counter] = parseSchema(counter + 1, token.schema, init)

      initTokenTable(init, counter, "none")
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [child],
          initValue: "none"
        },
        new_counter
      ]
    }
    case "constant":
      throw new Error("can't happen: constant will never be in parameter")
    case "lambda":
      initTokenTable(init, counter)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          placeholder: "lambda",
          children: [],
          initValue: ""
        },
        counter
      ]
    case "sapling_transaction_deprecated":
    case "sapling_transaction":
    case "sapling_state":
      initTokenTable(init, counter)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          placeholder: token.__michelsonType + " " + token.schema.memoSize,
          children: [],
          initValue: ""
        },
        counter
      ]
    case "ticket_deprecated":
    case "ticket":
      initTokenTable(init, counter)
      return [
        {
          counter: counter,
          name,
          type: token.__michelsonType,
          children: [],
          initValue: ""
        },
        counter
      ]
    default:
      return assertNever(token as never)
  }
}

async function parseContractScript(c: any, initTokenTable: Record<string, tokenValueType>) {
  let token,
    counter = 0
  const entryponts = Object.entries(c.entrypoints.entrypoints).reverse()
  if (entryponts.length == 0) {
    ;[token, counter] = parseSchema(0, c.parameterSchema.generateSchema(), initTokenTable, "entrypoint")
    console.log("Token:", token)
  } else {
    console.log("Case 2")
    // handle the case of multiple entrypoints
    const childrenToken = []
    let childToken
    let init
    let setInit = false
    for (let i = 0; i < entryponts.length; i++) {
      const [entrypoint, type] = entryponts[i]
      const schema = new Schema(type as MichelineMichelsonV1Expression).generateSchema()
      if (schema.__michelsonType !== "or") {
        if (!setInit) {
          init = entrypoint
          setInit = true
        }
        let new_counter
        ;[childToken, new_counter] = parseSchema(counter, schema, initTokenTable, entrypoint)
        counter = new_counter + 1
        childrenToken.push(childToken)
      }
    }
    counter = counter + 1
    if (typeof init === "undefined") throw new Error("internal error: initial entrypoint is undefined")
    token = {
      counter,
      name: "entrypoint",
      type: "or",
      children: childrenToken,
      initValue: init
    }
    initTokenTable[getFieldName(token.counter)] = token.initValue
  }
  initTokenTable["counter"] = counter
  return token
}

async function getContractEndpoints(network: string, contractAddress: string) {
  try {
    const tezosNetwork = network === "ghostnet" ? "ghostnet" : "mainnet"
    const tezos = new TezosToolkit(rpcNodes[tezosNetwork])
    const contract = await tezos.contract.at(contractAddress)
    const endpoints = await parseContractScript(contract, {})
    console.log("Endpoints:", endpoints)
    return [endpoints, null]
  } catch (error) {
    console.error("Error fetching contract:", error)
    return [null, error]
  }
}

export { getContractEndpoints }
