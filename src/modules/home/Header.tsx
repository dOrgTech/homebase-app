import {
  AppBar,
  Box,
  Button,
  Grid,
  Link,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/styles";
import HomeButton from "assets/logos/homebase_logo.svg";
import hexToRgba from "hex-to-rgba";
import React from "react";

const StyledAppBar = styled(AppBar)({
  boxShadow: "none",
});

const LogoItem = styled("img")({
  cursor: "pointer",
  paddingTop: 8,
});

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  cursor: "pointer",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  padding: "22px 37px",
  boxSizing: "border-box",
  justifyContent: "space-between",
  flexWrap: "wrap",
});

const HeaderButton = styled(Button)(({ theme }: { theme: Theme }) => ({
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

export const Header: React.FC = () => {
  return (
    <StyledAppBar position="sticky" color="transparent">
      <StyledToolbar>
        <Grid
          container
          direction="row"
          alignItems="center"
          wrap="wrap"
          spacing={4}
          justify="space-between"
        >
          <Grid item>
            <Link href="/landing">
              <Grid container alignItems="center" wrap="nowrap">
                <Grid item>
                  <LogoItem src={HomeButton} />
                </Grid>
                <Grid item>
                  <Box paddingLeft="10px">
                    <LogoText color="textSecondary">Homebase</LogoText>
                  </Box>
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid>
            <Link href="/explorer" underline="none">
              <HeaderButton>ENTER APP</HeaderButton>
            </Link>
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledAppBar>
  );
};
