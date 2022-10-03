import { Grid, GridProps, styled, Typography } from "@material-ui/core"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge"
import { UserBadge } from "modules/explorer/components/UserBadge"
import React from "react"

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.primary
}))

interface Props extends GridProps {
  label: string
  address: string
}

export const ProposalTransferBadge: React.FC<Props> = ({ label, address, ...props }) => {
  return (
    <HighlightedBadge alignItems="center" direction="row" container style={{ gap: 20 }} {...props}>
      <Grid item>
        <Typography variant={"body1"} color={"textPrimary"}>
          {label}
        </Typography>
      </Grid>
      <ArrowContainer item>
        <ArrowForwardIcon color="inherit" />
      </ArrowContainer>
      <Grid item>
        <UserBadge address={address} />
      </Grid>
    </HighlightedBadge>
  )
}
