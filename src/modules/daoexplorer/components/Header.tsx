import React from "react";
import { Button, Grid, styled, Typography, withTheme } from "@material-ui/core";

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

const JustifyEndGrid = styled(Grid)({
  textAlign: "end",
});

export const Header: React.FC<{
  name: string;
  buttonLabel: string;
}> = ({ name, buttonLabel }) => {
  return (
    <StyledContainer container direction="row">
      <Grid item xs={6}>
        <Typography variant="subtitle1" color="secondary">
          {name}
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Treasury
        </Typography>
      </Grid>
      <JustifyEndGrid item xs={6}>
        <StyledButton variant="outlined">{buttonLabel}</StyledButton>
      </JustifyEndGrid>
    </StyledContainer>
  );
};
