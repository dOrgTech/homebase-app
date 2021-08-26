import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import React, { useState } from "react";
import { ReactComponent as WarningIcon } from "assets/logos/warning.svg";
import CloseIcon from "@material-ui/icons/Close";
import hexToRgba from "hex-to-rgba";

const Container = styled(Box)({
  position: "fixed",
  width: "100%",
  height: 92,
  bottom: 0,
  background: hexToRgba("#FFC839", 0.4),
  boxSizing: "border-box",
  padding: "25px 50px",
  color: "#FFC839",
  zIndex: 20,
});

const ContainerText = styled(Typography)({
  maxWidth: 1160,
});

export const WarningFooter: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && (
        <Container>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            wrap="nowrap"
          >
            <Grid item>
              <WarningIcon fill="#FFC839" />
            </Grid>
            <Grid item>
              <ContainerText align="center" color="inherit">
                {text}
              </ContainerText>
            </Grid>
            <Grid item>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon htmlColor="#FFC839" />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};
