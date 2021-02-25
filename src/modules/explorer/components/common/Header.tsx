import React from "react";
import { Grid, styled, Typography, withTheme } from "@material-ui/core";
import { NewTreasuryProposalDialog } from "modules/explorer/components/Treasury";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  height: 104,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
}));

const JustifyEndGrid = styled(Grid)({
  textAlign: "end",
});

export const Header: React.FC<{
  name: string;
}> = ({ name }) => {
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
        <NewTreasuryProposalDialog />
      </JustifyEndGrid>
    </StyledContainer>
  );
};
