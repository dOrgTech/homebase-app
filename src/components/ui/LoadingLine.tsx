import React from "react"
import { makeStyles, Theme } from "@material-ui/core/styles"

interface LoadingLineProps {
  color?: string
  height?: number
  barWidth?: number
}

const useStyles = makeStyles((theme: Theme) => ({
  "root": {
    width: "100%",
    backgroundColor: theme.palette.grey[200],
    position: "relative",
    overflow: "hidden"
  },
  "bar": {
    height: "100%",
    position: "absolute",
    animation: "$loadingLine 1s infinite linear"
  },
  "@keyframes loadingLine": {
    "0%": {
      transform: "translateX(-100%)"
    },
    "100%": {
      transform: "translateX(400%)"
    }
  }
}))

export const LoadingLine: React.FC<LoadingLineProps> = ({
  color = "#3f51b5", // Default Material-UI primary color
  height = 2,
  barWidth = 30
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root} style={{ height: `${height}px` }}>
      <div
        className={classes.bar}
        style={{
          width: `${barWidth}%`,
          left: `-${barWidth}%`,
          backgroundColor: color
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading..."
      />
    </div>
  )
}
