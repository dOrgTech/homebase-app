import { styled, Grid, Typography, Paper } from "@material-ui/core";
import React from "react";

import { NavigationBarProps } from "modules/creator/state";

const Footer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  justifyContent: "flex-end",
}));

const BackButton = styled(Paper)({
  boxShadow: "none",
  width: "121px",
  height: 31,
  background: "inherit",
  color: "#fff",
  textAlign: "center",
  marginLeft: "4%",
  paddingTop: "1%",
  cursor: "pointer",
});

const NextButton = styled(Paper)({
  boxShadow: "none",
  minWidth: "121px",
  height: 31,
  borderRadius: 21,
  textAlign: "center",
  paddingTop: "1%",
  background: "inherit",
  float: "right",
  marginRight: "4%",
  cursor: "pointer",
  paddingLeft: "3%",
  paddingRight: "3%",
});

const FooterContainer = styled(Grid)({
  flexGrow: 0,
  maxWidth: "calc(75% + 2px)",
  minHeight: 75,
  borderTop: "2px solid rgb(61, 61, 61)",
  borderLeft: "2px solid rgb(61, 61, 61)",
  padding: 0,
  margin: 0,
  height: "100%",
});

export const NavigationBar: React.FC<NavigationBarProps> = ({ back, next }) => {
  return (
    <Footer
      container
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <FooterContainer item xs={12} container alignItems="center">
        <Grid item xs={6}>
          {back && (
            <BackButton onClick={back.handler}>
              <Typography>{back.text}</Typography>
            </BackButton>
          )}
        </Grid>
        <Grid item xs={6}>
          {next && (
            <NextButton onClick={next.handler}>
              <Typography color="secondary">{next.text}</Typography>
            </NextButton>
          )}
        </Grid>
      </FooterContainer>
    </Footer>
  );
};
