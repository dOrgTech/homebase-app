import { ethers } from "ethers"
import { proposalInterfaces } from "./config"
import { IContractWriteMethod, IProposalType } from "./types"

export const networkConfig = {
  etherlink_testnet: {
    network: "testnet",
    explorerUrl: "https://testnet.explorer.etherlink.com",
    explorerApiUrl: "https://testnet.explorer.etherlink.com/api/v2",
    firebaseRootCollection: "idaosEtherlink-Testnet",
    firebaseRootTokenCollection: "tokensEtherlink-Testnet",
    firebaseMemberCollection: "iMembersEtherlink-Testnet"
  },
  etherlink_mainnet: {
    network: "mainnet",
    explorerUrl: "https://explorer.etherlink.com",
    explorerApiUrl: "https://explorer.etherlink.com/api/v2",
    firebaseRootCollection: "idaosEtherlink",
    firebaseRootTokenCollection: "tokensEtherlink",
    firebaseMemberCollection: "iMembersEtherlink"
  }
}

export const isInvalidEvmAddress = (address: string) => {
  return !ethers.isAddress(address)
}

export const isValidUrl = (url: string) => {
  return url.startsWith("http") || url.startsWith("https")
}

// removed validateEvmTokenAddress (unused)

export const getCallDataFromBytes = (bytes: any) => {
  // Handle case where bytes is already a hex string
  if (typeof bytes === "string") {
    // Ensure the string starts with '0x'
    return bytes.startsWith("0x") ? bytes : `0x${bytes}`
  }

  // Handle case where bytes is an object with toUint8Array method
  if (bytes && typeof bytes.toUint8Array === "function") {
    const cdBytes = bytes.toUint8Array()
    const hexString = Array.from(cdBytes)
      .map((byte: unknown) => (byte as number).toString(16).padStart(2, "0"))
      .join("")
    return `0x${hexString}`
  }

  // Handle Firebase Uint8Array bytes (common return type for Firestore 'bytes' fields)
  if (bytes && typeof bytes === "object" && bytes.constructor && bytes.constructor.name === "Uint8Array") {
    const arr = bytes as Uint8Array
    const hexString = Array.from(arr)
      .map((b: number) => b.toString(16).padStart(2, "0"))
      .join("")
    return `0x${hexString}`
  }

  // If bytes is neither string nor has toUint8Array method, return a default value
  console.warn("getCallDataFromBytes: Invalid input type", bytes)
  return "0x"
}

export function parseTransactionHash(input?: string): string {
  if (!input || typeof input !== "string") return ""

  const trimmed = input.trim()

  // If already a 0x-prefixed 32-byte hash, return sans 0x
  if (/^0x[0-9a-fA-F]{64}$/.test(trimmed)) {
    return trimmed.slice(2)
  }
  // If a non-prefixed 32-byte hash, return as-is (lowercase for consistency)
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  // Try to handle Python-style bytes repr: b'\x12\xab...' or '\x12\xab...'
  let raw = trimmed
  const startsWithBQuote = (raw.startsWith("b'") && raw.endsWith("'")) || (raw.startsWith('b"') && raw.endsWith('"'))
  const startsWithQuote = (raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))
  if (startsWithBQuote) {
    raw = raw.substring(2, raw.length - 1)
  } else if (startsWithQuote) {
    raw = raw.substring(1, raw.length - 1)
  }

  const byteValues: number[] = []
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "\\" && raw[i + 1] === "x") {
      // Extract the two hex characters following '\x'
      const hexValue = raw.substring(i + 2, i + 4)
      if (hexValue.length === 2) {
        byteValues.push(parseInt(hexValue, 16))
        i += 3 // Skip past the processed '\xNN' sequence
      }
    } else {
      // Add ASCII code for literal characters
      byteValues.push(raw.charCodeAt(i))
    }
  }

  // Convert bytes to hex string with zero-padding
  const hexString = byteValues.map(byte => byte.toString(16).padStart(2, "0")).join("")
  return hexString
}

// removed getCallDataForProposal (unused)

export function decodeCalldataWithEthers(functionAbi: string, callDataHex: string, isRetry = false): any {
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

// removed decodeFunctionParameters (unused)

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
// removed decodeFunctionParametersLegacy (unused)

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

export function getBlockExplorerUrl(network: string, executionHash?: string) {
  if (!executionHash || typeof executionHash !== "string") return ""

  const base = networkConfig[network as keyof typeof networkConfig]?.explorerUrl
  if (!base) return ""

  // If executionHash is already a full tx hash, use it directly
  const trimmed = executionHash.trim()
  const isFullHash = /^0x[0-9a-fA-F]{64}$/.test(trimmed)
  const isBareHash = /^[0-9a-fA-F]{64}$/.test(trimmed)

  let txHash = ""
  if (isFullHash) {
    txHash = trimmed
  } else if (isBareHash) {
    txHash = `0x${trimmed.toLowerCase()}`
  } else {
    const parsed = parseTransactionHash(trimmed)
    if (!parsed) return ""
    txHash = parsed.startsWith("0x") ? parsed : `0x${parsed}`
  }

  return `${base}/tx/${txHash}`
}

export async function getEtherAddressDetails(network: string, address: string) {
  const response = await fetch(
    networkConfig[network as keyof typeof networkConfig]?.explorerApiUrl + "/addresses/" + address
  )
  const data = await response.json()
  return data
}

export async function getEtherTokenBalances(network: string, address: string) {
  const response = await fetch(
    networkConfig[network as keyof typeof networkConfig]?.explorerApiUrl + "/addresses/" + address + "/token-balances"
  )
  const data = await response.json()
  return data
}

export async function getEtherlinkDAONfts(network: string, address: string) {
  const response = await fetch(
    networkConfig[network as keyof typeof networkConfig]?.explorerApiUrl + "/addresses/" + address + "/nft"
  )
  const data = await response.json()
  return data
}

function _decodedCallData(possibleInterfaces: any[], callData: string) {
  const formattedCallData = callData.startsWith("0x") ? callData : `0x${callData}`
  const response = {
    parameter: "",
    value: ""
  }
  for (const iface of possibleInterfaces) {
    const decodedDataPair = decodeCalldataWithEthers(iface.interface?.[0], formattedCallData)
    console.log("callDataXYB decodedDataPair", decodedDataPair)
    const functionName = decodedDataPair?.functionName
    const functionParams = decodedDataPair?.decodedData
    const label = iface?.label
    response.parameter = label || functionName
    response.value = functionParams.join(", ")
    if (response.value) break
  }
  return response
}
// TODO: Imeplement within wagmi/context.tsx
export function decodeCallData(proposalType: IProposalType, callDataPlain: string[]) {
  let proposalData: { parameter: string; value: string }[] = []
  const possibleInterfaces = proposalInterfaces.filter((x: any) => {
    let fbType = proposalType.toLowerCase()
    if (fbType?.startsWith("mint")) fbType = "mint"
    if (fbType?.startsWith("burn")) fbType = "burn"
    return x.tags?.includes(fbType)
  })
  if (possibleInterfaces?.length > 0) {
    proposalData = callDataPlain.map((callData: string) => _decodedCallData(possibleInterfaces, callData))
  }
  return proposalData
}

export async function getContractDetails(contractAddress: string, network: string) {
  const response = await fetch(
    networkConfig[network as keyof typeof networkConfig]?.explorerApiUrl + "/smart-contracts/" + contractAddress
  )
  const data = await response.json()
  return data
}

export async function getContractWriteMethods(contractAddress: string, network: string) {
  const response = await fetch(
    networkConfig[network as keyof typeof networkConfig]?.explorerApiUrl +
      "/smart-contracts/" +
      contractAddress +
      "/write-methods?is_custom_abi=false"
  )
  const data = await response.json()
  return data as IContractWriteMethod[]
}
