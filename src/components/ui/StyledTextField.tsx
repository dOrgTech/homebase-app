import { TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

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
  "& .MuiInput-root:after": {
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
  "& .MuiInput-root:before": {
    borderBottomColor: "#ccc"
  }
})
