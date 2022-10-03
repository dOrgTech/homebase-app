import { Grid, GridProps, styled, Typography } from "@material-ui/core"
import ArrowForward from "@material-ui/icons/ArrowForward"
import { BigNumber } from "bignumber.js"
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge"
import { UserBadge } from "modules/explorer/components/UserBadge"
import React from "react"
import { mutezToXtz } from "services/contracts/utils"

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.primary
}))

interface Props extends GridProps {
  address: string
  amount: BigNumber
}

export const XTZTransferBadge: React.FC<Props> = ({ address, amount, ...props }) => {
  return (
    <HighlightedBadge
      justifyContent="center"
      alignItems="center"
      direction="row"
      container
      style={{ gap: 20 }}
      {...props}
    >
      <Grid item>
        <Typography variant="body1" color="textPrimary">
          <Typography color={"textPrimary"}>{mutezToXtz(amount).toString()} XTZ</Typography>
        </Typography>
      </Grid>
      <ArrowContainer item>
        <ArrowForward color="inherit" />
      </ArrowContainer>
      <Grid item>
        <UserBadge address={address} />
      </Grid>
    </HighlightedBadge>
  )
}
