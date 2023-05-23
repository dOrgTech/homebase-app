import React, { useContext, useEffect, useState } from "react"
import { Avatar, Button, Grid, styled, Typography } from "@material-ui/core"
import { useHistory } from "react-router"
import { Community } from "models/Community"
import { useTezos } from "services/beacon/hooks/useTezos"
import { DashboardContext } from "../context/ActionSheets/explorer"

const StyledAvatar = styled(Avatar)({
  height: 84,
  width: 84
})

const MembersText = styled(Typography)({
  fontWeight: 200,
  fontSize: 16,
  marginTop: -8,
  marginBottom: 8
})

const DaoCardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  height: 245,
  marginBottom: 15,
  cursor: "pointer",
  padding: "inherit"
}))

const CommunityName = styled(Typography)({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  textAlign: "center"
})

const CustomButton = styled(Button)(({ theme }) => ({
  "width": 67,
  "height": 34,
  ".MuiButton-containedSecondary:hover": {
    backgroundColor: `${theme.palette.secondary.main} !important`
  }
}))

export const DaoCard: React.FC<{ community: Community; setIsUpdated: any }> = ({ community, setIsUpdated }) => {
  const navigate = useHistory()
  const { account } = useTezos()
  const { isConnected } = useContext(DashboardContext)

  return (
    <DaoCardContainer
      container
      style={{ gap: 10 }}
      onClick={() => navigate.push(`/explorer/community/${community._id}`)}
    >
      <Grid item>
        <StyledAvatar src={community.picUri}> </StyledAvatar>
      </Grid>
      <Grid item style={{ cursor: "pointer", width: "inherit" }}>
        <CommunityName variant={"body1"} color="textPrimary">
          {community.name}
        </CommunityName>
      </Grid>
      <Grid item>
        <MembersText variant={"body2"} color="textPrimary">
          {community.members?.length} members
        </MembersText>
      </Grid>
    </DaoCardContainer>
  )
}
