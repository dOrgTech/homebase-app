import {
  Box,
  Button,
  Grid,
  styled,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Header } from "./Header";
import HomebaseLogo from "assets/logos/homebase_logo.svg";
import Vector1 from "assets/vectors/Vector1.svg";
import Vector2 from "assets/vectors/Vector2.svg";
import hexToRgba from "hex-to-rgba";

const Background = styled(Box)({
  backgroundImage: `url(${Vector1}), url(${Vector2})`,
  backgroundPosition: "top right, bottom right",
  backgroundRepeat: "no-repeat",
});

const MainContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  "-webkit-transform": "translate(-50%, -50%)",
  transform: "translate(-50%, -50%)",
});

const BigLogo = styled("img")({
  width: 460,
  height: 417,
});

const TitleText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 40,
  letterSpacing: "-0.01em",
  fontWeight: "bold",
}));

const FullButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  minHeight: 39,
  minWidth: 139,
  background: theme.palette.secondary.main,
  color: theme.palette.text.secondary,
  borderColor: hexToRgba(theme.palette.secondary.main, 0.23),
  "&:hover": {
    backgroundColor: hexToRgba(theme.palette.secondary.main, 0.24),
    borderColor: theme.palette.secondary.main,
  },
}));

const OutlinedButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  minHeight: 39,
  minWidth: 139,
  background: "transparent",
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: hexToRgba(theme.palette.secondary.main, 0.24),
    borderColor: theme.palette.secondary.main,
  },
}));

export const Landing: React.FC = () => {
  return (
    <>
      <Background height="100vh" width="100vw">
        <Header />
        <MainContainer>
          <Grid container spacing={5}>
            <Grid item xs={12} md={7}>
              <Grid
                container
                direction="column"
                spacing={4}
                justifyContent="center"
              >
                <Grid item>
                  <TitleText>Homebase</TitleText>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" color="textSecondary">
                    The TezDAO was founded as a partnership between some of the
                    most known Tezos Influencers. The purpose of this DAO is to
                    manage a treasury of funds to further the organization’s
                    goals.
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <FullButton>Enter App</FullButton>
                    </Grid>
                    <Grid item>
                      <OutlinedButton variant="outlined">
                        Learn More
                      </OutlinedButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <BigLogo src={HomebaseLogo} />
            </Grid>
          </Grid>
        </MainContainer>
      </Background>
    </>
  );
};
