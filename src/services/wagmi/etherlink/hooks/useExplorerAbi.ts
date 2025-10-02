import { useRef, useCallback } from "react"
import { ethers } from "ethers"
import { getContractWriteMethods } from "modules/etherlink/utils"
import { decodeCalldataWithEthers } from "modules/etherlink/utils"
import { proposalInterfaces } from "modules/etherlink/config"

export const useExplorerAbi = (network: string) => {
  const abiCacheRef = useRef<Map<string, any[]>>(new Map())

  const getMethodsForAddress = useCallback(
    async (address: string) => {
      const key = (address || "").toLowerCase()
      if (!key) return []
      const cached = abiCacheRef.current.get(key)
      if (cached) return cached
      try {
        const methods = await getContractWriteMethods(address, network)
        abiCacheRef.current.set(key, methods || [])
        return methods || []
      } catch (e) {
        return []
      }
    },
    [network]
  )

  const buildFunctionAbiFromMethod = (m: any) => {
    try {
      const name = m?.name || ""
      const inputs = Array.isArray(m?.inputs) ? m.inputs : []
      const types = inputs.map((i: any) => i?.type || i?.internalType || "bytes").join(",")
      const fragment = `function ${name}(${types})`
      return fragment
    } catch {
      return ""
    }
  }

  const calcSelector = (functionAbi: string) => {
    try {
      return ethers.id(functionAbi).substring(0, 10)
    } catch {
      return ""
    }
  }

  const decodeWithExplorerAbi = useCallback(
    async (target: string, callDataHex: string) => {
      try {
        const methods = await getMethodsForAddress(target)
        const selector = (callDataHex || "").substring(0, 10)
        for (const m of methods) {
          const functionAbi = buildFunctionAbiFromMethod(m)
          if (!functionAbi) continue
          const sel = calcSelector(functionAbi)
          if (sel && sel === selector) {
            const decoded = decodeCalldataWithEthers(functionAbi, callDataHex)
            const functionName = decoded?.functionName || m?.name || "call"
            const params = decoded?.decodedData
            const proposalInterface = proposalInterfaces.find((x: any) => x.name === functionName)
            const label = proposalInterface?.label || functionName
            return { parameter: label, value: Array.isArray(params) ? params.join(", ") : String(params) }
          }
        }
      } catch (_) {
        // ignore
      }
      return null
    },
    [getMethodsForAddress]
  )

  return { getMethodsForAddress, buildFunctionAbiFromMethod, calcSelector, decodeWithExplorerAbi }
}
