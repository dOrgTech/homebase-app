import { styled, Button } from "@material-ui/core"

export const MainButton = styled(Button)(({ theme }) => ({
  "fontSize": "18px",
  "justifyItems": "center",
  "boxShadow": "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
  "transition": ".15s ease-in",
  "background": theme.palette.secondary.main,
  "textTransform": "none",
  "borderRadius": 8,

  "&$disabled": {
    boxShadow: "none"
  },

  "&:hover": {
    boxShadow: "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#62eda5 !important",
    transition: ".15s ease-in"
  },

  ["@media (max-width:1030px)"]: {
    fontSize: "16px"
  }
}))
