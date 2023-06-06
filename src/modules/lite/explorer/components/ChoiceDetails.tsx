import React, { useEffect, useState } from "react"
import { Grid, LinearProgress, styled, Typography } from "@material-ui/core"
import { Choice } from "models/Choice"
import { Poll } from "models/Polls"
import { calculateChoiceTotal, calculateWeight, nFormatter } from "services/lite/utils"

const LightText = styled(Typography)({
  fontWeight: 300,
  textAlign: "center"
})

export const ChoiceDetails: React.FC<{ choice: Choice; index: number; poll: Poll }> = ({ choice, index, poll }) => {
  const balance = calculateChoiceTotal(choice.walletAddresses, poll.tokenDecimals)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const individualBalance = calculateWeight(poll.totalSupplyAtReferenceBlock!, balance, poll.tokenDecimals)

  const [, updateState] = React.useState<any>()
  const forceUpdate = React.useCallback(() => updateState({}), [])

  // setTimeout(() => {
  //   forceUpdate()
  // }, 500)

  return (
    <Grid style={{ gap: 19, display: index > 2 ? "none" : "block", marginBottom: 16 }} container>
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item xs={12} lg={6} md={6} sm={4} container direction="row" justifyContent="space-between">
          <Grid item xs>
            <Typography color="textPrimary"> {choice.name} </Typography>
          </Grid>
          <Grid item xs>
            <LightText color="textPrimary"> {nFormatter(balance, 1)} </LightText>
          </Grid>
          <Grid item xs>
            <LightText color="textPrimary"> {poll.tokenSymbol} </LightText>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          lg={6}
          md={6}
          sm={8}
          spacing={1}
          container
          direction="row"
          item
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item xs={8} container>
            <LinearProgress
              style={{ width: "100%", marginRight: "4px" }}
              color={index & 1 ? "primary" : "secondary"}
              value={individualBalance.toNumber()}
              variant="determinate"
            />
          </Grid>
          <Grid item xs>
            <Typography style={{ textAlign: "end" }} color="textPrimary">
              {individualBalance.dp(3, 1).toString()}%
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
