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
  SvgIcon, 
} from "@material-ui/core";
import React from "react";
import { Header } from "./Header";
import HomebaseLogo from "assets/logos/homebase_logo.svg";
import Vector1 from "assets/vectors/Vector1.svg";
import Vector2 from "assets/vectors/Vector2.svg";
import hexToRgba from "hex-to-rgba";
import GitHubIcon from "@material-ui/icons/GitHub";
import { ReactComponent as DiscordIcon } from "assets/logos/discord.svg";

const StyledToolbar = styled(Grid)({
  padding: "22px 37px",
  boxSizing: "border-box",
  height: "86px",
});

const IconContainer = styled("div")({
  height: "27px",
  width: "33px",

  "& > svg": {
    width: "100%",
  },
});

// const AnimatedLogoContainer = withStyles({
//   "@global @keyframes float": {
//     "0%": { transform: "translate(0,  -0px)" },
//     "50%": { transform: "translate(0, -15px)" },
//     "100%": { transform: "translate(0, 0px)" },
//   },
// })(() => {
//   return (
//     <LogoContainer>
//       <BigLogo src={HomebaseLogo} />
//     </LogoContainer>
//   );
// });

const Background = styled(Grid)({
  backgroundImage: `url(${Vector1}), url(${Vector2})`,
  backgroundPosition: "top right, bottom right",
  backgroundRepeat: "no-repeat",
  height: "100vh",
});

const MainContainer = styled(Grid)({
  maxWidth: 970,
  padding: 30,
  boxSizing: "border-box",
  width: "100%",
});

const LogoContainer = styled(Box)(({ theme }) => ({
  width: 408,
  height: 370,

  [theme.breakpoints.down("xs")]: {
    width: 290,
    height: 265,
  },

  // animation: `float 3s infinite ease-in-out`,
}));

const BigLogo = styled("img")({
  width: "100%",
  height: "100%",
});

const TitleText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 40,
  fontWeight: "bold",
}));

const SubtitleText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 300,
}));


// const OutlinedButton = styled(Button)(({ theme }: { theme: Theme }) => ({
//   minHeight: 39,
//   minWidth: 130,
//   padding: "6px 16px",
//   background: "transparent",
//   color: theme.palette.text.primary,
//   borderColor: theme.palette.secondary.main,
//   "&:hover": {
//     backgroundColor: hexToRgba("#81FEB7", 0.24),
//     borderColor: theme.palette.secondary.main,
//   },
// }));

export const Landing: React.FC = () => {
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Background
      container
      direction="column"
      justifyContent="space-between"
      wrap="nowrap"
    >
      {!isExtraSmall && (
        <Grid item>
          <Header />
        </Grid>
      )}
      <Grid item>
        <Grid container justifyContent="center">
          <Grid item>
            <MainContainer item>
              <Grid
                container
                justify="space-between"
                direction={isExtraSmall ? "column-reverse" : "row"}
                style={isExtraSmall ? { gap: 50 } : {}}
              >
                <Grid item xs>
                  <Grid
                    container
                    direction="column"
                    style={{ gap: 32 }}
                    justifyContent="center"
                  >
                    {!isExtraSmall && (
                      <Grid item>
                        <TitleText>Tezos Homebase</TitleText>
                      </Grid>
                    )}

                    <Grid item>
                      <SubtitleText
                        align={isExtraSmall ? "center" : "left"}
                      >
                        Homebase is a web application that enables users to
                        create and manage/use DAOs on the Tezos blockchain. This
                        application aims to help empower community members and
                        developers to launch and participate in Tezos-based DAOs
                      </SubtitleText>
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        style={{ gap: 16 }}
                        wrap="nowrap"
                        justifyContent={isExtraSmall ? "center" : "flex-start"}
                      >
                        <Grid item>
                          <Link href="/explorer" underline="none">
                            <Button variant="contained" color="secondary">Enter App</Button>
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link
                            href="https://github.com/tezos-commons/baseDAO"
                            underline="none"
                          >
                            <Button variant="contained" color="secondary">
                              Learn More
                            </Button>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-end"
                    justify="center"
                    style={{ gap: 20 }}
                  >
                    {isExtraSmall && (
                      <Grid item>
                        <TitleText>Tezos Homebase</TitleText>
                      </Grid>
                    )}
                    <Grid item>
                      <LogoContainer>
                        <BigLogo src={HomebaseLogo} />
                      </LogoContainer>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MainContainer>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <StyledToolbar
          container
          direction="row"
          alignItems="center"
          wrap="wrap"
          justifyContent={isExtraSmall ? "center" : "flex-start"}
          style={{ gap: 25 }}
        >
          <Grid item>
            <Link
              target="_blank"
              href="https://github.com/dOrgTech/homebase-app"
            >
              <IconContainer>
                <GitHubIcon color="secondary" />
              </IconContainer>
            </Link>
          </Grid>
          <Grid item>
            <Link target="_blank" href="https://discord.gg/XufcBNu277">
              <IconContainer>
                <SvgIcon>
                  <DiscordIcon />
                </SvgIcon>
              </IconContainer>
            </Link>
          </Grid>
        </StyledToolbar>
      </Grid>
    </Background>
  );
};
