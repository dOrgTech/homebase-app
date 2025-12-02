import { styled, Button as MaterialButton } from "@material-ui/core"

export const ApproveButton = styled(MaterialButton)(({ theme }) => ({
  "fontSize": "14px",
  "justifyItems": "center",
  "color": "#000",
  "boxShadow": "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
  "transition": ".15s ease-in",
  "background": "rgb(113, 214, 156)",
  "textTransform": "none",
  "borderRadius": 4,
  "padding": "8px 15px",
  "marginRight": "8px",

  "&$disabled": {
    boxShadow: "none"
  },

  "&:hover": {
    boxShadow: "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#8ee0b1 !important",
    transition: ".15s ease-in"
  },

  ["@media (max-width:1030px)"]: {
    fontSize: "14px"
  }
}))

export const RejectButton = styled(MaterialButton)(({ theme }) => ({
  "fontSize": "14px",
  "justifyItems": "center",
  "color": "#000",
  "boxShadow": "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
  "transition": ".15s ease-in",
  "background": "#ff0000",
  "textTransform": "none",
  "borderRadius": 4,
  "padding": "8px 15px",
  "marginRight": "8px",

  "&$disabled": {
    boxShadow: "none"
  },

  "&:hover": {
    boxShadow: "0px 0px 7px -2px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ff4d4d !important",
    transition: ".15s ease-in"
  },

  ["@media (max-width:1030px)"]: {
    fontSize: "14px"
  }
}))
