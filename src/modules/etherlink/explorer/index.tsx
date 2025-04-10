import React, { useContext, useState } from "react"
import { Grid, Typography, useTheme, useMediaQuery } from "@material-ui/core"

import { SmallButton } from "../../common/SmallButton"

import SettingsIcon from "@mui/icons-material/Settings"
import { IconButton } from "@mui/material"
import { FileCopyOutlined } from "@material-ui/icons"
import { HeroContainer } from "components/ui/HeroContainer"
import { ViewSettings } from "components/ui/ViewSettings"
import { SubtitleText } from "components/ui/SubtitleText"
import { TitleText } from "components/ui/TitleText"
import { EtherlinkContext } from "services/wagmi/context"
import { EvmDaoStatsRow } from "../components/EvmDaoStatsRow"
import { EvmDaoSettingModal } from "../components/EvmDaoSettingsModal"
import { EvmTreasuryTable } from "../components/EvmTreasuryTable"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { useHistory } from "react-router-dom"

export const EtherlinkDAOOverview: React.FC = () => {
  const { daoSelected } = useContext(EtherlinkContext)

  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const { setMetadataFieldValue, setCurrentStep } = useEvmProposalOps()
  const history = useHistory()

  const name = daoSelected?.name
  const description = daoSelected?.description

  const [openDialog, setOpenDialog] = useState(false)

  const handleCloseModal = () => {
    setOpenDialog(false)
  }

  return (
    <Grid container direction="column" style={{ gap: isExtraSmall ? 25 : 32 }}>
      <HeroContainer item>
        <Grid container direction="column" style={{ gap: isExtraSmall ? 40 : 20 }}>
          <Grid item>
            <Grid container justifyContent="space-between" alignItems="center" style={isExtraSmall ? { gap: 20 } : {}}>
              <Grid item xs={8}>
                <TitleText color="textPrimary">{name}</TitleText>
              </Grid>
              <Grid item>
                <ViewSettings container direction="row" alignItems="center" onClick={() => setOpenDialog(true)}>
                  <SettingsIcon style={{ fontSize: 18, color: theme.palette.secondary.main }} color="secondary" />
                  <Typography variant="body2" color="secondary">
                    View Settings
                  </Typography>
                </ViewSettings>
                <EvmDaoSettingModal open={openDialog} handleClose={handleCloseModal} />
              </Grid>
              <Grid item>
                <SmallButton
                  onClick={() => {
                    setMetadataFieldValue("type", "change_config")
                    setCurrentStep(1)
                    history.push(`${window.location.pathname.slice(0, -8)}proposals`)
                  }}
                >
                  <Typography color="primary">Change Settings</Typography>
                </SmallButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" style={{ color: theme.palette.primary.light, fontSize: 16, fontWeight: 300 }}>
                  DAO Contract
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    display: "flex",
                    fontSize: 16,
                    alignItems: "center",
                    color: theme.palette.primary.light
                  }}
                >
                  {daoSelected?.address || "-"}
                  <IconButton
                    onClick={() => {
                      if (daoSelected?.address) {
                        navigator.clipboard.writeText(daoSelected.address)
                      }
                    }}
                    size="small"
                    style={{ marginLeft: "8px", color: theme.palette.primary.light }}
                  >
                    <FileCopyOutlined fontSize="inherit" />
                  </IconButton>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" style={{ color: theme.palette.primary.light, fontSize: 16, fontWeight: 300 }}>
                  Governance Token
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    display: "flex",
                    fontSize: 16,
                    alignItems: "center",
                    color: theme.palette.primary.light
                  }}
                >
                  {daoSelected?.token || "-"}
                  <IconButton
                    onClick={() => {
                      if (daoSelected?.token) {
                        navigator.clipboard.writeText(daoSelected.token)
                      }
                    }}
                    size="small"
                    style={{ marginLeft: "8px" }}
                  >
                    <FileCopyOutlined fontSize="inherit" />
                  </IconButton>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <SubtitleText>{description}</SubtitleText>
              </Grid>
            </Grid>
            <br />
          </Grid>
        </Grid>
      </HeroContainer>
      <EvmDaoStatsRow />
      <EvmTreasuryTable />
    </Grid>
  )
}
