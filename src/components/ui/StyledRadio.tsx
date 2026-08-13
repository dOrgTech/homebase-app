import { Radio } from "@mui/material"

import withStyles from "@mui/styles/withStyles"

export const StyledRadio = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  checked: {},
  colorSecondary: {
    "&$checked": {
      color: "#81FEB7"
    }
  }
})(Radio)
