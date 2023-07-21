import React from "react"
import { styled, Grid } from "@material-ui/core"
import { ViewButton, ViewButtonProps } from "./ViewButton"
import { MainButton } from "modules/common/MainButton"

const SendContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    height: 100
  }
}))

const StyledSendButton = styled(MainButton)(({ theme }) => ({
  width: 96,
  color: "#1C1F23",
  height: 40
}))

export const SendButton: React.FC<ViewButtonProps> = ({ children, ...props }) => {
  return (
    <SendContainer container direction="row" justifyContent="center" alignItems="center">
      <StyledSendButton {...props}>{children}</StyledSendButton>
    </SendContainer>
  )
}
