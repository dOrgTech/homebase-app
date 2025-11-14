import { Grid, Timer, Box, Typography } from "components/ui"
import dayjs from "dayjs"
import React, { useContext, useEffect, useState } from "react"
import { EtherlinkContext } from "services/wagmi/context"
import { GridContainer } from "modules/common/GridContainer"
import { styled } from "@material-ui/core"

const TimeUnitBox = styled(Box)({
  fontSize: "24px",
  fontFamily: "monospace",
  fontWeight: "bold",
  borderRadius: 4,
  boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
  padding: "8px 16px",
  minWidth: "80px",
  textAlign: "center",
  ["@media (max-width: 425px)"]: {
    fontSize: "18px",
    padding: "6px 12px",
    minWidth: "60px"
  }
})

const TimeUnitLabel = styled(Typography)({
  color: "white",
  fontSize: "14px",
  marginTop: "4px",
  textAlign: "center",
  ["@media (max-width: 425px)"]: {
    fontSize: "12px"
  }
})

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const EvmProposalCountdown = ({
  overrideLabel,
  overrideTarget
}: {
  overrideLabel?: string
  overrideTarget?: any
} = {}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const { daoProposalSelected } = useContext(EtherlinkContext)
  const timerLabel = overrideLabel ?? daoProposalSelected?.timerLabel
  const timerTargetDate = overrideTarget ?? daoProposalSelected?.timerTargetDate

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
      style={{
        marginRight: 20,
        backgroundColor: "#222",
        borderRadius: 8,
        paddingBottom: 8,
        paddingTop: 8,
        minWidth: 0,
        flex: "0 1 auto"
      }}
    >
      <TimeUnitBox>{value.toString().padStart(2, "0")}</TimeUnitBox>
      <TimeUnitLabel>{unit}</TimeUnitLabel>
    </Grid>
  ))

  return (
    <GridContainer container direction="column" style={{ maxWidth: "100%" }}>
      <Box style={{ display: "flex", alignItems: "center", margin: "auto", marginBottom: 16 }}>
        <Timer style={{ width: 24, height: 24, marginRight: 8, color: "white" }} />
        <Typography variant="h3" style={{ fontWeight: 600, fontSize: 18, color: "white" }}>
          {timerLabel}
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >
        {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} unit="Days" />}
        <TimeUnit value={timeLeft.hours} unit="Hours" />
        <TimeUnit value={timeLeft.minutes} unit="Minutes" />
        <TimeUnit value={timeLeft.seconds} unit="Seconds" />
      </Box>
    </GridContainer>
  )
}
