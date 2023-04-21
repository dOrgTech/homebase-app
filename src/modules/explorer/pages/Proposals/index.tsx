import React from "react"
import { Button, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"

import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { useProposals } from "services/indexer/dao/hooks/useProposals"
import { useDAOID } from "../DAO/router"

import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
import { ContentContainer } from "../../components/ContentContainer"
import { AllProposalsList } from "modules/explorer/components/AllProposalsList"

const ProposalInfoTitle = styled(Typography)({
  fontSize: "18px",

  ["@media (max-width:1155px)"]: {
    whiteSpace: "nowrap"
  },

  ["@media (max-width:1030px)"]: {
    fontSize: "16.3px",
    whiteSpace: "initial"
  },

  ["@media (max-width:830.99px)"]: {
    fontSize: "18px"
  },

  ["@media (max-width:409.99px)"]: {
    fontSize: "16px"
  }
})

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px 0px 38px 38px",
  display: "inline-flex",
  alignItems: "center",
  maxHeight: 132,
  [theme.breakpoints.down("xs")]: {
    maxHeight: "fit-content"
  }
}))

const TitleText = styled(Typography)({
  fontSize: 30,
  fontWeight: 500,
  lineHeight: 0.9,

  ["@media (max-width:1030px)"]: {
    fontSize: 25
  }
})

export const DropButton = styled(Button)({
  verticalAlign: "text-bottom",
  fontSize: "16px"
})

const LargeNumber = styled(Typography)(({ theme }) => ({
  fontSize: "36px",
  fontWeight: 200,
  color: theme.palette.text.primary,
  marginTop: "7px",
  ["@media (max-width:1030px)"]: {
    fontSize: "30px"
  }
}))

export const Proposals: React.FC = () => {
  const daoId = useDAOID()
  const { data, cycleInfo } = useDAO(daoId)
  const { data: proposals } = useProposals(daoId)
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"))

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <HeroContainer item>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item container direction="row">
              <Grid
                container
                style={{ gap: 20 }}
                alignItems={isMobileSmall ? "baseline" : "center"}
                direction={isMobileSmall ? "column" : "row"}
              >
                <Grid item xs={isMobileSmall ? undefined : 5}>
                  <TitleText color="textPrimary">Proposals</TitleText>
                </Grid>
                <Grid item xs={isMobileSmall ? undefined : true}>
                  <Grid item container direction="column">
                    <ProposalInfoTitle color="secondary">Voting Addresses</ProposalInfoTitle>
                    <LargeNumber>{data?.data.ledger.length || "-"}</LargeNumber>
                  </Grid>
                </Grid>
                <Grid item xs={isMobileSmall ? undefined : true}>
                  <Grid item container direction="column">
                    <ProposalInfoTitle color="secondary">Active Proposals</ProposalInfoTitle>
                    <LargeNumber color="textPrimary">{activeProposals?.length}</LargeNumber>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </HeroContainer>

        {data && cycleInfo && proposals && (
          <AllProposalsList title={"Proposals"} currentLevel={cycleInfo.currentLevel} proposals={proposals} />
        )}
      </Grid>
    </>
  )
}
