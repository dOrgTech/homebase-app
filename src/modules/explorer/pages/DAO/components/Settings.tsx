/* eslint-disable react/display-name */
import React from "react"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { DaoInfoTables } from "../../Config/components/DAOInfoTable"

interface Props {
  open: boolean
  handleClose: () => void
}

export const DaoSettingModal: React.FC<Props> = ({ open, handleClose }) => {
  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Dao Settings"} template="xs">
        <DaoInfoTables />
      </ResponsiveDialog>
    </>
  )
}
