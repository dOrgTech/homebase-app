import { TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

export const StyledTextField = styled(TextField)({
  "& .MuiInput-root": {
    color: "#fff",
    paddingBottom: "4px"
  },
  "& label": {
    color: "#fff"
  },
  "& label.Mui-focused": {
    color: "#fff"
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "#ccc"
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#fff"
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#fff"
    },
    "&:hover fieldset": {
      borderColor: "#fff"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff"
    }
  }
})
