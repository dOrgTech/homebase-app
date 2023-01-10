import React, { useCallback, useMemo } from "react"
import { Grid, styled, Typography, Button, useTheme, useMediaQuery, Tooltip } from "@material-ui/core"

import { useFlush } from "services/contracts/baseDAO/hooks/useFlush"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { useProposals } from "services/indexer/dao/hooks/useProposals"
import { useDAOID } from "./router"

import { UserBalancesBox } from "../../components/UserBalances"
import { ContentContainer } from "../../components/ContentContainer"
import { ProposalsList } from "../../components/ProposalsList"
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
import { DAOStatsRow } from "../../components/DAOStatsRow"
import { UsersTable } from "../../components/UsersTable"
import BigNumber from "bignumber.js"
import { InfoIcon } from "../../components/styled/InfoIcon"
import { SmallButton } from "../../../common/SmallButton"

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px 38px"
}))

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: 40,
  fontWeight: 500,
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

const SubtitleText = styled(Typography)({
  fontSize: 18,
  margin: "-10px auto 0 auto",
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
})

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

export const DAO: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo, ledger } = useDAO(daoId)
  const { mutate } = useFlush()
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const name = data && data.data.name
  const description = data && data.data.description

  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE)
  const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED)

  const onFlush = useCallback(async () => {
    if (executableProposals && expiredProposals && executableProposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: executableProposals.length,
        expiredProposalIds: expiredProposals.map(p => p.id)
      })
      return
    }
  }, [data, mutate, expiredProposals, executableProposals])

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
    <Grid container direction="column" style={{ gap: isExtraSmall ? 25 : 42 }}>
      <HeroContainer item>
        <Grid container direction="column" style={{ gap: 36 }}>
          <Grid item>
            <Grid container style={{ gap: 20 }} alignItems="center">
              <Grid item>
                <TitleText color="textPrimary">{name}</TitleText>
              </Grid>
              <Grid item>
                <SmallButton
                  variant="contained"
                  size={isExtraSmall ? "small" : "medium"}
                  onClick={onFlush}
                  disabled={!executableProposals || !executableProposals.length}
                >
                  Execute
                </SmallButton>
                <Tooltip title="Execute all passed proposals and drop all expired or rejected">
                  <InfoIcon color="secondary" />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <SubtitleText color="textPrimary">{description}</SubtitleText>
          </Grid>
        </Grid>
      </HeroContainer>
      <DAOStatsRow />

      {data && cycleInfo && activeProposals && (
        <ProposalsList
          showFooter
          title="Active Proposals"
          currentLevel={cycleInfo.currentLevel}
          proposals={activeProposals}
        />
      )}
      <TableContainer item>
        <UsersTable data={usersTableData} />
      </TableContainer>
    </Grid>
  )
}
