/* eslint-disable react/display-name */
import { Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import React, { useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "../router"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { DaoInfoTables } from "../../Config/components/DAOInfoTable"

const OptionContainer = styled(Grid)(({ theme }) => ({
  "minHeight": 80,
  "background": theme.palette.primary.main,
  "borderRadius": 8,
  "padding": "35px 42px",
  "marginBottom": 16,
  "cursor": "pointer",
  "height": 110,
  "&:hover": {
    background: theme.palette.secondary.dark,
    scale: 1.01,
    transition: "0.15s ease-in"
  }
}))

const ActionText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 20,
  marginBottom: 8
}))

const ActionDescriptionText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 16
}))

interface Action {
  id: any
  name: string
  description: string
  isLambda: boolean
}

interface Props {
  open: boolean
  handleClose: () => void
}

export const DaoSettingModal: React.FC<Props> = ({ open, handleClose }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <>
      <ResponsiveDialog open={open} onClose={handleClose} title={"Dao Settings"} template="xs">
        <DaoInfoTables />
      </ResponsiveDialog>
    </>
  )
}
