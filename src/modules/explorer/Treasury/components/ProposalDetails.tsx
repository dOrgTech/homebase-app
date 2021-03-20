import React from "react";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { TreasuryProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { mutezToXtz, toShortAddress } from "services/contracts/utils";
import { ProposalDetails } from "modules/explorer/components/ProposalDetails";
import { TransferBadge } from "./TransferBadge";

const Container = styled(Grid)({
  paddingTop: 21,
});

export const TreasuryProposalDetails = () => {
  const { proposalId, id: daoId } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as TreasuryProposalWithStatus | undefined;
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const transfers = useMemo(() => {
    if (!proposal || !proposal.transfers) {
      return [];
    }

    return proposal.transfers.map((transfer) => {
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

      return {
        value,
        to,
        currency,
      };
    });
  }, [proposal, daoId]);

  return (
    <ProposalDetails>
      {transfers.map(({ value, to, currency }, index) => {
        return (
          <Container
            item
            key={index}
            container
            alignItems="center"
            direction={isMobileSmall ? "column" : "row"}
          >
            <TransferBadge amount={value} address={to} currency={currency} />
          </Container>
        );
      })}
    </ProposalDetails>
  );
};
