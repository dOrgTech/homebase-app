import React from "react";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { FA2Transfer, TreasuryProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
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

  return (
    <ProposalDetails>
      {proposal && proposal.transfers? proposal.transfers.map((transfer, index) => {
        return (
            <Container
              item
              key={index}
              container
              alignItems="center"
              direction={isMobileSmall ? "column" : "row"}
            >
              {
                transfer.type === "XTZ"? (
                <TransferBadge
                  amount={transfer.amount}
                  address={transfer.beneficiary}
                  currency={'XTZ'}
                  long={true}
                />): (
                  <TransferBadge
                    amount={transfer.amount}
                    address={transfer.beneficiary}
                    contract={(transfer as FA2Transfer).contractAddress}
                    long={true}
                  />)
              }
              
            </Container>
        )
      }): null}
    </ProposalDetails>
  );
};
