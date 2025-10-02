import React, { useCallback, useContext } from "react"
import { Grid, styled, MenuItem, IconButton } from "components/ui"
import { RemoveCircleOutline } from "@material-ui/icons"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { StyledTextField } from "components/ui/StyledTextField"
import { EtherlinkContext } from "services/wagmi/context"

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

const InputContainer = styled(Grid)({
  background: "#1c2024",
  padding: "16px",
  borderRadius: "4px",
  marginBottom: "8px"
})

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
      obj.forEach((o: { field: keyof ITransaction; value: string }) => {
        transactions[index][o.field] = o.value
      })
      setTransferAssets(transactions, daoSelected?.registryAddress)
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
      return transaction.assetAddress
    } else if (transaction.assetType === "transferERC721") {
      return `nft::${transaction.assetAddress}:${transaction.tokenId}`
    }
  }, [])

  const handleAssetTypeChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
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
        const nft = daoNfts?.find((nft: any) => `nft::${nft.token?.address}:${nft.id}` === newValue)
        if (token) {
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
          onUpdateTransaction(index, [
            {
              field: "assetType",
              value: "transferERC721"
            },
            {
              field: "assetSymbol",
              value: nft?.token?.symbol
            },
            {
              field: "assetAddress",
              value: nft?.token?.address
            },
            {
              field: "tokenId",
              value: nft?.id
            }
          ])
        } else {
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
          <InputContainer container spacing={2}>
            <Grid item xs={12} sm={3}>
              <StyledTextField
                select
                fullWidth
                label="Asset Type"
                variant="standard"
                value={getAssetType(transaction)}
                onChange={e => handleAssetTypeChange(index, e as React.ChangeEvent<HTMLInputElement>)}
              >
                <MenuItem value="transferETH">XTZ</MenuItem>
                {daoTreasuryTokens?.map((token: any) => (
                  <MenuItem key={token.address} value={token.address}>
                    {token.symbol}
                  </MenuItem>
                ))}
                {daoNfts?.map((nft: any) => (
                  <MenuItem key={`nft::${nft.token?.address}:${nft.id}`} value={`nft::${nft.token?.address}:${nft.id}`}>
                    {nft.token?.symbol} - #{nft.id}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Recipient Address"
                variant="standard"
                value={transaction.recipient}
                onChange={e => onUpdateTransaction(index, [{ field: "recipient", value: e.target.value }])}
              />
            </Grid>
            {transaction.assetType !== "transferERC721" && (
              <Grid item xs={12} sm={2}>
                <StyledTextField
                  fullWidth
                  label="Amount"
                  type="number"
                  variant="standard"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    min: "0.001",
                    step: "0.000001"
                  }}
                  error={!transaction.amount}
                  helperText={!transaction.amount ? "Amount must be a number" : ""}
                  value={transaction.amount}
                  onChange={e => onUpdateTransaction(index, [{ field: "amount", value: e.target.value }])}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={1} container alignItems="center" justifyContent="center">
              {index > 0 && (
                <RemoveButton onClick={() => onRemoveTransaction(index)}>
                  <RemoveCircleOutline />
                </RemoveButton>
              )}
            </Grid>
          </InputContainer>
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
