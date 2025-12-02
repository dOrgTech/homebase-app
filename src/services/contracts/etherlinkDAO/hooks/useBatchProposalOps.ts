import { ethers } from "ethers"
import { useCallback, useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { proposalInterfaces, enabledBatchActionTypes } from "modules/etherlink/config"
import { useEvmProposalCreateZustantStore } from "./useEvmProposalOps"

export function parseCsvSimple(text: string): { header: string[]; rows: string[][] } {
  const lines = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter(l => l.trim().length > 0)
  const parseLine = (line: string) => {
    const out: string[] = []
    let cur = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === "," && !inQuotes) {
        out.push(cur)
        cur = ""
      } else {
        cur += ch
      }
    }
    out.push(cur)
    return out
  }
  if (lines.length === 0) return { header: [], rows: [] }
  const header = parseLine(lines[0])
  const rows = lines.slice(1).map(l => {
    const r = parseLine(l)
    if (r.length < header.length) {
      r.push(...Array(header.length - r.length).fill(""))
    }
    return r
  })
  return { header, rows }
}

interface BatchProposalOpsParams {
  etherlink: any
  zustantStore: any
  daoTreasuryTokens?: any[]
  daoNfts?: any[]
}

export const useBatchProposalOps = ({
  etherlink,
  zustantStore,
  daoTreasuryTokens,
  daoNfts
}: BatchProposalOpsParams) => {
  const context = useContext(EtherlinkContext)
  const daoSelected = context?.daoSelected

  const parseBatchCsv = useCallback(
    (text: string) => {
      try {
        const parsed = parseCsvSimple(text)
        const idx = (name: string) =>
          parsed.header.findIndex(h => (h || "").toLowerCase().trim() === name.toLowerCase().trim())
        const col = (arr: string[], name: string) => {
          const i = idx(name)
          return i >= 0 && i < arr.length ? arr[i] : ""
        }
        const rows: any[] = parsed.rows.map(r => ({
          type: col(r, "type"),
          asset: col(r, "asset"),
          to: col(r, "to"),
          amount: col(r, "amount")
        }))
        const actions: any[] = []
        const errors: string[] = []
        const warnings: string[] = []
        const asStr = (v: any) => (v === undefined || v === null ? "" : String(v))
        rows.forEach((row, idx) => {
          const rowNum = idx + 2
          const type = asStr(row.type).trim().toLowerCase()
          const asset = asStr(row.asset).trim()
          const to = asStr(row.to).trim()
          const amount = asStr(row.amount).trim()

          const pushError = (m: string) => errors.push(`Row ${rowNum}: ${m}`)
          const pushWarning = (m: string) => warnings.push(`Row ${rowNum}: ${m}`)

          if (type && !enabledBatchActionTypes.includes(type as any)) {
            return pushError(`action type '${type}' is not enabled`)
          }

          switch (type) {
            case "transfer":
              if (!to || !ethers.isAddress(to)) return pushError("transfer requires valid 'to' address")
              if (!amount) return pushError("transfer requires 'amount'")
              if (!asset) return pushError("transfer requires 'asset' (ERC20 address or 'native')")

              if (asset.toLowerCase() === "native") {
                actions.push({ type: "transfer_eth", to, amount })
              } else if (ethers.isAddress(asset)) {
                if (daoTreasuryTokens && daoTreasuryTokens.length > 0) {
                  const found = daoTreasuryTokens.find(
                    (t: any) => String(t?.address || "").toLowerCase() === asset.toLowerCase()
                  )
                  if (!found) {
                    pushWarning("Asset not in treasury - ensure DAO has approval or balance")
                  }
                }
                actions.push({ type: "transfer_erc20", asset, to, amount })
              } else {
                return pushError("transfer 'asset' must be 'native' or a valid ERC20 address")
              }
              break
            case "mint":
              if (!to || !ethers.isAddress(to)) return pushError("mint requires valid 'to' address")
              if (!amount) return pushError("mint requires 'amount'")
              actions.push({ type: "mint", to, amount, asset: asset || "" })
              break
            case "burn":
              if (!to || !ethers.isAddress(to))
                return pushError("burn requires valid 'to' address (address to burn from)")
              if (!amount) return pushError("burn requires 'amount'")
              actions.push({ type: "burn", from: to, amount, asset: asset || "" })
              break
            default:
              if (type) return pushError(`unknown type '${type}'`)
              break
          }
        })
        return { actions, errors, warnings }
      } catch (e: any) {
        return { actions: [], errors: [String(e?.message || e)], warnings: [] }
      }
    },
    [daoTreasuryTokens, daoNfts]
  )

  const prepareBatchFromActions = useCallback(async () => {
    if (!daoSelected?.address) throw new Error("DAO not loaded")
    const reg = daoSelected.registryAddress
    const gov = daoSelected.token
    const daoAddr = daoSelected.address
    if (!reg || !gov) throw new Error("DAO registry or token address missing")

    const actions = (useEvmProposalCreateZustantStore.getState().batch?.actions || []) as any[]
    if (!actions.length) throw new Error("No actions to submit")

    const targets: string[] = []
    const values: (bigint | number | string)[] = []
    const calldatas: string[] = []
    const kinds: string[] = []

    const ifaceOf = (name: string) => {
      const def = proposalInterfaces.find(p => p.name === name)
      if (!def) throw new Error(`Missing interface for ${name}`)
      return new ethers.Interface(def.interface)
    }

    const tokenDecimals = async (tokenAddr: string): Promise<number> => {
      try {
        const erc20 = new ethers.Contract(
          tokenAddr,
          ["function decimals() view returns (uint8)"],
          etherlink?.provider || etherlink?.signer
        )
        const dec: number = Number(await erc20.decimals())
        if (Number.isFinite(dec)) return dec
      } catch (_) {}
      console.warn(`Unable to fetch decimals for token ${tokenAddr}, defaulting to 18`)
      return 18
    }

    for (const a of actions) {
      switch (a.type) {
        case "transfer_eth": {
          const iface = ifaceOf("transferETH")
          const data = iface.encodeFunctionData("transferETH", [a.to, ethers.parseEther(String(a.amount || "0"))])
          targets.push(reg)
          values.push(0)
          calldatas.push(data)
          kinds.push("transfer")
          break
        }
        case "transfer_erc20": {
          const dec = await tokenDecimals(a.asset)
          const iface = ifaceOf("transferERC20")
          const data = iface.encodeFunctionData("transferERC20", [
            a.asset,
            a.to,
            ethers.parseUnits(String(a.amount || "0"), dec)
          ])
          targets.push(reg)
          values.push(0)
          calldatas.push(data)
          kinds.push("transfer")
          break
        }
        case "mint": {
          const iface = new ethers.Interface(["function mint(address to, uint256 amount)"])
          const tokenAddr = a.asset && ethers.isAddress(a.asset) ? a.asset : gov
          const dec =
            a.asset && ethers.isAddress(a.asset) ? await tokenDecimals(a.asset) : Number(daoSelected?.decimals || 18)
          const data = iface.encodeFunctionData("mint", [a.to, ethers.parseUnits(String(a.amount || "0"), dec)])
          targets.push(tokenAddr)
          values.push(0)
          calldatas.push(data)
          kinds.push("mint")
          break
        }
        case "burn": {
          const iface = new ethers.Interface(["function burn(address from, uint256 amount)"])
          const tokenAddr = a.asset && ethers.isAddress(a.asset) ? a.asset : gov
          const dec =
            a.asset && ethers.isAddress(a.asset) ? await tokenDecimals(a.asset) : Number(daoSelected?.decimals || 18)
          const data = iface.encodeFunctionData("burn", [a.from, ethers.parseUnits(String(a.amount || "0"), dec)])
          targets.push(tokenAddr)
          values.push(0)
          calldatas.push(data)
          kinds.push("burn")
          break
        }
        default:
          throw new Error(`Unsupported action type: ${a?.type}`)
      }
    }

    return { targets, values, calldatas, _actionKinds: kinds }
  }, [
    daoSelected?.address,
    daoSelected?.registryAddress,
    daoSelected?.token,
    daoSelected?.decimals,
    etherlink?.provider,
    etherlink?.signer
  ])

  return {
    parseBatchCsv,
    prepareBatchFromActions
  }
}
