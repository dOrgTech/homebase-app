import React, { useContext } from "react"
import { Grid, styled, Typography, MenuItem, IconButton, TextField } from "@material-ui/core"
import { Add as AddIcon, RemoveCircleOutline } from "@material-ui/icons"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { StyledTextField } from "components/ui/StyledTextField"
import { EtherlinkContext } from "services/wagmi/context"

const TransactionContainer = styled(Grid)({
  marginBottom: "20px"
})

const AddButton = styled(Grid)({
  background: "#1c2024",
  padding: "12px",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "16px"
})

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
  recipient: string
  amount: string
}

export const EvmPropTransferAssets: React.FC = () => {
  const { transferAssets, setTransferAssets } = useEvmProposalOps()
  const { daoSelected } = useContext(EtherlinkContext)

  const onUpdateTransaction = (index: number, field: keyof ITransaction, value: string) => {
    const transactions = [...transferAssets.transactions]
    transactions[index][field] = value
    setTransferAssets(transactions, daoSelected?.treasuryAddress)
  }

  const onAddTransaction = () => {
    const transactions = [...transferAssets.transactions]
    transactions.push({ assetType: "XTZ", recipient: "", amount: "" })
    setTransferAssets(transactions, daoSelected?.treasuryAddress)
  }

  const onRemoveTransaction = (index: number) => {
    const transactions = [...transferAssets.transactions]
    transactions.splice(index, 1)
    setTransferAssets(transactions, daoSelected?.treasuryAddress)
  }

  console.log("Txns", transferAssets.transactions)
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
                value={transaction.assetType}
                onChange={e => onUpdateTransaction(index, "assetType", e.target.value)}
              >
                <MenuItem value="XTZ">XTZ</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Recipient Address"
                variant="standard"
                value={transaction.recipient}
                onChange={e => onUpdateTransaction(index, "recipient", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <StyledTextField
                fullWidth
                label="Amount"
                type="number"
                variant="standard"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  min: "0",
                  step: "0.000001"
                }}
                error={!transaction.amount}
                helperText={!transaction.amount ? "Amount must be a number" : ""}
                value={transaction.amount}
                onChange={e => onUpdateTransaction(index, "amount", e.target.value)}
              />
            </Grid>
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

      <AddButton onClick={onAddTransaction}>
        <AddIcon style={{ marginRight: "8px" }} />
        <Typography>Add Transaction</Typography>
      </AddButton>
    </Grid>
  )
}
