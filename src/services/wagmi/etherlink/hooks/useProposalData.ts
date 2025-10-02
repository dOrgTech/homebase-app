import { useCallback } from "react"
import { decodeCallData } from "modules/etherlink/utils"
import { proposalInterfaces } from "modules/etherlink/config"
import { decodeCalldataWithEthers } from "modules/etherlink/utils"
import { getFunctionAbi } from "../getFunctionAbi"
import { useExplorerAbi } from "./useExplorerAbi"

export const useProposalData = (network: string) => {
  const { decodeWithExplorerAbi } = useExplorerAbi(network)

  const buildProposalData = useCallback((proposal: any) => {
    try {
      const decodedByType = decodeCallData((proposal?.type || "") as any, proposal?.callDataPlain || [])
      if (decodedByType && decodedByType.length > 0) {
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
        return proposal?.callDataPlain?.map((callData: string) => {
          const formattedCallData = callData?.startsWith("0x") ? callData : `0x${callData}`
          const decoded = decodeCalldataWithEthers(functionAbi, formattedCallData)
          const functionName = decoded?.functionName
          const params = decoded?.decodedData
          const proposalInterface = proposalInterfaces.find((x: any) => x.name === functionName)
          const label = proposalInterface?.label || functionName
          return { parameter: label, value: Array.isArray(params) ? params.join(", ") : String(params) }
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
          const decoded = await decodeWithExplorerAbi(tgt, formatted)
          if (decoded) {
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
