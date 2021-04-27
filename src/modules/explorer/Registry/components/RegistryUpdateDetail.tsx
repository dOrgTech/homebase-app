import { Grid, styled, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { RegistryProposalWithStatus } from "services/bakingBad/proposals/types";

const Detail = styled(Grid)(({ theme }) => ({
  height: 93,
  display: "flex",
  alignItems: "center",
  paddingBottom: 0,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

interface Props {
  proposal: RegistryProposalWithStatus;
}

export const RegistryUpdateDetail: React.FC<Props> = ({ proposal }) => {
  const list = useMemo(() => {
    if (!proposal) {
      return [];
    }

    return proposal.list;
  }, [proposal]);

  return (
    <>
      {list.map(({ key, value }, index) => (
        <Detail item xs={12} key={index}>
          <Grid container direction="row">
            <Grid item xs={2}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                align="center"
              >
                {index + 1}
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle1" color="textSecondary">
                Set {'"'}
                {key}
                {'"'} to {'"'}
                {value}
                {'"'}
              </Typography>
            </Grid>
          </Grid>
        </Detail>
      ))}
    </>
  );
};
