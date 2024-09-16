import React, { useState } from "react"
import { Box } from "@mui/material"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { ProposalFormInput } from "./ProposalFormInput"
import { Controller } from "react-hook-form"
import { Grid, TextField, Paper, styled, useTheme, useMediaQuery } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import { SendButton } from "./ProposalFormSendButton"

interface EthContractCallFormProps {
  open: boolean
  handleClose: () => void
}
const AutoCompleteField = styled(Autocomplete)({
  "& .MuiInputLabel-root": {
    display: "none"
  },
  "& .MuiAutocomplete-inputRoot": {
    padding: 0
  },
  "& label + .MuiInput-formControl": {
    marginTop: "0"
  },

  '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"] .MuiAutocomplete-input:first-child': {
    padding: 0
  }
})

const AutoCompletePaper = styled(Paper)({
  background: "#24282B"
})

const EthTransferFundsForm: React.FC<EthContractCallFormProps> = ({ open, handleClose }) => {
  const [title, setTitle] = useState("")
  const [offChainResources, setOffChainResources] = useState("")
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  return (
    <ResponsiveDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      title={"Transfer Proposal"}
      template="xs"
    >
      <Grid container direction="column">
        <ProposalFormInput label="Receipient">
          <TextField
            onChange={(e: any) => {
              setTitle(e.target.value)
            }}
            type="string"
            InputProps={{ disableUnderline: true }}
            placeholder="0xc0de..."
          />
        </ProposalFormInput>
      </Grid>
      <Grid container direction="column">
        <ProposalFormInput label="Funds to transfer">
          <Grid container direction="row" spacing={2}>
            <Grid item xs={isMobileSmall ? 12 : 4}>
              <AutoCompleteField
                options={[
                  {
                    symbol: "USDT"
                  }
                ]}
                PaperComponent={AutoCompletePaper}
                getOptionLabel={option => (option as any).symbol}
                renderInput={params => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true
                    }}
                    label="Select asset"
                  />
                )}
                onChange={(e, data) => {
                  console.log(data)
                }}
              />
            </Grid>
            <Grid item xs={isMobileSmall ? 12 : 6}>
              <TextField
                onChange={(e: any) => {
                  setOffChainResources(e.target.value)
                }}
                type="number"
                InputProps={{ disableUnderline: true }}
                placeholder="Amount"
              />
            </Grid>
          </Grid>
        </ProposalFormInput>
        <br />
        <br />
        <Grid container direction="row" justifyContent="center">
          <SendButton onClick={() => {}}>Submit</SendButton>
        </Grid>
      </Grid>
    </ResponsiveDialog>
  )
}

export default EthTransferFundsForm
