import { styled, Button as MaterialButton } from "@material-ui/core"

export const Button = styled(MaterialButton)(({ theme }) => ({
  "fontSize": "14px",
  "justifyItems": "center",
  "color": "#000",
  "boxShadow": "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
  "transition": ".15s ease-in",
  "background": theme.palette.secondary.main,
  "textTransform": "none",
  "borderRadius": 4,
  "padding": "8px 15px",
  "marginRight": "8px",

  "&$disabled": {
    boxShadow: "none"
  },

  "&:hover": {
    boxShadow: "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#62eda5 !important",
    transition: ".15s ease-in"
  },

  ["@media (max-width:1030px)"]: {
    fontSize: "14px"
  }
}))
