import { styled, Button } from "@material-ui/core"

export const SmallButton = styled(Button)(({ theme }) => ({
  "justifyItems": "center",
  "fontSize": "16px",
  "boxShadow": "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
  "padding": "3px 14px",
  "lineHeight": "1.75 !important",
  "transition": ".15s ease-out",
  "background": theme.palette.secondary.main,

  "&$disabled": {
    boxShadow: "none"
  },

  "&:hover": {
    boxShadow: "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#62eda5 !important",
    transition: ".15s ease-in"
  }
}))
