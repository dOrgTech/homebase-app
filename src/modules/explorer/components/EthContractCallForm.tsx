import React, { useState } from "react"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { ProposalFormInput } from "./ProposalFormInput"
import { Grid, TextField } from "@material-ui/core"
import { SendButton } from "./ProposalFormSendButton"

interface EthContractCallFormProps {
  open: boolean
  handleClose: () => void
}

const EthContractCallForm: React.FC<EthContractCallFormProps> = ({ open, handleClose }) => {
  const [title, setTitle] = useState("")
  const [offChainResources, setOffChainResources] = useState("")
  return (
    <ResponsiveDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      title={"Contract Call Proposal"}
      template="xs"
    >
      <Grid container direction="column">
        <ProposalFormInput label="Title">
          <TextField
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value)
            }}
            type="string"
            InputProps={{ disableUnderline: true }}
            placeholder="Add Proposal Title here"
          />
        </ProposalFormInput>
      </Grid>
      <Grid container direction="column">
        <ProposalFormInput label="Off-chain resources">
          <TextField
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setOffChainResources(e.target.value)
            }}
            type="string"
            InputProps={{ disableUnderline: true }}
            placeholder="Add link to offchain resources"
          />
        </ProposalFormInput>
      </Grid>
      <Grid container direction="row" justifyContent="center">
        {/* TODO: @ashutoshpw to be fixed by ashutoshpw */}
        <SendButton onClick={() => {}}>Submit</SendButton>
      </Grid>
    </ResponsiveDialog>
  )
}

export default EthContractCallForm
