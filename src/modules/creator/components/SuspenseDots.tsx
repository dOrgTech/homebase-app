import React from "react"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  "firstDot": {
    animation: "$firstDot 2s linear infinite"
  },
  "secondDot": {
    animation: "$secondDot 2s linear infinite"
  },
  "threeDot": {
    animation: "$thirdDot 2s linear infinite"
  },
  "@keyframes firstDot": {
    "0%": {
      opacity: 1
    },
    "65%": {
      opacity: 1
    },
    "66%": {
      opacity: 0
    },
    "100%": {
      opacity: 0
    }
  },
  "@keyframes secondDot": {
    "0%": {
      opacity: 0
    },
    "21%": {
      opacity: 0
    },
    "22%": {
      opacity: 1
    },
    "65%": {
      opacity: 1
    },
    "66%": {
      opacity: 0
    },
    "100%": {
      opacity: 0
    }
  },
  "@keyframes thirdDot": {
    "0%": {
      opacity: 0
    },
    "43%": {
      opacity: 0
    },
    "44%": {
      opacity: 1
    },
    "65%": {
      opacity: 1
    },
    "66%": {
      opacity: 0
    },
    "100%": {
      opacity: 0
    }
  }
})

export const SuspenseDots = () => {
  const classes = useStyles()

  return (
    <>
      <span className={classes.firstDot}>.</span>
      <span className={classes.secondDot}>.</span>
      <span className={classes.threeDot}>.</span>
    </>
  )
}
