import { withStyles } from "@material-ui/core"
import { TextField } from "@material-ui/core"

const InputText = withStyles(theme => ({
  root: {
    "& .MuiInputBase-root": {
      height: 54,
      boxSizing: "border-box",
      background: "#2F3438",
      borderRadius: 8,
      border: "1px solid rgba(255, 255, 255, 0.12)",
      padding: "13px 23px",
      fontWeight: 300,
      color: "#ffffff",
      fontSize: 18,
      fontFamily: "Roboto Flex"
    },
    "& .MuiInputBase-root.Mui-focused": {
      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.16)"
    },
    "& .MuiInputBase-input": {
      "padding": 0,
      "textAlign": "center",
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
