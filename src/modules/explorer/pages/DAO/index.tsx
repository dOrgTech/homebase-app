import React, { useMemo, useState } from "react"
import { Grid, styled, Typography, Button, useTheme, useMediaQuery, Avatar } from "@material-ui/core"

import { useFlush } from "services/contracts/baseDAO/hooks/useFlush"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposals } from "services/services/dao/hooks/useProposals"
import { useDAOID } from "./router"

import { ContentContainer } from "../../components/ContentContainer"
import { ProposalsList } from "../../components/ProposalsList"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { DAOStatsRow } from "../../components/DAOStatsRow"
import { UsersTable } from "../../components/UsersTable"
import BigNumber from "bignumber.js"
import { SmallButton } from "../../../common/SmallButton"
import { usePolls } from "modules/lite/explorer/hooks/usePolls"
import dayjs from "dayjs"
import { DaoSettingModal } from "./components/Settings"
import SettingsIcon from "@mui/icons-material/Settings"
import { SettingsDialog } from "./components/SettingsDialog"

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

export const DAO: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo, ledger } = useDAO(daoId)
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))
  const symbol = data && data.data.token.symbol.toUpperCase()

  const name = data && data.data.name
  const description = data && data.data.description

  const [openDialog, setOpenDialog] = useState(false)
  const [openChangeDialog, setChangeOpenDialog] = useState(false)

  const handleCloseModal = () => {
    setOpenDialog(false)
  }

  const handleCloseChangeModal = () => {
    setChangeOpenDialog(false)
  }

  const usersTableData = useMemo(() => {
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
            <SubtitleText>{description}</SubtitleText>
          </Grid>
        </Grid>
      </HeroContainer>
      <DAOStatsRow />

      {/* <Grid item style={{ width: "inherit" }}>
        <UsersTable data={usersTableData} symbol={symbol || ""} />
      </Grid> */}
    </Grid>
  )
}
