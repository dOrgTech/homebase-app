import { Box, Grid, Typography, styled } from "@material-ui/core"
import React from "react"

const chartColor = ["#FFC2CF", "#FFC839", "#62CEAE", "#DB6C6C", "#56CAE3", "#E99571", "#FF486E", "#3866F9", "#81FEB7"]

const LinearChartContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: 4,
  display: "flex",
  alignItems: "stretch",
  justifyContent: "flex-start",
  borderRadius: 2,
  overflow: "hidden",
  marginTop: 30
})

const Line = styled(Box)(({ width, color }: { width: number; color: string }) => ({
  width: `${width}%`,
  backgroundColor: color
}))

const Dot = styled(Box)(({ color }: { color: string }) => ({
  width: 10,
  height: 10,
  backgroundColor: color,
  borderRadius: "50%",
  display: "inline-block"
}))

export const LinearChart: React.FC<{ items: { name: string; votes: number; percent: number }[] }> = ({ items }) => {
  return (
    <Grid container>
      <Grid item>
        <Grid container style={{ gap: 28 }}>
          {items.map((item, index) => (
            <Grid item key={item.name}>
              <Grid container alignItems={"center"} style={{ gap: 10 }}>
                <Dot color={chartColor[index]} />
                <Typography variant="body2" color={"textSecondary"}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                  {item.votes}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <LinearChartContainer>
        {items.map((item, index) => (
          <Line width={item.percent} color={chartColor[index]} key={index} />
        ))}
      </LinearChartContainer>
    </Grid>
  )
}
