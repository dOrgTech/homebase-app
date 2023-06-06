import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { ProposalCreator } from "."
import React from "react"

export const ProposalCreatorModal: React.FC<any> = ({ open, handleClose }) => {
  return (
    <ResponsiveDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      title={"Create Off Chain Poll"}
      template="xs"
    >
      <ProposalCreator />
    </ResponsiveDialog>
  )
}
