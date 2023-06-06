import { Avatar, Button, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Community } from "models/Community"
import React, { useContext } from "react"
import { useHistory } from "react-router"
import { useTezos } from "services/beacon/hooks/useTezos"
import { DashboardContext } from "../context/ActionSheets/explorer"

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
  const theme = useTheme()
  const { isConnected } = useContext(DashboardContext)

  return (
    <DaoCardContainer container style={{ gap: 10 }} direction="column">
      <Grid item>
        <StyledAvatar src={community?.picUri}> </StyledAvatar>
      </Grid>
      <Grid item container direction="column" justifyContent="center" alignItems="center">
        <Grid item direction="column" container alignItems="center">
          <CommunityText color="textPrimary">{community?.name}</CommunityText>
          <MembersText variant={"body1"} color="textPrimary">
            {community?.members?.length} members
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
