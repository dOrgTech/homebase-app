import { styled, Grid, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { RegistryProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";

const BoxItem = styled(Grid)(({ theme }) => ({
  paddingBottom: 24,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const Detail = styled(Grid)(({ theme }) => ({
  height: 93,
  display: "flex",
  alignItems: "center",
  paddingBottom: 0,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

export const ProposalDetails = () => {
  const { proposalId, id: daoId } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as RegistryProposalWithStatus | undefined;

  const list = useMemo(() => {
    if (!proposal) {
      return [];
    }

    return proposal.list;
  }, [proposal]);

  return (
    <Grid item xs={6}>
      <Grid container direction="row">
        <BoxItem item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            DETAILS
          </Typography>
        </BoxItem>

        {list.map(({ key, value }, index) => {
          return (
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
          );
        })}
      </Grid>
    </Grid>
  );
};
