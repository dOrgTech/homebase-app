import React, { useEffect, useState } from "react"
import { Grid, Typography } from "@material-ui/core"
import { CycleInfo } from "services/contracts/baseDAO"

export const Countdown: React.FC<{ cycleInfo: CycleInfo }> = ({ cycleInfo }) => {
  const [counter, setCounter] = useState<number>(0)
  const [oldCycle, setOldCycle] = useState<number>(0)

  useEffect(() => {
    const pendingCycles = cycleInfo.blocksLeft
    setCounter(pendingCycles * cycleInfo.timeEstimateForNextBlock)
    if (cycleInfo.blocksLeft !== oldCycle) {
      setOldCycle(cycleInfo.blocksLeft * cycleInfo.timeEstimateForNextBlock)
    }
  }, [cycleInfo, oldCycle])

  return (
    <Grid container style={{ gap: 32 }} wrap="nowrap">
      <Grid item>
        <Typography color="secondary" variant="body1">
          Time Left in Cycle
        </Typography>
        <Grid style={{ display: "flex", marginTop: 12 }} wrap="nowrap">
          <Typography color="textPrimary" variant="h2" style={{ marginRight: 15 }}>
            {Math.floor(counter / (3600 * 24))}d
          </Typography>
          <Typography color="textPrimary" variant="h2" style={{ marginRight: 15 }}>
            {Math.floor((counter % (3600 * 24)) / 3600)}h
          </Typography>
          <Typography color="textPrimary" variant="h2" style={{ marginRight: 15 }}>
            {Math.floor((counter % 3600) / 60)}m
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
