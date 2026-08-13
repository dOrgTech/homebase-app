import { styled, Button } from "@mui/material"

export const SmallButton = styled(Button)({
  "justifyItems": "center",
  "fontSize": "16px",
  "boxShadow": "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
  "transition": ".15s ease-out",
  "textTransform": "capitalize",
  "borderRadius": 8,
  "backgroundColor": "#81feb7",
  "color": "#1c1f23",
  "padding": "8px 16px",

  "&.Mui-disabled": {
    boxShadow: "none",
    backgroundColor: "#474E55",
    color: "#7d8c8b"
  },

  "&:hover": {
    boxShadow: "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#62eda5",
    transition: ".15s ease-in"
  }
})

export const SmallButtonDialog = styled(Button)({
  "justifyItems": "center",
  "fontSize": "16px",
  "boxShadow": "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
  "transition": ".15s ease-out",
  "textTransform": "capitalize",
  "borderRadius": 8,
  "backgroundColor": "#81feb7",
  "color": "#1c1f23",
  "padding": "8px 16px",

  "&.Mui-disabled": {
    boxShadow: "none",
    backgroundColor: "#474E55",
    color: "#7d8c8b",
    border: "none"
  },

  "&:hover": {
    boxShadow: "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#62eda5",
    transition: ".15s ease-in"
  }
})
