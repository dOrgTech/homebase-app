import React from "react";
import { styled, Grid } from "@material-ui/core";
import { ViewButton, ViewButtonProps } from "./ViewButton";

const SendContainer = styled(Grid)(({ theme }) => ({
  height: 80,
  [theme.breakpoints.down("sm")]: {
    height: 100,
  },
}));

const StyledSendButton = styled(ViewButton)(({ theme }) => ({
  width: 229,
  border: "1px",
  background: theme.palette.secondary.main,
  borderRadius: 4,
  color: theme.palette.text.secondary,
}));

export const SendButton: React.FC<ViewButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <SendContainer
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <StyledSendButton {...props}>{children}</StyledSendButton>
    </SendContainer>
  );
};
