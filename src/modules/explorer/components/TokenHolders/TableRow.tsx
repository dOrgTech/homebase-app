import React from "react";
import { styled, Grid, Typography, Avatar } from "@material-ui/core";

export interface TokenHoldersRowData {
  username: string;
  votes: string;
  weight: string;
  proposals_voted: number;
  index: number;
}

const ProposalTableRowContainer = styled(Grid)(({ theme }) => ({
  height: 155,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  cursor: "pointer",
}));

const Username = styled(Typography)({
  marginLeft: 15,
});

export const TopHoldersTableRow: React.FC<TokenHoldersRowData> = ({
  username,
  votes,
  weight,
  proposals_voted,
  index,
}) => {
  return (
    <ProposalTableRowContainer item container alignItems="center">
      <Grid item xs={5}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={2}>
            <Typography variant="body1" color="textSecondary">
              {index + 1}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Grid container direction="row" alignItems="center">
              <Avatar>{""}</Avatar>
              <Username variant="body1" color="textSecondary">
                {username}
              </Username>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body1" color="textSecondary">
          {votes}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1" color="textSecondary">
          {weight}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body1" color="textSecondary">
          {proposals_voted}
        </Typography>
      </Grid>
    </ProposalTableRowContainer>
  );
};
