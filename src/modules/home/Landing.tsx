import {
  Box,
  Button,
  Grid,
  Link,
  styled,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
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

const MainContainer = styled(Grid)(({ theme }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  "-webkit-transform": "translate(-50%, -50%)",
  transform: "translate(-50%, -50%)",
  maxWidth: 970,
  padding: 30,
  boxSizing: "border-box",
  width: "100%",

  [theme.breakpoints.down("xs")]: {
    height: "100vh",
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: 408,
  height: 370,

  [theme.breakpoints.down("xs")]: {
    width: 290,
    height: 265,
  },
}));

const BigLogo = styled("img")({
  width: "100%",
  height: "100%",
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
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Background height="100vh" width="100vw">
      {!isExtraSmall && <Header />}
      <MainContainer>
        <Grid
          container
          justify="space-between"
          direction={isExtraSmall ? "column" : "row"}
          style={isExtraSmall ? { height: "100%" } : {}}
        >
          <Grid item xs>
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
                  Homebase is a web application that enables users to create and
                  manage/use DAOs on the Tezos blockchain. This application aims
                  to help empower community members and developers to launch and
                  participate in Tezos-based DAOs
                </Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Link href="/explorer" underline="none">
                      <FullButton>Enter App</FullButton>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href="https://github.com/tezos-commons/baseDAO"
                      underline="none"
                    >
                      <OutlinedButton variant="outlined">
                        Learn More
                      </OutlinedButton>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid container justify="center">
              <Grid item>
                <LogoContainer>
                  <BigLogo src={HomebaseLogo} />
                </LogoContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainContainer>
    </Background>
  );
};
