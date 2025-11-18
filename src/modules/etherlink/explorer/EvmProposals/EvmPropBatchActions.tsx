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
  FileCopyOutlined,
  ExpandMoreIcon,
  ExpandLessIcon
} from "components/ui"
import { FormField, FormTextField, FormSelect, MenuItem } from "components/ui"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { enabledBatchActionTypes } from "modules/etherlink/config"
import { ethers } from "ethers"
import { EtherlinkContext } from "services/wagmi/context"
import { toShortAddress } from "services/contracts/utils"

type BatchActionType = "transfer_eth" | "transfer_erc20" | "mint" | "burn"

export interface BatchAction {
  type: BatchActionType
  asset?: string
  to?: string
  amount?: string
  from?: string
}

const header = ["type", "asset", "to", "amount"].join(",")

const sample = [
  "transfer,native,0x6E147e1D239bF49c88d64505e746e8522845D8D3,1",
  "transfer,0x615959354b436D37A71363542f1b72636B5c8542,0x6E147e1D239bF49c88d64505e746e8522845D8D3,150.5",
  "mint,,0x6A9Cbf5d01B9760CA99c3C27db0B23e3b8Bd454b,1000",
  "burn,,0x06E5b15Bc39f921e1503073dBb8A5dA2Fc6220E9,250"
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
  const [csvSectionExpanded, setCsvSectionExpanded] = React.useState(false)

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
    const header = ["type", "asset", "to", "amount"].join(",")

    const rows = batchActions.map((action: any) => {
      let csvType = ""
      let csvAsset = action.asset || ""
      let csvTo = action.to || ""

      if (action.type === "transfer_eth") {
        csvType = "transfer"
        csvAsset = "native"
      } else if (action.type === "transfer_erc20") {
        csvType = "transfer"
      } else if (action.type === "mint" || action.type === "burn") {
        csvType = action.type
        if (action.type === "burn") {
          csvTo = action.from || action.to || ""
        }
      } else {
        csvType = action.type
      }

      return [csvType, csvAsset, csvTo, action.amount || ""].join(",")
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
          return `Transfer ${action.amount} XTZ to ${action.to ? toShortAddress(action.to) : action.to}`
        case "transfer_erc20": {
          const assetLabel = getAssetDisplayLabel(action.asset || "", undefined, daoTreasuryTokens || [], daoNfts || [])
          const inTreasury = action.asset ? isAssetInTreasury(action.asset, undefined) : false
          const warningBadge = !inTreasury && action.asset ? " ⚠️" : ""
          return `Transfer ${action.amount} of ${assetLabel}${warningBadge} to ${
            action.to ? toShortAddress(action.to) : action.to
          }`
        }
        case "mint": {
          const assetInfo =
            action.asset && ethers.isAddress(action.asset) ? ` (${toShortAddress(action.asset)})` : " (DAO token)"
          return `Mint ${action.amount}${assetInfo} to ${action.to ? toShortAddress(action.to) : action.to}`
        }
        case "burn": {
          const assetInfo =
            action.asset && ethers.isAddress(action.asset) ? ` (${toShortAddress(action.asset)})` : " (DAO token)"
          const fromAddr = action.from || action.to
          return `Burn ${action.amount}${assetInfo} from ${fromAddr ? toShortAddress(fromAddr) : fromAddr}`
        }
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

  const [showAdd, setShowAdd] = React.useState(false)
  const [editIndex, setEditIndex] = React.useState<number | null>(null)
  const [draft, setDraft] = React.useState<BatchAction>({ type: "transfer_eth", amount: "", to: "" })

  // TODO: Do this for "Advanced Import from CSV Expand"
  React.useEffect(() => {
    if (showAdd && formSectionRef.current) {
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [showAdd])

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

    switch (action.type) {
      case "transfer_eth":
        return !!action.to && ethers.isAddress(action.to) && isValidAmount(action.amount)
      case "transfer_erc20":
        if (!action.to || !ethers.isAddress(action.to)) return false
        if (!isValidAmount(action.amount)) return false
        if (!action.asset || !ethers.isAddress(action.asset)) return false
        return true
      case "mint":
        if (!action.to || !ethers.isAddress(action.to)) return false
        if (!isValidAmount(action.amount)) return false
        if (action.asset && !ethers.isAddress(action.asset)) return false
        return true
      case "burn":
        const burnAddr = action.from || action.to
        if (!burnAddr || !ethers.isAddress(burnAddr)) return false
        if (!isValidAmount(action.amount)) return false
        if (action.asset && !ethers.isAddress(action.asset)) return false
        return true
      default:
        return false
    }
  }

  const isAddButtonDisabled = () => {
    return !validateDraftAction(draft)
  }

  return (
    <Grid container direction="column" style={{ gap: 16, marginBottom: 0 }}>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={onFile} style={{ display: "none" }} />

      <Typography color="textPrimary" variant="h6">
        Batch Actions ({batchActions.length})
      </Typography>
      <Typography color="textSecondary">Add multiple actions to execute together in a single proposal</Typography>

      <Box>
        {batchActions.map((a: any, i: number) => (
          <ActionRow key={`${i}`} action={a as any} index={i} />
        ))}
        {batchActions.length === 0 && (
          <Box
            style={{ background: theme.palette.background.default, padding: 24, borderRadius: 4, textAlign: "center" }}
          >
            <Typography color="textSecondary">No actions added yet</Typography>
          </Box>
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
                    <option value="transfer_eth">Transfer XTZ</option>
                    <option value="transfer_erc20">Transfer ERC20</option>
                    <option value="mint">Mint</option>
                    <option value="burn">Burn</option>
                  </FormSelect>
                </FormField>

                {draft.type === "transfer_eth" && (
                  <>
                    <FormField label="To">
                      <FormTextField
                        value={draft.to || ""}
                        placeholder="0x..."
                        onChange={e => setDraft(p => ({ ...p, to: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                    </FormField>
                    <FormField label="Amount (XTZ)">
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
                  </>
                )}

                {draft.type === "transfer_erc20" && (
                  <>
                    <FormField label="Token Address">
                      <FormTextField
                        value={draft.asset || ""}
                        placeholder="0x..."
                        onChange={e => setDraft(p => ({ ...p, asset: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                    </FormField>
                    <FormField label="To">
                      <FormTextField
                        value={draft.to || ""}
                        placeholder="0x..."
                        onChange={e => setDraft(p => ({ ...p, to: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                    </FormField>
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
                  </>
                )}

                {draft.type === "mint" && (
                  <>
                    <FormField label="Token Address (optional)">
                      <FormTextField
                        value={draft.asset || ""}
                        placeholder="Leave empty for DAO token, or enter token address"
                        onChange={e => setDraft(p => ({ ...p, asset: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                      <Typography color="textSecondary" style={{ fontSize: 12, marginTop: 6 }}>
                        Leave empty to use DAO governance token
                      </Typography>
                    </FormField>
                    <FormField label="To">
                      <FormTextField
                        value={draft.to || ""}
                        placeholder="0x..."
                        onChange={e => setDraft(p => ({ ...p, to: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                    </FormField>
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
                  </>
                )}

                {draft.type === "burn" && (
                  <>
                    <FormField label="Token Address (optional)">
                      <FormTextField
                        value={draft.asset || ""}
                        placeholder="Leave empty for DAO token, or enter token address"
                        onChange={e => setDraft(p => ({ ...p, asset: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                      <Typography color="textSecondary" style={{ fontSize: 12, marginTop: 6 }}>
                        Leave empty to use DAO governance token
                      </Typography>
                    </FormField>
                    <FormField label="Address to burn from">
                      <FormTextField
                        value={draft.from || ""}
                        placeholder="0x..."
                        onChange={e => setDraft(p => ({ ...p, from: e.target.value }))}
                        inputProps={{ style: { fontSize: 14 } }}
                      />
                    </FormField>
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

      {!showAdd && (
        <Box display="flex" style={{ gap: 8, flexWrap: "wrap" }}>
          <Button variant="contained" color="primary" onClick={() => setShowAdd(true)}>
            + Add Action
          </Button>
          {batchActions.length > 0 && (
            <Button variant="outlined" onClick={downloadActionsAsCsv}>
              Download CSV
            </Button>
          )}
        </Box>
      )}

      <Box
        style={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 4,
          marginTop: 8
        }}
      >
        <Box
          onClick={() => setCsvSectionExpanded(prev => !prev)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            cursor: "pointer",
            background: theme.palette.background.default,
            borderRadius: csvSectionExpanded ? "4px 4px 0 0" : 4
          }}
        >
          <Box>
            <Typography color="textPrimary" style={{ fontWeight: 500 }}>
              Advanced: Import from CSV
            </Typography>
            <Typography color="textSecondary" style={{ fontSize: 12, marginTop: 4 }}>
              Upload a CSV file to batch import multiple actions
            </Typography>
          </Box>
          <IconButton size="small" style={{ padding: 8 }}>
            {csvSectionExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {csvSectionExpanded && (
          <Box style={{ padding: 16, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Grid container direction="column" style={{ gap: 16 }}>
              <Typography color="textSecondary">
                Your CSV file must have a header row with the following columns in this exact order:
              </Typography>
              <Box style={{ background: theme.palette.background.paper, padding: 12, borderRadius: 4 }}>
                <Typography style={{ fontFamily: "monospace", fontSize: 12 }}>{header}</Typography>
              </Box>

              <Box display="flex" style={{ gap: 8 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onChooseFile}
                  style={{
                    backgroundColor: "#575757",
                    color: "#fff"
                  }}
                >
                  Upload CSV
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={downloadSample}
                  style={{
                    backgroundColor: "#575757",
                    color: "#fff"
                  }}
                >
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
            </Grid>
          </Box>
        )}
      </Box>
    </Grid>
  )
}
