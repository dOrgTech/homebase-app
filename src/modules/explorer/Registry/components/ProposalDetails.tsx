import { styled, Grid, Typography } from "@material-ui/core";
import { ProposalDetails } from "modules/explorer/components/ProposalDetails";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { RegistryProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";

const Detail = styled(Grid)(({ theme }) => ({
  height: 93,
  display: "flex",
  alignItems: "center",
  paddingBottom: 0,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

export const RegistryProposalDetails = () => {
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
    <ProposalDetails>
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
    </ProposalDetails>
  );
};
