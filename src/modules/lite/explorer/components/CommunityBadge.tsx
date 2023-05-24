import React from "react"
import { Avatar, Grid, styled, Typography } from "@material-ui/core"
import { useCommunity } from "../hooks/useCommunity"

const StyledAvatar = styled(Avatar)({
  height: 27,
  width: 27
})

export const CommunityBadge: React.FC<{ id: string }> = ({ id }) => {
  const community = useCommunity(id)
  return (
    <Grid container style={{ gap: 11 }}>
      <Grid item>
        <StyledAvatar src={community?.picUri}> </StyledAvatar>
      </Grid>
      <Grid item>
        <Typography color="textPrimary" variant="subtitle2">
          {community?.name}
        </Typography>
      </Grid>
    </Grid>
  )
}
