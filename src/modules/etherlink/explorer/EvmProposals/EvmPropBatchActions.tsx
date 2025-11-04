import React, { useContext } from "react"
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  IconButton,
  CloseIcon,
  EditIcon,
  DeleteIcon,
  FileCopyOutlined
} from "components/ui"
import { FormField, FormTextField, FormSelect, MenuItem } from "components/ui"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { enabledBatchActionTypes } from "modules/etherlink/config"
import { ethers } from "ethers"
import { EtherlinkContext } from "services/wagmi/context"
import { toShortAddress } from "services/contracts/utils"

type BatchActionType =
  | "transfer_eth"
  | "transfer_erc20"
  | "transfer_erc721"
  | "registry_set"
  | "mint"
  | "burn"
  | "update_quorum"
  | "set_voting_delay"
  | "set_voting_period"
  | "set_proposal_threshold"
  | "contract_call"

export interface BatchAction {
  type: BatchActionType
  // Common
  asset?: string
  to?: string
  from?: string
  amount?: string
  tokenId?: string | number
  key?: string
  value?: string
  // Contract call
  target?: string
  func?: string // function signature
  params?: string // JSON array string
  rawCalldata?: string // 0x hex string
  ethValue?: string // decimal string
}

const header = [
  "type",
  "asset",
  "to",
  "from",
  "amount",
  "tokenId",
  "key",
  "value",
  "target",
  "function",
  "params",
  "rawCalldata",
  "ethValue"
].join(",")

const sample = [
  "transfer_eth,native,0x6E147e1D239bF49c88d64505e746e8522845D8D3,,1, , , , , , , ,",
  "transfer_erc20,0x0000000000000000000000000000000000000000,0x6E147e1D239bF49c88d64505e746e8522845D8D3,,150.5,,,,,,,",
  "transfer_erc721,0x0000000000000000000000000000000000000000,0x6E147e1D239bF49c88d64505e746e8522845D8D3,, ,42,,,,,,,",
  "registry_set,,,,,,site_url,https://example.com,,,,,",
  "mint,,0x6A9Cbf5d01B9760CA99c3C27db0B23e3b8Bd454b,,1000,,,,,,,",
  "burn,,,0x06E5b15Bc39f921e1503073dBb8A5dA2Fc6220E9,250,,,,,,,",
  "update_quorum,,,,,,,50,,,,,",
  "set_voting_delay,,,,,,,900,,,,,",
  "set_voting_period,,,,,,,604800,,,,,",
  "set_proposal_threshold,,,,,,,100000,,,,,",
  "contract_call,,,,,,,,0x1ffe81d6384198d412c7bda55653098726595175,,,0x368b87720000000,0"
].join("\n")

export const EvmPropBatchActions: React.FC = () => {
  const theme = useTheme()
  const {
    batchActions,
    batchErrors,
    batchWarnings,
    setBatchActions,
    setBatchErrors,
    setBatchWarnings,
    addBatchAction,
    updateBatchAction,
    removeBatchAction,
    parseBatchCsv
  } = useEvmProposalOps()
  const { daoTreasuryTokens, daoNfts } = useContext(EtherlinkContext)

  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const formSectionRef = React.useRef<HTMLDivElement | null>(null)

  const onChooseFile = () => fileInputRef.current?.click()

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || "")
      const { actions, errors, warnings } = parseBatchCsv(text)
      setBatchActions(actions)
      setBatchErrors(errors)
      setBatchWarnings(warnings || [])
    }
    reader.readAsText(f)
    // Reset input so the same file can be re-selected
    e.target.value = ""
  }

  const downloadActionsAsCsv = () => {
    const header = [
      "type",
      "asset",
      "to",
      "from",
      "amount",
      "tokenId",
      "key",
      "value",
      "target",
      "function",
      "params",
      "rawCalldata",
      "ethValue"
    ].join(",")

    const rows = batchActions.map((action: any) => {
      const isConfigAction = [
        "update_quorum",
        "set_voting_delay",
        "set_voting_period",
        "set_proposal_threshold"
      ].includes(action.type)
      return [
        action.type || "",
        action.asset || "",
        action.to || "",
        action.from || "",
        isConfigAction ? "" : action.amount || "",
        action.tokenId !== undefined ? action.tokenId : "",
        action.key || "",
        isConfigAction ? action.value || "" : action.value || "",
        action.target || "",
        action.func || "",
        action.params || "",
        action.rawCalldata || "",
        action.ethValue || ""
      ].join(",")
    })

    const csvContent = [header, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "homebase-batch-actions.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSample = () => {
    const blob = new Blob([header + "\n" + sample], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "homebase-batch-actions.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const isErc721 = (n: any) => {
    const t = String(n?.token?.type || n?.token_type || n?.token?.standard || "").toUpperCase()
    return t.includes("ERC721") || t.includes("ERC-721")
  }

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

  const getAssetDisplayLabel = (
    asset: string,
    tokenId: string | undefined,
    daoTreasuryTokens: any[],
    daoNfts: any[]
  ): string => {
    if (!asset || !ethers.isAddress(asset)) return asset || "Unknown"

    if (tokenId !== undefined && tokenId !== "") {
      const nft = daoNfts.find((n: any) => {
        const nAddr = resolveNftContractAddress(n)
        const nTid = String(n?.token_id ?? n?.id)
        return nAddr?.toLowerCase() === asset.toLowerCase() && nTid === tokenId
      })
      if (nft) {
        const sym = nft?.token?.symbol || "NFT"
        const short = asset ? toShortAddress(asset) : ""
        return short ? `${sym} #${tokenId} · ${short}` : `${sym} #${tokenId}`
      }
    }

    const token = daoTreasuryTokens.find((t: any) => String(t?.address || "").toLowerCase() === asset.toLowerCase())
    if (token) {
      const sym = token?.symbol || ""
      const short = asset ? toShortAddress(asset) : ""
      return sym && short ? `${sym} · ${short}` : sym || short || asset
    }

    return toShortAddress(asset) || asset
  }

  const isAssetInTreasury = (asset: string, tokenId: string | undefined): boolean => {
    if (!asset || !ethers.isAddress(asset)) return false

    if (tokenId !== undefined && tokenId !== "") {
      const nft = daoNfts?.find((n: any) => {
        const nAddr = resolveNftContractAddress(n)
        const nTid = String(n?.token_id ?? n?.id)
        return nAddr?.toLowerCase() === asset.toLowerCase() && nTid === tokenId
      })
      return !!nft
    }

    const token = daoTreasuryTokens?.find((t: any) => String(t?.address || "").toLowerCase() === asset.toLowerCase())
    return !!token
  }

  const ActionRow: React.FC<{ action: BatchAction; index: number }> = ({ action, index }) => {
    const summarize = () => {
      switch (action.type) {
        case "transfer_eth":
          return `Transfer ${action.amount} ETH to ${action.to ? toShortAddress(action.to) : action.to}`
        case "transfer_erc20": {
          const assetLabel = getAssetDisplayLabel(action.asset || "", undefined, daoTreasuryTokens || [], daoNfts || [])
          const inTreasury = action.asset ? isAssetInTreasury(action.asset, undefined) : false
          const warningBadge = !inTreasury && action.asset ? " ⚠️" : ""
          return `Transfer ${action.amount} of ${assetLabel}${warningBadge} to ${
            action.to ? toShortAddress(action.to) : action.to
          }`
        }
        case "transfer_erc721": {
          const assetLabel = getAssetDisplayLabel(
            action.asset || "",
            String(action.tokenId || ""),
            daoTreasuryTokens || [],
            daoNfts || []
          )
          const inTreasury = action.asset ? isAssetInTreasury(action.asset, String(action.tokenId || "")) : false
          const warningBadge = !inTreasury && action.asset ? " ⚠️" : ""
          return `Transfer ${assetLabel}${warningBadge} to ${action.to ? toShortAddress(action.to) : action.to}`
        }
        case "registry_set":
          return `Set registry ${action.key} = ${action.value}`
        case "mint":
          return `Mint ${action.amount} to ${action.to ? toShortAddress(action.to) : action.to}`
        case "burn":
          return `Burn ${action.amount} from ${action.from ? toShortAddress(action.from) : action.from}`
        case "update_quorum":
          return `Update quorum to ${action.value}%`
        case "set_voting_delay":
          return `Set voting delay to ${action.value} sec`
        case "set_voting_period":
          return `Set voting period to ${action.value} sec`
        case "set_proposal_threshold":
          return `Set proposal threshold to ${action.value}`
        case "contract_call":
          return `Contract call -> ${action.target ? toShortAddress(action.target) : action.target}`
        default:
          return `${action.type}`
      }
    }
    return (
      <Box
        key={index}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{ background: theme.palette.background.default, borderRadius: 4, padding: 12, marginBottom: 8 }}
      >
        <Typography color="textPrimary">
          {index + 1}. {summarize()}
        </Typography>
        <Box display="flex" style={{ gap: 4 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => startEditAction(index)}
            style={{ padding: 8, transition: "background 0.2s, transform 0.1s" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(129, 254, 183, 0.1)"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <EditIcon style={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => duplicateAction(index)}
            style={{ padding: 8, transition: "background 0.2s, transform 0.1s" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(129, 254, 183, 0.1)"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <FileCopyOutlined style={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={() => removeBatchAction(index)}
            style={{ padding: 8, transition: "background 0.2s, transform 0.1s" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <DeleteIcon style={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    )
  }

  // Minimal inline add action (kept simple)
  const [showAdd, setShowAdd] = React.useState(false)
  const [editIndex, setEditIndex] = React.useState<number | null>(null)
  const [draft, setDraft] = React.useState<BatchAction>({ type: "transfer_eth", amount: "", to: "" })

  const startEditAction = (index: number) => {
    const action = batchActions[index]
    setDraft({ ...action })
    setEditIndex(index)
    setShowAdd(true)
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 100)
  }

  const duplicateAction = (index: number) => {
    const action = batchActions[index]
    const duplicatedAction = { ...action }
    addBatchAction(duplicatedAction)
  }

  const addDraft = () => {
    // Validate required fields based on action type
    if (!validateDraftAction(draft)) return

    if (editIndex !== null) {
      updateBatchAction(editIndex, draft)
      setEditIndex(null)
    } else {
      addBatchAction(draft)
    }
    setDraft({ type: "transfer_eth", amount: "", to: "" })
    setShowAdd(false)
  }

  const cancelEdit = () => {
    setDraft({ type: "transfer_eth", amount: "", to: "" })
    setEditIndex(null)
    setShowAdd(false)
  }

  const validateDraftAction = (action: BatchAction): boolean => {
    const isValidAmount = (amount?: string) => {
      if (!amount) return false
      const num = parseFloat(amount)
      return !isNaN(num) && num > 0
    }

    const isValidValue = (value?: string) => {
      if (!value) return false
      const num = parseFloat(value)
      return !isNaN(num) && num > 0
    }

    switch (action.type) {
      case "transfer_eth":
        return !!action.to && ethers.isAddress(action.to) && isValidAmount(action.amount)
      case "transfer_erc20":
        return (
          !!action.asset &&
          ethers.isAddress(action.asset) &&
          !!action.to &&
          ethers.isAddress(action.to) &&
          isValidAmount(action.amount)
        )
      case "transfer_erc721":
        return (
          !!action.asset &&
          ethers.isAddress(action.asset) &&
          !!action.to &&
          ethers.isAddress(action.to) &&
          action.tokenId !== undefined &&
          action.tokenId !== ""
        )
      case "registry_set":
        return !!action.key && !!action.value
      case "mint":
        return !!action.to && ethers.isAddress(action.to) && isValidAmount(action.amount)
      case "burn":
        return !!action.from && ethers.isAddress(action.from) && isValidAmount(action.amount)
      case "update_quorum":
      case "set_voting_delay":
      case "set_voting_period":
      case "set_proposal_threshold":
        return isValidValue(action.value)
      case "contract_call":
        return !!action.target && ethers.isAddress(action.target) && !!action.rawCalldata
      default:
        return false
    }
  }

  const isAddButtonDisabled = () => {
    return !validateDraftAction(draft)
  }

  return (
    <Grid container direction="column" style={{ gap: 16 }}>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={onFile} style={{ display: "none" }} />

      <Typography color="textPrimary" variant="h6">
        CSV File Format Instructions
      </Typography>
      <Typography color="textSecondary">
        Your CSV file must have a header row with the following columns in this exact order:
      </Typography>
      <Box style={{ background: theme.palette.background.default, padding: 12, borderRadius: 4 }}>
        <Typography style={{ fontFamily: "monospace", fontSize: 12 }}>{header}</Typography>
      </Box>

      <Box display="flex" style={{ gap: 8 }}>
        <Button variant="contained" color="primary" onClick={onChooseFile}>
          Upload CSV
        </Button>
        <Button variant="outlined" onClick={downloadSample}>
          Download Sample CSV
        </Button>
      </Box>

      {batchErrors.length > 0 && (
        <Box style={{ background: "#4a2b2b", padding: 12, borderRadius: 4, position: "relative" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
            <Typography color="textPrimary">CSV Errors</Typography>
            <IconButton size="small" onClick={() => setBatchErrors([])} style={{ padding: 4 }}>
              <CloseIcon style={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          {batchErrors.map((e: string, i: number) => (
            <Typography key={i} color="textSecondary">
              {e}
            </Typography>
          ))}
        </Box>
      )}

      {batchWarnings && batchWarnings.length > 0 && (
        <Box style={{ background: "#4a3a2b", padding: 12, borderRadius: 4, position: "relative" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
            <Typography color="textPrimary">CSV Warnings (non-blocking)</Typography>
            <IconButton size="small" onClick={() => setBatchWarnings([])} style={{ padding: 4 }}>
              <CloseIcon style={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          {batchWarnings.map((w: string, i: number) => (
            <Typography key={i} color="textSecondary">
              ⚠️ {w}
            </Typography>
          ))}
        </Box>
      )}

      <Typography color="textPrimary" variant="h6">
        Review Actions ({batchActions.length})
      </Typography>
      <Box>
        {batchActions.map((a: any, i: number) => (
          <ActionRow key={`${i}`} action={a as any} index={i} />
        ))}
      </Box>

      <Box display="flex" style={{ gap: 8 }}>
        <Button variant="text" onClick={() => (editIndex !== null ? cancelEdit() : setShowAdd(s => !s))}>
          {showAdd ? "Cancel" : "Add Action"}
        </Button>
        {batchActions.length > 0 && (
          <Button variant="text" onClick={downloadActionsAsCsv}>
            Download CSV
          </Button>
        )}
      </Box>
      <Box>
        {showAdd && (
          <div ref={formSectionRef}>
            <Box style={{ border: `1px solid ${theme.palette.divider}`, padding: 12, borderRadius: 4, marginTop: 8 }}>
              <Grid container style={{ gap: 8 }}>
                <FormField label="Type">
                  <FormSelect
                    value={draft.type}
                    onChange={e => setDraft(prev => ({ ...prev, type: e.target.value as BatchActionType }))}
                    native
                  >
                    {enabledBatchActionTypes.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </FormSelect>
                </FormField>

                {draft.type.startsWith("transfer_") && (
                  <>
                    {draft.type === "transfer_erc20" && (
                      <FormField label="Asset">
                        <FormSelect
                          value={
                            draft.asset && isAssetInTreasury(draft.asset, undefined)
                              ? draft.asset
                              : draft.asset
                              ? "__custom__"
                              : ""
                          }
                          onChange={e => {
                            const val = e.target.value
                            if (val === "__custom__") {
                              setDraft(p => ({ ...p, asset: "__custom__" }))
                            } else if (val !== "") {
                              setDraft(p => ({ ...p, asset: val }))
                            } else {
                              setDraft(p => ({ ...p, asset: "" }))
                            }
                          }}
                          inputProps={{ style: { fontSize: 14 } }}
                          SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected: any) => {
                              const val = String(selected || "")
                              if (val === "__custom__" || val === "") return "Select asset or enter custom address"
                              const token = (daoTreasuryTokens || []).find(
                                (t: any) => String(t?.address || "").toLowerCase() === val.toLowerCase()
                              )
                              if (token) {
                                const sym = token?.symbol || ""
                                const short = val ? toShortAddress(val) : ""
                                return sym && short ? `${sym} · ${short}` : sym || short || val
                              }
                              return toShortAddress(val) || val
                            }
                          }}
                        >
                          <MenuItem value="">Select asset</MenuItem>
                          {(daoTreasuryTokens || [])
                            .filter((token: any) => {
                              const ty = String(token?.type || "").toUpperCase()
                              const isFungible = !ty || ty.includes("ERC20") || ty.includes("ERC-20")
                              const hasValidAddress =
                                typeof token?.address === "string" && ethers.isAddress(token.address)
                              return isFungible && hasValidAddress
                            })
                            .map((token: any) => (
                              <MenuItem key={token.address} value={token.address}>
                                {token.symbol}
                              </MenuItem>
                            ))}
                          <MenuItem value="__custom__">Custom Address</MenuItem>
                        </FormSelect>
                      </FormField>
                    )}
                    {draft.type === "transfer_erc20" &&
                      (draft.asset === "__custom__" || (draft.asset && !isAssetInTreasury(draft.asset, undefined))) && (
                        <FormField label="Custom Asset Address">
                          <FormTextField
                            value={draft.asset === "__custom__" ? "" : draft.asset || ""}
                            placeholder="0x..."
                            onChange={e => setDraft(p => ({ ...p, asset: e.target.value }))}
                            inputProps={{ style: { fontSize: 14 } }}
                          />
                          {draft.asset && !isAssetInTreasury(draft.asset, undefined) && (
                            <Typography color="textSecondary" style={{ fontSize: 12, marginTop: 6 }}>
                              ⚠️ Asset not in treasury - ensure DAO has approval or balance
                            </Typography>
                          )}
                        </FormField>
                      )}
                    {draft.type === "transfer_erc721" && (
                      <FormField label="NFT">
                        <FormSelect
                          value={
                            draft.asset && draft.tokenId && isAssetInTreasury(draft.asset, String(draft.tokenId))
                              ? `nft::${draft.asset}:${draft.tokenId}`
                              : draft.asset && draft.tokenId
                              ? "__custom__"
                              : draft.asset || ""
                          }
                          onChange={e => {
                            const val = e.target.value
                            if (val === "__custom__") {
                              setDraft(p => ({ ...p, asset: "__custom__", tokenId: "" }))
                            } else if (val.startsWith("nft::")) {
                              const parts = val.split("::")[1]?.split(":") || []
                              const addr = parts[0]
                              const tid = parts[1]
                              setDraft(p => ({ ...p, asset: addr, tokenId: tid }))
                            } else if (val !== "") {
                              setDraft(p => ({ ...p, asset: val, tokenId: "" }))
                            } else {
                              setDraft(p => ({ ...p, asset: "", tokenId: "" }))
                            }
                          }}
                          inputProps={{ style: { fontSize: 14 } }}
                          SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected: any) => {
                              const val = String(selected || "")
                              if (val === "__custom__" || val === "") return "Select NFT or enter custom address"
                              if (val.startsWith("nft::")) {
                                const parts = val.split("::")[1]?.split(":") || []
                                const addr = parts[0]
                                const tid = parts[1]
                                const nft = (daoNfts || []).find((n: any) => {
                                  const nAddr = resolveNftContractAddress(n)
                                  const nTid = String(n?.token_id ?? n?.id)
                                  return nAddr?.toLowerCase() === addr?.toLowerCase() && nTid === tid
                                })
                                const sym = nft?.token?.symbol || "NFT"
                                const short = addr ? toShortAddress(addr) : ""
                                return short ? `${sym} #${tid} · ${short}` : `${sym} #${tid}`
                              }
                              return toShortAddress(val) || val
                            }
                          }}
                        >
                          <MenuItem value="">Select NFT</MenuItem>
                          {(daoNfts || [])
                            .filter((n: any) => isErc721(n))
                            .map((n: any) => {
                              const addr = resolveNftContractAddress(n)
                              const tid = String(n?.token_id ?? n?.id)
                              const value = `nft::${addr}:${tid}`
                              return (
                                <MenuItem key={value} value={value} disabled={!addr}>
                                  {n.token?.symbol} #{tid}
                                  {!addr && (
                                    <Typography color="textSecondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                      (contract unknown)
                                    </Typography>
                                  )}
                                </MenuItem>
                              )
                            })}
                          <MenuItem value="__custom__">Custom Address</MenuItem>
                        </FormSelect>
                      </FormField>
                    )}
                    {draft.type === "transfer_erc721" &&
                      (draft.asset === "__custom__" ||
                        (draft.asset && !isAssetInTreasury(draft.asset, String(draft.tokenId || "")))) && (
                        <>
                          <FormField label="Custom NFT Contract Address">
                            <FormTextField
                              value={draft.asset === "__custom__" ? "" : draft.asset || ""}
                              placeholder="0x..."
                              onChange={e => setDraft(p => ({ ...p, asset: e.target.value }))}
                              inputProps={{ style: { fontSize: 14 } }}
                            />
                            {draft.asset && !isAssetInTreasury(draft.asset, String(draft.tokenId || "")) && (
                              <Typography color="textSecondary" style={{ fontSize: 12, marginTop: 6 }}>
                                ⚠️ NFT not in treasury - ensure DAO owns this token
                              </Typography>
                            )}
                          </FormField>
                          <FormField label="Token ID">
                            <FormTextField
                              value={draft.tokenId || ""}
                              onChange={e => setDraft(p => ({ ...p, tokenId: e.target.value }))}
                              inputProps={{ style: { fontSize: 14 } }}
                            />
                          </FormField>
                        </>
                      )}
                    {draft.type === "transfer_erc721" &&
                      draft.asset &&
                      draft.asset !== "__custom__" &&
                      (daoNfts || []).find((n: any) => {
                        const nAddr = resolveNftContractAddress(n)
                        const nTid = String(n?.token_id ?? n?.id)
                        return (
                          nAddr?.toLowerCase() === draft.asset?.toLowerCase() && nTid === String(draft.tokenId || "")
                        )
                      }) && (
                        <FormField label="Token ID">
                          <Typography color="textSecondary" style={{ fontSize: 14, paddingTop: 12, paddingBottom: 12 }}>
                            Token ID: {draft.tokenId} (from selected NFT)
                          </Typography>
                        </FormField>
                      )}
                    {draft.type !== "transfer_erc721" && (
                      <FormField label="Amount">
                        <FormTextField
                          type="number"
                          value={draft.amount || ""}
                          onChange={e => setDraft(p => ({ ...p, amount: e.target.value }))}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            min: "0.001",
                            step: "0.000001",
                            style: { fontSize: 14 }
                          }}
                        />
                      </FormField>
                    )}
                    <FormField label="To">
                      <FormTextField
                        value={draft.to || ""}
                        placeholder="0x..."
                        onChange={e => setDraft(p => ({ ...p, to: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                    </FormField>
                  </>
                )}

                {draft.type === "registry_set" && (
                  <>
                    <FormField label="Key">
                      <FormTextField
                        value={draft.key || ""}
                        onChange={e => setDraft(p => ({ ...p, key: e.target.value }))}
                      />
                    </FormField>
                    <FormField label="Value">
                      <FormTextField
                        value={draft.value || ""}
                        onChange={e => setDraft(p => ({ ...p, value: e.target.value }))}
                      />
                    </FormField>
                  </>
                )}

                {(draft.type === "mint" || draft.type === "burn") && (
                  <>
                    <FormField label={draft.type === "mint" ? "To" : "From"}>
                      <FormTextField
                        value={draft.type === "mint" ? draft.to || "" : draft.from || ""}
                        onChange={e =>
                          setDraft(p => ({ ...p, [draft.type === "mint" ? "to" : "from"]: e.target.value }))
                        }
                      />
                    </FormField>
                    <FormField label="Amount">
                      <FormTextField
                        value={draft.amount || ""}
                        onChange={e => setDraft(p => ({ ...p, amount: e.target.value }))}
                      />
                    </FormField>
                  </>
                )}

                {(draft.type === "update_quorum" ||
                  draft.type === "set_voting_delay" ||
                  draft.type === "set_voting_period" ||
                  draft.type === "set_proposal_threshold") && (
                  <FormField label="Value">
                    <FormTextField
                      value={draft.value || ""}
                      onChange={e => setDraft(p => ({ ...p, value: e.target.value }))}
                    />
                  </FormField>
                )}

                {draft.type === "contract_call" && (
                  <>
                    <FormField label="Target Contract Address">
                      <FormTextField
                        value={draft.target || ""}
                        onChange={e => setDraft(p => ({ ...p, target: e.target.value }))}
                      />
                    </FormField>
                    <FormField label="Raw Calldata (0x)">
                      <FormTextField
                        value={draft.rawCalldata || ""}
                        onChange={e => setDraft(p => ({ ...p, rawCalldata: e.target.value }))}
                      />
                    </FormField>
                    <FormField label="XTZ Value">
                      <FormTextField
                        value={draft.ethValue || "0"}
                        onChange={e => setDraft(p => ({ ...p, ethValue: e.target.value }))}
                      />
                    </FormField>
                  </>
                )}

                <Box display="flex" justifyContent="flex-end" style={{ gap: 8 }}>
                  <Button variant="outlined" onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={addDraft} disabled={isAddButtonDisabled()}>
                    {editIndex !== null ? "Update" : "Add"}
                  </Button>
                </Box>
              </Grid>
            </Box>
          </div>
        )}
      </Box>

      {/* Navigation is handled by the outer dialog (EvmProposalsActionDialog) */}
    </Grid>
  )
}
