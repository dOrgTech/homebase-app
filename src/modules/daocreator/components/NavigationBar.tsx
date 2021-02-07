import { styled, Grid, Typography, Paper } from "@material-ui/core";
import React from "react";
import { NavigationBarProps } from "../state/types";

const Footer = styled(Grid)(({ theme }) => ({
  boxShadow: "none",
  background: theme.palette.primary.main,
  height: "inherit",
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
  maxWidth: "75.13vw",
  paddingTop: "1%",
  paddingBottom: "1%",
  borderTop: "2px solid rgb(61, 61, 61)",
  borderLeft: "2px solid rgb(61, 61, 61)",
  padding: 0,
  margin: 0,
  height: "inherit",
})

export const NavigationBar: React.FC<NavigationBarProps> = ({ back, next }) => {
  return (
    <Footer
      container
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <FooterContainer item xs={12}>
        <Grid item container>
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
        </Grid>
      </FooterContainer>

    </Footer>
  );
};
