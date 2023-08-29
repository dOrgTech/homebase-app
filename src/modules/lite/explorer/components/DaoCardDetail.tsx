import { Avatar, Button, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Community } from "models/Community"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import { useTezos } from "services/beacon/hooks/useTezos"
import { DashboardContext } from "../context/ActionSheets/explorer"
import { useHoldersTotalCount } from "../hooks/useHolderTotalCount"
import { updateCount } from "services/services/lite/lite-services"
import { useIsMember } from "../hooks/useIsMember"

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
  const navigate = useHistory()
  const { network, account } = useTezos()
  const theme = useTheme()
  const { isConnected } = useContext(DashboardContext)
  const count = useHoldersTotalCount(network, community?.tokenAddress || "")
  const isMember = useIsMember(network, community?.tokenAddress || "", account)

  const updateCommunityCount = useCallback(
    async (count: number) => {
      if (community) {
        updateCount(community._id, count)
      }
    },
    [community]
  )

  useEffect(() => {
    updateCommunityCount(count)
  }, [count, updateCommunityCount])

  const shouldBeDisabled = () => {
    return community?.requiredTokenOwnership && isMember ? false : true
  }

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
        </Grid>
      </Grid>

      <Grid container direction="row" justifyContent="center">
        <CommunityDescription variant="body2" color="textPrimary">
          {community?.description}
        </CommunityDescription>
      </Grid>

      {isConnected ? (
        <Grid item>
          <ProposalButton
            disabled={shouldBeDisabled()}
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
