import React from "react";
import { Grid, Typography, styled } from "@material-ui/core";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { TreasuryProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { mutezToXtz, toShortAddress } from "services/contracts/utils";

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
  const proposal = proposalData as TreasuryProposalWithStatus | undefined;

  const transfers = useMemo(() => {
    if (!proposal || !proposal.transfers) {
      return [];
    }

    return proposal.transfers.map((transfer) => {
      //TODO: can the from be different?
      const from = "DAO's treasury";

      const to =
        transfer.beneficiary.toLowerCase() === daoId.toLowerCase()
          ? "DAO's treasury"
          : toShortAddress(transfer.beneficiary);

      const currency =
        transfer.currency === "mutez" ? "XTZ" : transfer.currency;

      const value =
        transfer.currency === "mutez"
          ? mutezToXtz(transfer.amount)
          : transfer.amount;

      return `Transfer ${value}${currency} from ${from} to ${to}`;
    });
  }, [proposal, daoId]);

  return (
    <Grid item xs={12} sm={6} style={{ paddingBottom: 40 }}>
      <Grid container direction="row">
        <BoxItem item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            DETAILS
          </Typography>
        </BoxItem>

        {transfers.map((item, index) => {
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
                    {item}
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
