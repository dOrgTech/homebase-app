import { Radio, withStyles } from "@material-ui/core"

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
