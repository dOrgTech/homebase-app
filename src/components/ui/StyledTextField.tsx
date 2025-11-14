import { TextField } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"

export const StyledTextField = styled(TextField)({
  "& .MuiInput-root": {
    color: "#fff",
    paddingBottom: "4px"
  },
  "& .MuiInputBase-input": {
    textAlign: "left"
  },
  "& .MuiInputBase-inputMultiline": {
    textAlign: "left"
  },
  "& label": {
    color: "#fff"
  },
  "& label.Mui-focused": {
    color: "#fff"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#fff"
  },
  "& .MuiOutlinedInput-root": {
    "color": "#fff",
    "& fieldset": {
      borderColor: "#fff"
    },
    "&:hover fieldset": {
      borderColor: "#fff"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff"
    }
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)"
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "#ccc"
  }
})
