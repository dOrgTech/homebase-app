import { ethers, FunctionFragment } from "ethers"
import { proposalInterfaces } from "./config"

export const isInvalidEvmAddress = (address: string) => {
  return !ethers.isAddress(address)
}

export const isValidUrl = (url: string) => {
  return url.startsWith("http") || url.startsWith("https")
}

export const validateEvmTokenAddress = (address: string) => {
  return ethers.isAddress(address)
}

export const getCallDataFromBytes = (bytes: any) => {
  const cdBytes = bytes.toUint8Array()
  const hexString = Array.from(cdBytes)
    .map((byte: unknown) => (byte as number).toString(16).padStart(2, "0"))
    .join("")
  return `0x${hexString}`
}

export function parseTransactionHash(input: string): string {
  // Equivalent to input.substring(2, input.length - 1)
  input = input.substring(2, input.length - 1)

  const byteValues: number[] = []

  for (let i = 0; i < input.length; i++) {
    if (input[i] === "\\" && input[i + 1] === "x") {
      // Extract the two hex characters following '\x'
      const hexValue = input.substring(i + 2, i + 4)
      byteValues.push(parseInt(hexValue, 16))
      i += 3 // Skip past the processed '\xNN' sequence
    } else {
      // Add ASCII code for literal characters
      byteValues.push(input.charCodeAt(i))
    }
  }

  // Convert bytes to hex string with zero-padding
  const hexString = byteValues.map(byte => byte.toString(16).padStart(2, "0")).join("")

  return hexString
}

export const getCallDataForProposal = (
  proposalType:
    | "quorum"
    | "voting delay"
    | "voting period"
    | "proposal threshold"
    | "quorumNumerator"
    | "votingDelay"
    | "votingPeriod"
    | "proposalThreshold",
  {
    title,
    description,
    externalResource
  }: {
    title: string
    description: string
    externalResource: string
  },
  value: any
) => {
  let ifaceDef, iface: any, encodedData: any

  if (["quorum", "quorumNumerator"].includes(proposalType)) {
    ifaceDef = proposalInterfaces.find(p => p.name === "updateQuorumNumerator")
    if (!ifaceDef) return
    iface = new ethers.Interface(ifaceDef.interface)
    encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
  }
  if (["voting delay", "votingDelay"].includes(proposalType)) {
    ifaceDef = proposalInterfaces.find(p => p.name === "setVotingDelay")
    if (!ifaceDef) return
    iface = new ethers.Interface(ifaceDef.interface)
    encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
  }
  if (["voting period", "votingPeriod"].includes(proposalType)) {
    ifaceDef = proposalInterfaces.find(p => p.name === "setVotingPeriod")
    if (!ifaceDef) return
    iface = new ethers.Interface(ifaceDef.interface)
    encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
  }
  if (["proposal threshold", "proposalThreshold"].includes(proposalType)) {
    ifaceDef = proposalInterfaces.find(p => p.name === "setProposalThreshold")
    if (!ifaceDef) return
    iface = new ethers.Interface(ifaceDef.interface)
    encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
  }
  return encodedData
}

export function decodeCalldataWithEthers(functionAbi: string, callDataHex: string, isRetry = false): any {
  // try {
  //   const callDataHexValue = !callDataHex?.startsWith("0x") ? `0x${callDataHex}` : callDataHex
  //   const selector = callDataHexValue.slice(0, 10) // "0xa9059cbb"
  //   console.log("decodeCalldataWithEthers:Function Selector:", selector)

  //   const paramTypes = ["address", "uint256", "uint8"]
  //   const argsData = "0x" + callDataHexValue.slice(10)
  //   console.log("decodeCalldataWithEthers:Args Data:", argsData)

  //   const decodedArgs = ethers.AbiCoder.defaultAbiCoder().decode(paramTypes, argsData)
  //   console.log("decodeCalldataWithEthers:Decoded Args:", decodedArgs)

  //   return { decoded: [], functionName: "", decodedData: [] }
  // } catch (error) {
  //   console.log("error:decodeCalldataWithEthers", functionAbi, callDataHex, error)
  //   return { decoded: [], functionName: "", decodedData: [] }
  // }

  const callDataHexValue = callDataHex.startsWith("0x") ? callDataHex : `0x${callDataHex}`

  try {
    const iface = new ethers.Interface([functionAbi])
    const decoded = iface.decodeFunctionData(functionAbi, callDataHexValue)
    const functionName = iface.getFunction(functionAbi)?.name
    return { decoded, functionName, decodedData: convertBigIntToString(decoded) }
  } catch (error) {
    if (isRetry) {
      console.log("error:decodeCalldataWithEthers", {
        functionAbi,
        callDataHexValue,
        error
      })
      return { decoded: [], functionName: "", decodedData: [] }
    }

    return decodeCalldataWithEthers(functionAbi, callDataHex, true)
  }
}

// TODO: Remove this function later
export function decodeFunctionParameters(functionAbi: FunctionFragment | string, hexString: string): any[] {
  if (typeof functionAbi === "string") {
    functionAbi = FunctionFragment.from(functionAbi)
  }

  // Utility function to convert hex string to Uint8Array
  const hexToBytes = (hex: string): Uint8Array => {
    return ethers.getBytes(hex)
  }

  // Utility function to convert a subset of bytes to BigInt
  const bytesToBigInt = (bytes: Uint8Array): bigint => {
    return BigInt("0x" + Buffer.from(bytes).toString("hex"))
  }

  // Convert the hex string to bytes
  const dataBytes: Uint8Array = hexToBytes(hexString)

  // Remove the first 4 bytes (function selector)
  const dataWithoutSelector: Uint8Array = dataBytes.slice(4)

  // Initialize decoding variables
  let offset = 0
  const decodedParams: any[] = []

  for (const param of functionAbi.inputs) {
    const paramType = param.type

    if (paramType === "string") {
      // String type decoding (dynamic)

      // Read the 32-byte offset
      const paramOffsetBytes = dataWithoutSelector.slice(offset, offset + 32)
      const paramOffset: bigint = bytesToBigInt(paramOffsetBytes)
      const paramOffsetInt = Number(paramOffset)

      // Decode length of the string
      const lengthBytes = dataWithoutSelector.slice(paramOffsetInt, paramOffsetInt + 32)
      const length: bigint = bytesToBigInt(lengthBytes)
      const lengthInt = Number(length)

      // Extract the actual string data
      const stringBytes = dataWithoutSelector.slice(paramOffsetInt + 32, paramOffsetInt + 32 + lengthInt)
      const decodedString = ethers.toUtf8String(stringBytes)

      decodedParams.push(decodedString)
    } else if (paramType === "address") {
      // Address type decoding (last 20 bytes of the 32-byte slot)
      const addressBytes = dataWithoutSelector.slice(offset + 12, offset + 32)
      const addressHex = ethers.hexlify(addressBytes)
      const checksumAddress = ethers.getAddress(addressHex)

      decodedParams.push(checksumAddress)
    } else if (paramType.startsWith("uint") || paramType.startsWith("int")) {
      // Uint or Int type decoding (entire 32 bytes)
      const uintBytes = dataWithoutSelector.slice(offset, offset + 32)
      const uintValue = bytesToBigInt(uintBytes).toString()

      decodedParams.push(uintValue)
    } else {
      throw new Error(`Unsupported parameter type: ${paramType}`)
    }

    // Move to the next 32-byte slot
    offset += 32
  }

  return decodedParams
}

export function convertBigIntToString(obj: unknown): unknown {
  if (typeof obj === "bigint") {
    return obj.toString()
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString)
  } else if (obj && typeof obj === "object") {
    const newObj: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = convertBigIntToString(value)
    }
    return newObj
  }
  return obj
}

export function decodeFunctionParametersLegacy(functionAbiString: string, hexString: string): any[] {
  const functionAbi = FunctionFragment.from(functionAbiString)
  console.log("functionAbi", functionAbi)
  // Helper function to convert a hex string to a Uint8Array
  function hexToBytes(hex: string): Uint8Array {
    if (hex.startsWith("0x")) {
      hex = hex.slice(2)
    }
    if (hex.length % 2 !== 0) {
      hex = "0" + hex
    }
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
    }
    return bytes
  }

  // Helper function to convert a Uint8Array to a BigInt
  function bytesToBigInt(bytes: Uint8Array): bigint {
    let value = BigInt(0)
    for (let i = 0; i < bytes.length; i++) {
      value = (value << BigInt(8)) + BigInt(bytes[i])
    }
    return value
  }

  // Helper function to convert a Uint8Array to a hex string
  function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  }

  try {
    // Convert the hex string to bytes
    const dataBytes = hexToBytes(hexString)

    // Ensure the data is at least 4 bytes for the function selector
    if (dataBytes.length < 4) {
      throw new Error("Hex string is too short to contain a function selector.")
    }

    // Remove the first 4 bytes (function selector)
    const dataWithoutSelector = dataBytes.slice(4)

    // Initialize decoding variables
    let offset = 0
    const decodedParams: any[] = []

    for (const param of functionAbi.inputs) {
      switch (param.type) {
        case "string": {
          // Decode the offset to the string data
          const paramOffsetBytes = dataWithoutSelector.slice(offset, offset + 32)
          const paramOffset = Number(bytesToBigInt(paramOffsetBytes))

          // Decode the length of the string
          const lengthBytes = dataWithoutSelector.slice(paramOffset, paramOffset + 32)
          const length = Number(bytesToBigInt(lengthBytes))

          // Extract the actual string data
          const stringBytes = dataWithoutSelector.slice(paramOffset + 32, paramOffset + 32 + length)
          const decoder = new TextDecoder()
          const decodedString = decoder.decode(stringBytes)

          decodedParams.push(decodedString)
          break
        }

        case "address": {
          // Decode the address (last 20 bytes of the 32-byte slot)
          const addressBytes = dataWithoutSelector.slice(offset + 12, offset + 32)
          const addressHex = "0x" + bytesToHex(addressBytes)
          decodedParams.push(addressHex)
          break
        }

        default:
          if (param.type.startsWith("uint")) {
            // Decode unsigned integers (e.g., uint256)
            const uintBytes = dataWithoutSelector.slice(offset, offset + 32)
            const uintValue = bytesToHex(uintBytes)
            // const uintValueHex = ethers.hexlify(uintBytes)
            // const uintValueBigNumber = ethers.toNumber(uintValueHex)
            // const uintValueBigNumberX = ethers.toNumber(uintBytes)
            decodedParams.push({
              value: uintValue,
              bytes: uintBytes
            })
          } else {
            throw new Error(`Unsupported parameter type: ${param.type}`)
          }
      }

      // Move to the next 32-byte slot
      offset += 32
    }

    return decodedParams
  } catch (error) {
    console.log("error:decodeFunctionParametersLegacy", { functionAbiString, hexString, error })
    return []
  }
}

export function getDaoConfigType(type: string) {
  if (type === "quorumNumerator") return "quorum"
  if (type === "votingDelay") return "voting delay"
  if (type === "votingPeriod") return "voting period"
  if (type === "proposalThreshold") return "proposal threshold"
  return ""
}

export function getDaoTokenOpsType(type: string, tokenSymbol: string) {
  if (type === "mint") return `Mint ${tokenSymbol}`
  if (type === "burn") return `Burn ${tokenSymbol}`
  return ""
}
