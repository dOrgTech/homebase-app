import { useCallback } from "react"
import { ethers } from "ethers"
import { decodeCallData } from "modules/etherlink/utils"
import { proposalInterfaces } from "modules/etherlink/config"
import { decodeCalldataWithEthers } from "modules/etherlink/utils"
import { getFunctionAbi } from "../getFunctionAbi"
import { useExplorerAbi } from "./useExplorerAbi"

export const useProposalData = (network: string) => {
  const { decodeWithExplorerAbi } = useExplorerAbi(network)

  const buildEntriesFromAbi = (functionAbi: string, callDataHex: string) => {
    try {
      const iface = new ethers.Interface([functionAbi])
      const frag = iface.getFunction(functionAbi)
      const decoded = decodeCalldataWithEthers(functionAbi, callDataHex)
      const fnName = decoded?.functionName || frag?.name || "call"
      const params: unknown[] = Array.isArray(decoded?.decodedData) ? (decoded?.decodedData as any[]) : []
      const inputs = Array.isArray((frag as any)?.inputs) ? ((frag as any).inputs as any[]) : []
      const signature = functionAbi.replace(/^function\s+/, "")

      const entries: { parameter: string; value: string }[] = []
      entries.push({ parameter: "Function", value: fnName })
      // Show signature as a separate line for clarity
      entries.push({ parameter: "Signature", value: signature })

      inputs.forEach((inp, i) => {
        const name = (inp?.name as string) || `arg${i}`
        const type = (inp?.type as string) || (inp?.internalType as string) || "bytes"
        const val = params[i]
        entries.push({ parameter: `${name} (${type})`, value: Array.isArray(val) ? JSON.stringify(val) : String(val) })
      })
      return entries
    } catch (e) {
      return []
    }
  }

  const buildProposalData = useCallback((proposal: any) => {
    try {
      const decodedByType = decodeCallData((proposal?.type || "") as any, proposal?.callDataPlain || [])
      if (decodedByType && decodedByType.length > 0) {
        // Try to enrich with function details if we can identify an ABI
        const first = (proposal?.callDataPlain?.[0] || "0x").toString()
        const fAbi = getFunctionAbi(first)
        const functionAbi = (fAbi?.interface?.[0] as string) || ""
        if (functionAbi) {
          return proposal?.callDataPlain?.flatMap((cd: string) => {
            const formatted = cd?.startsWith("0x") ? cd : `0x${cd}`
            const enriched = buildEntriesFromAbi(functionAbi, formatted)
            return enriched.length > 0 ? enriched : decodedByType
          })
        }
        return decodedByType
      }

      const first = (proposal?.callDataPlain?.[0] || "0x").toString()
      const fAbi = getFunctionAbi(first)
      const possible = proposalInterfaces.filter((x: any) => {
        let fbType = (proposal?.type || "").toLowerCase()
        if (fbType?.startsWith("mint")) fbType = "mint"
        if (fbType?.startsWith("burn")) fbType = "burn"
        return x.tags?.includes(fbType)
      })
      const functionAbi = (possible?.[0]?.interface?.[0] as string) || (fAbi?.interface?.[0] as string)
      if (functionAbi) {
        return proposal?.callDataPlain?.flatMap((callData: string) => {
          const formattedCallData = callData?.startsWith("0x") ? callData : `0x${callData}`
          const enriched = buildEntriesFromAbi(functionAbi, formattedCallData)
          if (enriched.length > 0) return enriched
          const decoded = decodeCalldataWithEthers(functionAbi, formattedCallData)
          const functionName = decoded?.functionName
          const params = decoded?.decodedData
          const proposalInterface = proposalInterfaces.find((x: any) => x.name === functionName)
          const label = proposalInterface?.label || functionName
          return [{ parameter: label, value: Array.isArray(params) ? params.join(", ") : String(params) }]
        })
      }

      const raw = (first || "0x").toString()
      return [
        {
          parameter: `Call Data (${proposal?.targets?.[0] || "unknown target"})`,
          value: raw.startsWith("0x") ? raw : `0x${raw}`
        }
      ]
    } catch (e) {
      const first = (proposal?.callDataPlain?.[0] || "0x").toString()
      return [
        {
          parameter: `Call Data (${proposal?.targets?.[0] || "unknown target"})`,
          value: first.startsWith("0x") ? first : `0x${first}`
        }
      ]
    }
  }, [])

  const isRawFallback = (entries: any[]) => {
    if (!Array.isArray(entries) || entries.length === 0) return true
    return entries.every(e => typeof e?.parameter === "string" && e.parameter.startsWith("Call Data ("))
  }

  const buildProposalDataAsync = useCallback(
    async (proposal: any) => {
      try {
        const entries: { parameter: string; value: string }[] = []
        const callDataList: string[] = proposal?.callDataPlain || []
        const targets: string[] = proposal?.targets || []
        for (let i = 0; i < callDataList.length; i++) {
          const cd = callDataList[i]
          const tgt = targets[i] || targets[0] || ""
          const formatted = cd?.startsWith("0x") ? cd : `0x${cd}`
          const decoded: any = await decodeWithExplorerAbi(tgt, formatted)
          if (decoded && decoded.functionName && Array.isArray(decoded.args)) {
            entries.push({ parameter: "Function", value: decoded.functionName })
            if (decoded.signature) entries.push({ parameter: "Signature", value: decoded.signature })
            decoded.args.forEach((a: any) => {
              entries.push({ parameter: `${a.name} (${a.type})`, value: String(a.value) })
            })
          } else if (decoded) {
            entries.push(decoded)
          } else {
            const raw = (formatted || "0x").toString()
            entries.push({ parameter: `Call Data (${tgt || "unknown target"})`, value: raw })
          }
        }
        return entries
      } catch {
        return []
      }
    },
    [decodeWithExplorerAbi]
  )

  return { buildProposalData, buildProposalDataAsync, isRawFallback }
}
