import { Button, Grid, styled, Typography, withTheme } from "@material-ui/core";
import React from "react";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  height: 184,
  paddingLeft: "6%",
  paddingRight: "6%",
  paddingTop: "4%",
  boxSizing: "border-box",
}));

const StyledButton = styled(withTheme(Button))((props) => ({
  height: 53,
  color: props.theme.palette.text.secondary,
  borderColor: props.theme.palette.secondary.main,
  minWidth: 171,
}));

const JustifyEndGrid = styled(withTheme(Grid))((props) => ({
  textAlign: "end",
}));

export const Header: React.FC<{
  symbol: string;
  name: string;
  buttonLabel: string;
}> = ({ symbol, name, buttonLabel }) => {
  return (
    <StyledContainer container direction="row">
      <Grid item xs={6}>
        <Typography variant="subtitle1" color="secondary">
          {symbol}
        </Typography>
        <Typography variant="h4" color="textSecondary">
          {name}
        </Typography>
      </Grid>
      <JustifyEndGrid item xs={6}>
        <StyledButton variant="outlined">{buttonLabel}</StyledButton>
      </JustifyEndGrid>
    </StyledContainer>
  );
};
