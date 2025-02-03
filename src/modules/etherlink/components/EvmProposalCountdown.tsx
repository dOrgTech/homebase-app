import { Grid } from "@material-ui/core"
import { Timer } from "@mui/icons-material"
import { Box } from "@mui/material"
import { Typography } from "@mui/material"
import dayjs from "dayjs"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { GridContainer } from "modules/common/GridContainer"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const EvmProposalCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const { daoProposalSelected } = useContext(EtherlinkContext)
  const timerLabel = daoProposalSelected?.timerLabel
  const timerTargetDate = daoProposalSelected?.timerTargetDate

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs()
      const target = dayjs(timerTargetDate)
      const diff = target.diff(now, "second")

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (24 * 60 * 60))
      const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60))
      const minutes = Math.floor((diff % (60 * 60)) / 60)
      const seconds = diff % 60

      setTimeLeft({ days, hours, minutes, seconds })
    }

    if (!dayjs.isDayjs(timerTargetDate)) {
      return
    }
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [timerTargetDate])

  if (!timerTargetDate) return null

  const TimeUnit = React.memo(({ value, unit }: { value: number; unit: string }) => (
    <Grid
      direction="column"
      alignItems="center"
      style={{ marginRight: 20, backgroundColor: "#222", borderRadius: 8, paddingBottom: 8, paddingTop: 8 }}
    >
      <Box
        sx={{
          fontSize: "24px",
          fontFamily: "monospace",
          fontWeight: "bold",
          borderRadius: 1,
          boxShadow: 1,
          px: 2,
          py: 1,
          minWidth: "80px",
          textAlign: "center"
        }}
      >
        {value.toString().padStart(2, "0")}
      </Box>
      <Typography sx={{ color: "white", mt: 1 }} style={{ fontSize: "14px", marginTop: "4px", textAlign: "center" }}>
        {unit}
      </Typography>
    </Grid>
  ))

  return (
    <GridContainer container direction="column" style={{ maxWidth: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", margin: "auto", marginBottom: 2 }}>
        <Timer sx={{ width: 24, height: 24, mr: 2, color: "white" }} />
        <Typography variant="h3" color="white" sx={{ fontWeight: 600, fontSize: 18 }}>
          {timerLabel}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
        {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} unit="Days" />}
        <TimeUnit value={timeLeft.hours} unit="Hours" />
        <TimeUnit value={timeLeft.minutes} unit="Minutes" />
        <TimeUnit value={timeLeft.seconds} unit="Seconds" />
      </Box>
    </GridContainer>
  )
}
