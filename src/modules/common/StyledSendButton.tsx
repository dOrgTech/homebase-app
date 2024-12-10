import { styled } from "@material-ui/core"
import { MainButton } from "./MainButton"

const StyledSendButton = styled(MainButton)(({ theme }) => ({
  "width": 101,
  "color": "#1C1F23",
  "&$disabled": {
    opacity: 0.5,
    boxShadow: "none",
    cursor: "not-allowed"
  }
}))

export { StyledSendButton }
