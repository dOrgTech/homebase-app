import React from "react"
import { Grid, Typography, Tooltip, styled } from "@material-ui/core"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import ProgressBar from "react-customizable-progressbar"
import { formatNumber } from "modules/explorer/utils/FormatNumber"
import { theme } from "theme"
import BigNumber from "bignumber.js"

interface Props {
  value: BigNumber
  tooltipText: string
}

const ProgressText = styled(Typography)(({ textColor }: { textColor: string }) => ({
  color: textColor,
  display: "flex",
  alignItems: "center",
  position: "absolute",
  width: "100%",
  height: "100%",
  fontSize: 16,
  userSelect: "none",
  boxShadow: "none",
  background: "inherit",
  fontFamily: "Roboto Mono",
  justifyContent: "center",
  top: 0
}))

export const QuorumThreshold: React.FC<Props> = ({ value, tooltipText }) => {
  return (
    <Grid item>
      <Grid container direction="column">
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <Typography variant="subtitle1" color="textSecondary">
                QUORUM THRESHOLD %
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip placement="bottom" title={tooltipText}>
                <InfoIcon color="secondary" />
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <ProgressBar
            progress={value.toNumber()}
            radius={50}
            strokeWidth={7}
            strokeColor="#3866F9"
            trackStrokeWidth={4}
            trackStrokeColor={theme.palette.primary.light}
          >
            <div className="indicator">
              <ProgressText textColor="#3866F9">{formatNumber(value)}</ProgressText>
            </div>
          </ProgressBar>
        </Grid>
      </Grid>
    </Grid>
  )
}
