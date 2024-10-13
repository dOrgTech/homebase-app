import { Avatar, Button, Grid, Link, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Community } from "models/Community"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import { useTezos } from "services/beacon/hooks/useTezos"
import { DashboardContext } from "../context/ActionSheets/explorer"
import { updateCount } from "services/services/lite/lite-services"
import { useHoldersTotalCount } from "../hooks/useHolderTotalCount"
import ReactHtmlParser from "react-html-parser"

const StyledAvatar = styled(Avatar)({
  height: 159,
  width: 159
})

const MembersText = styled(Typography)({
  fontWeight: 300,
  fontSize: 18,
  letterSpacing: "-0.01em",
  marginBottom: 10
})

const TermsText = styled(Link)(({ theme }) => ({
  fontSize: 14,
  textDecoration: "underline",
  color: theme.palette.secondary.main,
  cursor: "pointer",
  fontFamily: "Roboto Flex",
  letterSpacing: "1px !important"
}))

const CommunityText = styled(Typography)({
  fontWeight: 500,
  fontSize: 30,
  lineHeight: "146.3%"
})

const CommunityDescription = styled(Typography)({
  marginBottom: 22,
  maxHeight: 124,
  overflowY: "scroll",
  marginTop: 10
})

const ProposalButton = styled(Button)({
  padding: 8,
  fontSize: 15
})

const DaoCardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  marginBottom: 15,
  padding: "33px 40px"
}))

interface DaoCardDetailProps {
  community?: Community
  setIsUpdated: any
}

export const DaoCardDetail: React.FC<DaoCardDetailProps> = ({ community, setIsUpdated }) => {
  console.log("Community", { community })
  const navigate = useHistory()
  const { network, account } = useTezos()
  const { isConnected } = useContext(DashboardContext)
  const count = useHoldersTotalCount(
    network,
    community?.tokenAddress || "",
    community?.tokenID ? Number(community?.tokenID) : 0
  )

  const updateCommunityCount = useCallback(async () => {
    if (community) {
      try {
        const resp = await updateCount(community._id)
        const respData = await resp.json()

        if (!resp.ok) {
          console.log(respData.message)
        }
      } catch (error) {
        console.log("Error: ", error)
      }
    }
  }, [community])

  useEffect(() => {
    updateCommunityCount()
  }, [updateCommunityCount])

  return (
    <DaoCardContainer container style={{ gap: 10 }} direction="column">
      <Grid item>
        <StyledAvatar src={community?.picUri}> </StyledAvatar>
      </Grid>
      <Grid item container direction="column" justifyContent="center" alignItems="center">
        <Grid item direction="column" container alignItems="center">
          <CommunityText color="textPrimary">{community?.name}</CommunityText>
          <MembersText variant={"body1"} color="textPrimary">
            {count} members
          </MembersText>
          <TermsText href={community?.linkToTerms} target="_blank" color="secondary">
            COMMUNITY TERMS
          </TermsText>
        </Grid>
      </Grid>

      <Grid container direction="row" justifyContent="center">
        <CommunityDescription variant="body2" color="textPrimary">
          {ReactHtmlParser(community?.description ? community?.description : "")}
        </CommunityDescription>
      </Grid>

      {isConnected ? (
        <Grid item>
          <ProposalButton
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => navigate.push(`/explorer/lite/dao/${community?._id}/community/proposal`)}
          >
            New Proposal
          </ProposalButton>
        </Grid>
      ) : null}
    </DaoCardContainer>
  )
}
