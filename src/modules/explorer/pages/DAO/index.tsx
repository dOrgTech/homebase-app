import React, { useMemo, useState } from "react"
import BigNumber from "bignumber.js"
import { Grid, styled, Typography, useTheme, useMediaQuery, Avatar } from "@material-ui/core"

import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "./router"

import { DAOStatsRow } from "../../components/DAOStatsRow"
import { UsersTable } from "../../components/UsersTable"

import { SmallButton } from "../../../common/SmallButton"
import { DaoSettingModal } from "./components/Settings"
import SettingsIcon from "@mui/icons-material/Settings"
import { SettingsDialog } from "./components/SettingsDialog"
import { ContentContainer } from "components/ui/Table"
import { IconButton } from "@mui/material"
import { FileCopyOutlined } from "@material-ui/icons"

export const StyledAvatar = styled(Avatar)({
  height: 50,
  width: 50
})

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: 38,
  [theme.breakpoints.down("sm")]: {
    width: "inherit"
  }
}))

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: 36,
  fontWeight: 600,
  lineHeight: 0.8,

  ["@media (max-width:642px)"]: {
    fontSize: 35
  },

  ["@media (max-width:583px)"]: {
    fontSize: 30
  },

  ["@media (max-width:533px)"]: {
    fontSize: 25
  },

  ["@media (max-width:462px)"]: {
    fontSize: 22
  }
}))

const ViewSettings = styled(Grid)({
  "fontWeight": 300,
  "gap": 8,
  "cursor": "pointer",
  "& h6": {
    fontWeight: 300
  }
})

const SubtitleText = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.light,
  width: "875px",
  fontWeight: 300,
  maxHeight: "200px",
  overflowY: "scroll",

  ["@media (max-width:1166px)"]: {
    width: "75.3vw"
  },

  ["@media (max-width:1138px)"]: {
    width: "100%"
  },

  ["@media (max-width:599.98px)"]: {
    width: "100%",
    margin: "-15px auto 0 auto"
  }
}))

export const DAOOverview: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo, ledger } = useDAO(daoId)
  console.log("dataDAO", data)
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const symbol = data?.data?.token?.symbol?.toUpperCase() || "Unknown"

  const name = data?.data?.name
  const description = data?.data?.description

  const [openDialog, setOpenDialog] = useState(false)
  const [openChangeDialog, setChangeOpenDialog] = useState(false)

  const handleCloseModal = () => {
    setOpenDialog(false)
  }

  const handleCloseChangeModal = () => {
    setChangeOpenDialog(false)
  }

  const usersTableData = useMemo(() => {
    if (data?.data?.meta?.users) {
      return data.data.meta.users
    }

    if (!ledger || !cycleInfo || !data) {
      return []
    }

    return ledger
      .sort((a, b) => b.available_balance.minus(a.available_balance).toNumber())
      .map(p => ({
        address: p.holder.address,
        totalStaked: new BigNumber(p.total_balance).dp(10, 1).toString(),
        availableStaked: new BigNumber(p.available_balance).dp(10, 1).toString(),
        votes: p.holder.votes_cast.toString(),
        proposalsVoted: p.holder.proposals_voted.toString()
      }))
  }, [cycleInfo, data, ledger])

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
                <DaoSettingModal open={openDialog} handleClose={handleCloseModal} />
              </Grid>
              <Grid item>
                <SmallButton onClick={() => setChangeOpenDialog(true)}>
                  <Typography color="primary">Change Settings</Typography>
                </SmallButton>
                <SettingsDialog open={openChangeDialog} handleClose={handleCloseChangeModal} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {data?.data.network?.startsWith("etherlink") ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography
                      variant="h6"
                      style={{ color: theme.palette.primary.light, fontSize: 16, fontWeight: 300 }}
                    >
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
                      {data?.data.address || "-"}
                      <IconButton
                        onClick={() => {
                          if (data?.data.address) {
                            navigator.clipboard.writeText(data.data.address)
                          }
                        }}
                        size="small"
                        style={{ marginLeft: "8px", color: theme.palette.primary.light }}
                      >
                        <FileCopyOutlined fontSize="inherit" />
                      </IconButton>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography
                      variant="h6"
                      style={{ color: theme.palette.primary.light, fontSize: 16, fontWeight: 300 }}
                    >
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
                      {data?.data.token.symbol || "-"}
                      <IconButton
                        onClick={() => {
                          if (data?.data.token.symbol) {
                            navigator.clipboard.writeText(data.data.token.symbol)
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
              </>
            ) : (
              <SubtitleText>{description}</SubtitleText>
            )}
          </Grid>
        </Grid>
      </HeroContainer>
      <DAOStatsRow />

      <Grid item style={{ width: "inherit" }}>
        <UsersTable data={usersTableData} symbol={symbol || ""} />
      </Grid>
    </Grid>
  )
}
