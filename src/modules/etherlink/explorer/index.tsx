import React, { useContext, useState } from "react"
import { Grid, Typography, useTheme, useMediaQuery } from "components/ui"

import { SmallButton } from "../../common/SmallButton"

import { Settings as SettingsIcon, IconButton } from "components/ui"
import { FileCopyOutlined } from "components/ui"
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
              <Grid item xs={12} sm={8}>
                <TitleText color="textPrimary">{name}</TitleText>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Grid container spacing={2} justifyContent={isExtraSmall ? "center" : "flex-end"} alignItems="center">
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
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SubtitleText>{description}</SubtitleText>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h6" style={{ color: theme.palette.primary.light, fontSize: 16, fontWeight: 300 }}>
                  Treasury Address
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    display: "flex",
                    fontSize: 16,
                    alignItems: "center",
                    color: theme.palette.primary.light,
                    wordBreak: "break-all"
                  }}
                >
                  {daoSelected?.registryAddress || "-"}
                  <IconButton
                    onClick={() => {
                      if (daoSelected?.registryAddress) {
                        navigator.clipboard.writeText(daoSelected.registryAddress)
                      }
                    }}
                    size="small"
                    style={{ marginLeft: "8px", color: theme.palette.primary.light, flexShrink: 0 }}
                  >
                    <FileCopyOutlined fontSize="inherit" />
                  </IconButton>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Typography variant="h6" style={{ color: theme.palette.primary.light, fontSize: 16, fontWeight: 300 }}>
                  Governance Token
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    display: "flex",
                    fontSize: 16,
                    alignItems: "center",
                    color: theme.palette.primary.light,
                    wordBreak: "break-all"
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
                    style={{ marginLeft: "8px", flexShrink: 0 }}
                  >
                    <FileCopyOutlined fontSize="inherit" />
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </HeroContainer>
      <EvmDaoStatsRow />
      <EvmTreasuryTable />
    </Grid>
  )
}
