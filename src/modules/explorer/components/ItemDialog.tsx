import { TextField } from "@mui/material"
import React from "react"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { ProposalFormInput } from "./ProposalFormInput"

export const RegistryItemDialog: React.FC<{
  item: { key: string; value: string }
  open: boolean
  handleClose: () => void
}> = ({ item: { key, value }, open, handleClose }) => {
  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={key}>
        <ProposalFormInput label={"Value"}>
          <TextField InputProps={{ disableUnderline: true }} multiline maxRows={Infinity} value={value} disabled />
        </ProposalFormInput>
      </ResponsiveDialog>
    </>
  )
}
