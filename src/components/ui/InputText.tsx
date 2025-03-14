import { withStyles } from "@material-ui/core"
import { TextField } from "@mui/material"

const InputText = withStyles(theme => ({
  root: {
    "& .MuiInputBase-root": {
      height: 54,
      boxSizing: "border-box",
      background: "#333333",
      borderRadius: 8,
      padding: "13px 23px",
      fontWeight: 300,
      color: "#ffffff",
      fontSize: 18,
      fontFamily: "Roboto Flex"
    },
    "& .MuiInputBase-input": {
      "padding": 0,
      "&::placeholder": {
        fontWeight: 300,
        opacity: 1
      }
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none"
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none"
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none"
    }
  }
}))(TextField)

export default InputText
