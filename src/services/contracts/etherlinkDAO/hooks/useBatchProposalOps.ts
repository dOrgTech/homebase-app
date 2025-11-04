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
          from: col(r, "from"),
          amount: col(r, "amount"),
          tokenId: col(r, "tokenId"),
          key: col(r, "key"),
          value: col(r, "value"),
          target: col(r, "target"),
          function: col(r, "function"),
          params: col(r, "params"),
          rawCalldata: col(r, "rawCalldata"),
          ethValue: col(r, "ethValue")
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
          const from = asStr(row.from).trim()
          const amount = asStr(row.amount).trim()
          const tokenId = asStr(row.tokenId).trim()
          const key = asStr(row.key).trim()
          const value = asStr(row.value).trim()
          const target = asStr(row.target).trim()
          const func = asStr(row.function).trim()
          const params = asStr(row.params).trim()
          const rawCalldata = asStr(row.rawCalldata).trim()
          const ethValue = asStr(row.ethValue).trim()

          const pushError = (m: string) => errors.push(`Row ${rowNum}: ${m}`)
          const pushWarning = (m: string) => warnings.push(`Row ${rowNum}: ${m}`)

          if (type && !enabledBatchActionTypes.includes(type as any)) {
            return pushError(`action type '${type}' is not enabled`)
          }

          switch (type) {
            case "transfer_eth":
              if (!to || !ethers.isAddress(to)) return pushError("transfer_eth requires valid 'to' address")
              if (!amount) return pushError("transfer_eth requires 'amount'")
              actions.push({ type, to, amount })
              break
            case "transfer_erc20":
              if (!asset || !ethers.isAddress(asset)) return pushError("transfer_erc20 requires valid 'asset' address")
              if (!to || !ethers.isAddress(to)) return pushError("transfer_erc20 requires valid 'to' address")
              if (!amount) return pushError("transfer_erc20 requires 'amount'")
              if (daoTreasuryTokens && daoTreasuryTokens.length > 0) {
                const found = daoTreasuryTokens.find(
                  (t: any) => String(t?.address || "").toLowerCase() === asset.toLowerCase()
                )
                if (!found) {
                  pushWarning("Asset not in treasury - ensure DAO has approval or balance")
                }
              }
              actions.push({ type, asset, to, amount })
              break
            case "transfer_erc721":
              if (!asset || !ethers.isAddress(asset)) return pushError("transfer_erc721 requires valid 'asset' address")
              if (!to || !ethers.isAddress(to)) return pushError("transfer_erc721 requires valid 'to' address")
              if (tokenId === "") return pushError("transfer_erc721 requires 'tokenId'")
              if (daoNfts && daoNfts.length > 0) {
                const resolveNftContractAddress = (nft: any): string | undefined => {
                  return (
                    nft?.token?.address ||
                    nft?.token?.contract_address ||
                    nft?.token?.address_hash ||
                    nft?.contract?.address ||
                    nft?.contract_address ||
                    nft?.token_address ||
                    nft?.collection?.address ||
                    undefined
                  )
                }
                const found = daoNfts.find((n: any) => {
                  const nAddr = resolveNftContractAddress(n)
                  const nTid = String(n?.token_id ?? n?.id)
                  return nAddr?.toLowerCase() === asset.toLowerCase() && nTid === tokenId
                })
                if (!found) {
                  pushWarning("NFT not in treasury - ensure DAO owns this token")
                }
              }
              actions.push({ type, asset, to, tokenId })
              break
            case "registry_set":
              if (!key || !value) return pushError("registry_set requires 'key' and 'value'")
              actions.push({ type, key, value })
              break
            case "mint":
              if (!to || !ethers.isAddress(to)) return pushError("mint requires valid 'to' address")
              if (!amount) return pushError("mint requires 'amount'")
              actions.push({ type, to, amount })
              break
            case "burn":
              if (!from || !ethers.isAddress(from)) return pushError("burn requires valid 'from' address")
              if (!amount) return pushError("burn requires 'amount'")
              actions.push({ type, from, amount })
              break
            case "update_quorum":
              if (!value) return pushError("update_quorum requires 'value' (percent)")
              actions.push({ type, value })
              break
            case "set_voting_delay":
              if (!value) return pushError("set_voting_delay requires 'value' (seconds)")
              actions.push({ type, value })
              break
            case "set_voting_period":
              if (!value) return pushError("set_voting_period requires 'value' (seconds)")
              actions.push({ type, value })
              break
            case "set_proposal_threshold":
              if (!value) return pushError("set_proposal_threshold requires 'value'")
              actions.push({ type, value })
              break
            case "contract_call":
              if (!target || !ethers.isAddress(target))
                return pushError("contract_call requires valid 'target' address")
              if (rawCalldata) {
                if (!rawCalldata.startsWith("0x")) return pushError("rawCalldata must be 0x-hex")
                actions.push({ type, target, rawCalldata, ethValue })
              } else if (func) {
                actions.push({ type, target, func, params, ethValue })
              } else {
                return pushError("contract_call requires either 'function' or 'rawCalldata'")
              }
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
        case "transfer_erc721": {
          const iface = ifaceOf("transferERC721")
          const tokenId = BigInt(String(a.tokenId))
          const data = iface.encodeFunctionData("transferERC721", [a.asset, a.to, tokenId])
          targets.push(reg)
          values.push(0)
          calldatas.push(data)
          kinds.push("transfer")
          break
        }
        case "registry_set": {
          const iface = ifaceOf("editRegistry")
          const data = iface.encodeFunctionData("editRegistry", [a.key, a.value])
          targets.push(reg)
          values.push(0)
          calldatas.push(data)
          kinds.push("registry")
          break
        }
        case "mint": {
          const iface = new ethers.Interface(["function mint(address to, uint256 amount)"])
          const dec = Number(daoSelected?.decimals || 18)
          const data = iface.encodeFunctionData("mint", [a.to, ethers.parseUnits(String(a.amount || "0"), dec)])
          targets.push(gov)
          values.push(0)
          calldatas.push(data)
          kinds.push("mint")
          break
        }
        case "burn": {
          const iface = new ethers.Interface(["function burn(address from, uint256 amount)"])
          const dec = Number(daoSelected?.decimals || 18)
          const data = iface.encodeFunctionData("burn", [a.from, ethers.parseUnits(String(a.amount || "0"), dec)])
          targets.push(gov)
          values.push(0)
          calldatas.push(data)
          kinds.push("burn")
          break
        }
        case "update_quorum": {
          const iface = ifaceOf("updateQuorumNumerator")
          const data = iface.encodeFunctionData("updateQuorumNumerator", [String(a.value)])
          targets.push(daoAddr)
          values.push(0)
          calldatas.push(data)
          kinds.push("quorum")
          break
        }
        case "set_voting_delay": {
          const iface = ifaceOf("setVotingDelay")
          const seconds = BigInt(Number(a.value || 0))
          const data = iface.encodeFunctionData("setVotingDelay", [seconds.toString()])
          targets.push(daoAddr)
          values.push(0)
          calldatas.push(data)
          kinds.push("voting_delay")
          break
        }
        case "set_voting_period": {
          const iface = ifaceOf("setVotingPeriod")
          const seconds = BigInt(Number(a.value || 0))
          const data = iface.encodeFunctionData("setVotingPeriod", [seconds.toString()])
          targets.push(daoAddr)
          values.push(0)
          calldatas.push(data)
          kinds.push("voting_period")
          break
        }
        case "set_proposal_threshold": {
          const iface = ifaceOf("setProposalThreshold")
          const dec = Number(daoSelected?.decimals || 18)
          const amt = ethers.parseUnits(String(a.value || "0"), dec)
          const data = iface.encodeFunctionData("setProposalThreshold", [amt])
          targets.push(daoAddr)
          values.push(0)
          calldatas.push(data)
          kinds.push("threshold")
          break
        }
        case "contract_call": {
          const value = (() => {
            try {
              const v = String(a.ethValue || "").trim()
              return v ? ethers.parseEther(v) : 0n
            } catch (_) {
              return 0n
            }
          })()
          if (a.rawCalldata) {
            targets.push(a.target)
            values.push(value)
            calldatas.push(a.rawCalldata)
            kinds.push("contract_call")
          } else {
            const iface = new ethers.Interface([`function ${String(a.func)}`])
            let parsed: any[] = []
            try {
              parsed = a.params ? JSON.parse(String(a.params)) : []
              if (!Array.isArray(parsed)) parsed = [parsed]
            } catch (_) {
              throw new Error("Invalid JSON in params for contract_call")
            }
            const data = iface.encodeFunctionData(String(a.func), parsed)
            targets.push(a.target)
            values.push(value)
            calldatas.push(data)
            kinds.push("contract_call")
          }
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
