import React, { useCallback, useContext } from "react"
import { Grid, styled, MenuItem, IconButton, FormField, FormTextField, FormSelect, Typography } from "components/ui"
import { RemoveCircleOutline } from "@material-ui/icons"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { EtherlinkContext } from "services/wagmi/context"
import { dbg } from "utils/debug"
import { ethers } from "ethers"
import { toShortAddress } from "services/contracts/utils"

const TransactionContainer = styled(Grid)({
  marginBottom: "20px"
})

// const AddButton = styled(Grid)({
//   background: "#1c2024",
//   padding: "12px",
//   borderRadius: "4px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   marginTop: "16px"
// })

// Remove dark container in favor of per-field FormField wrappers

const RemoveButton = styled(IconButton)({
  color: "#FF4D4D",
  padding: "4px"
})

interface ITransaction {
  assetType: string
  assetAddress?: string
  assetSymbol?: string
  assetDecimals?: number
  tokenId?: string
  recipient: string
  amount?: string
}

export const EvmPropTransferAssets: React.FC = () => {
  const { transferAssets, setTransferAssets } = useEvmProposalOps()
  const { daoSelected, daoTreasuryTokens, daoNfts } = useContext(EtherlinkContext)

  console.log({ transferAssets })

  const onUpdateTransaction = useCallback(
    (index: number, obj: { field: keyof ITransaction; value: string }[]) => {
      const transactions = [...transferAssets.transactions]
      dbg("EL-XFER:onUpdateTransaction:before", JSON.stringify({ index, patch: obj, tx: transactions[index] || {} }))
      obj.forEach((o: { field: keyof ITransaction; value: string }) => {
        transactions[index][o.field] = o.value
      })
      setTransferAssets(transactions, daoSelected?.registryAddress)
      dbg("EL-XFER:onUpdateTransaction:after", JSON.stringify({ index, tx: transactions[index] }))
    },
    [transferAssets.transactions, daoSelected?.registryAddress, setTransferAssets]
  )

  // const onAddTransaction = () => {
  //   const transactions = [...transferAssets.transactions]
  //   transactions.push({ assetType: "transferETH", assetSymbol: "XTZ", recipient: "", amount: "" })
  //   setTransferAssets(transactions, daoSelected?.registryAddress)
  // }

  const onRemoveTransaction = (index: number) => {
    const transactions = [...transferAssets.transactions]
    transactions.splice(index, 1)
    setTransferAssets(transactions, daoSelected?.registryAddress)
  }

  const getAssetType = useCallback((transaction: ITransaction) => {
    if (transaction.assetType === "transferETH") {
      return "transferETH"
    } else if (transaction.assetType === "transferERC20") {
      return String(transaction.assetAddress || "")
    } else if (transaction.assetType === "transferERC721") {
      return `nft::${transaction.assetAddress}:${transaction.tokenId}`
    }
    return ""
  }, [])

  // Helper: detect ERC-721 from Blockscout token metadata
  const isErc721 = (n: any) => {
    const t = String(n?.token?.type || n?.token_type || n?.token?.standard || "").toUpperCase()
    return t.includes("ERC721") || t.includes("ERC-721")
  }

  // Best-effort resolver for NFT contract address across Blockscout shapes
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

  const handleAssetTypeChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      dbg("EL-XFER:assetChange", JSON.stringify({ index, value: newValue }))
      if (newValue === "transferETH") {
        onUpdateTransaction(index, [
          {
            field: "assetType",
            value: "transferETH"
          },
          {
            field: "assetSymbol",
            value: "XTZ"
          },
          {
            field: "assetAddress",
            value: daoSelected?.registryAddress
          }
        ])
      } else {
        const token = daoTreasuryTokens?.find((token: any) => token.address === newValue)
        const nft = daoNfts?.find((n: any) => {
          const addr = resolveNftContractAddress(n)
          const tid = String(n?.token_id ?? n?.id)
          const match = `nft::${addr}:${tid}` === newValue
          return match && isErc721(n)
        })
        if (token) {
          if (!token?.address || !ethers.isAddress(token.address)) {
            dbg("EL-XFER:selectToken:invalidAddress", JSON.stringify({ index, address: token?.address }))
            alert("Selected token has an unknown or invalid contract address")
            return
          }
          dbg("EL-XFER:selectToken", JSON.stringify({ index, address: token.address, symbol: token.symbol }))
          onUpdateTransaction(index, [
            {
              field: "assetType",
              value: "transferERC20"
            },
            {
              field: "assetSymbol",
              value: token?.symbol
            },
            {
              field: "assetDecimals",
              value: token?.decimals
            },
            {
              field: "assetAddress",
              value: token?.address
            }
          ])
        } else if (nft) {
          const addr = resolveNftContractAddress(nft)
          const tid = String(nft?.token_id ?? nft?.id)
          dbg("EL-XFER:selectNFT", { index, address: addr, tokenId: tid })
          onUpdateTransaction(index, [
            {
              field: "assetType",
              value: "transferERC721"
            },
            {
              field: "assetSymbol",
              value: nft?.token?.symbol
            },
            { field: "assetAddress", value: (addr as any) || "" },
            {
              field: "tokenId",
              value: tid
            }
          ])
        } else {
          dbg("EL-XFER:selectInvalid", JSON.stringify({ index, value: newValue }))
          alert("Invalid Selection")
        }
      }
    },
    [onUpdateTransaction, daoSelected?.registryAddress, daoTreasuryTokens, daoNfts]
  )

  return (
    <Grid container direction="column">
      {transferAssets.transactions.map((transaction: ITransaction, index: number) => (
        <TransactionContainer key={index}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <FormField label="Asset Type" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
                <FormSelect
                  value={getAssetType(transaction)}
                  onChange={e => handleAssetTypeChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                  inputProps={{ style: { fontSize: 14 } }}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected: any) => {
                      const val = String(selected || "")
                      // ETH
                      if (val === "transferETH") return "XTZ"
                      // NFT (nft::address:tokenId)
                      if (val.startsWith("nft::")) {
                        const parts = val.split("::")[1]?.split(":") || []
                        const addr = parts[0]
                        const tid = parts[1]
                        // Try to find symbol from daoNfts, else fallback
                        const nft = (daoNfts || []).find((n: any) => {
                          const nAddr = resolveNftContractAddress(n)
                          const nTid = String(n?.token_id ?? n?.id)
                          return nAddr?.toLowerCase() === addr?.toLowerCase() && nTid === tid
                        })
                        const sym = nft?.token?.symbol || transaction.assetSymbol || "NFT"
                        const short = addr ? toShortAddress(addr) : ""
                        return short ? `${sym} #${tid} · ${short}` : `${sym} #${tid}`
                      }
                      // ERC-20: find by address and show symbol; fallback to address
                      const token = (daoTreasuryTokens || []).find(
                        (t: any) => String(t?.address || "").toLowerCase() === val.toLowerCase()
                      )
                      const sym = token?.symbol || transaction.assetSymbol || ""
                      const short = val ? toShortAddress(val) : ""
                      const label = sym && short ? `${sym} · ${short}` : sym || short || "Select asset"
                      return label
                    }
                  }}
                >
                  <MenuItem value="transferETH">XTZ</MenuItem>
                  {(daoTreasuryTokens || [])
                    // Extra guard: display only fungible tokens
                    .filter((token: any) => {
                      const ty = String(token?.type || "").toUpperCase()
                      const isFungible = !ty || ty.includes("ERC20") || ty.includes("ERC-20")
                      const hasValidAddress = typeof token?.address === "string" && ethers.isAddress(token.address)
                      return isFungible && hasValidAddress
                    })
                    .map((token: any) => (
                      <MenuItem key={token.address} value={token.address}>
                        {token.symbol}
                      </MenuItem>
                    ))}
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
                </FormSelect>
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="Recipient Address" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
                <FormTextField
                  value={transaction.recipient}
                  placeholder="0x..."
                  onChange={e =>
                    onUpdateTransaction(index, [{ field: "recipient", value: (e.target.value || "").trim() }])
                  }
                  inputProps={{ style: { fontSize: 14 } }}
                />
                {transaction.assetType === "transferERC721" && (
                  <Typography color="textSecondary" style={{ fontSize: 12, marginTop: 6 }}>
                    NFT addr: {transaction.assetAddress || "(missing)"} | tokenId: {String(transaction.tokenId || "")}
                  </Typography>
                )}
                {transaction.assetType === "transferERC20" && (
                  <Typography color="textSecondary" style={{ fontSize: 12, marginTop: 6 }}>
                    ERC20 addr: {transaction.assetAddress || "(missing)"}
                  </Typography>
                )}
              </FormField>
            </Grid>
            {transaction.assetType !== "transferERC721" ? (
              <Grid item xs={12} sm={2}>
                <FormField
                  label="Amount"
                  labelStyle={{ fontSize: 16 }}
                  containerStyle={{ gap: 12 }}
                  errorText={!transaction.amount ? "Amount must be a number" : ""}
                >
                  <FormTextField
                    type="number"
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      min: "0.001",
                      step: "0.000001",
                      style: { fontSize: 14 }
                    }}
                    value={transaction.amount}
                    onChange={e => onUpdateTransaction(index, [{ field: "amount", value: e.target.value }])}
                  />
                </FormField>
              </Grid>
            ) : (
              <Grid item xs={12} sm={3}>
                <FormField label="Amount" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
                  <Typography color="textSecondary" style={{ fontSize: 14, paddingTop: 12, paddingBottom: 12 }}>
                    No amount needed for NFTs — just set recipient
                  </Typography>
                </FormField>
              </Grid>
            )}
            <Grid item xs={12} sm={1} container alignItems="center" justifyContent="center">
              {index > 0 && (
                <RemoveButton onClick={() => onRemoveTransaction(index)}>
                  <RemoveCircleOutline />
                </RemoveButton>
              )}
            </Grid>
          </Grid>
        </TransactionContainer>
      ))}

      {/* Disabled Temporarily */}
      {/* <AddButton onClick={onAddTransaction}>
        <AddIcon style={{ marginRight: "8px" }} />
        <Typography>Add Transaction</Typography>
      </AddButton> */}
    </Grid>
  )
}
