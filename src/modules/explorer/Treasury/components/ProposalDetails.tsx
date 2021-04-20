import React, { useMemo } from "react";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { FA2Transfer, TreasuryProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { ProposalDetails } from "modules/explorer/components/ProposalDetails";
import { TransferBadge } from "./TransferBadge";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { mutezToXtz } from "services/contracts/utils";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";

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
  const { data: holdings } = useDAOHoldings(daoId)

  const transfers = useMemo(() => {
    if(!holdings || !proposal || !proposal.transfers) {
      return []
    }

    return proposal.transfers.map(transfer => {
      if(transfer.type === "XTZ") {
        return {
          ...transfer,
          amount: mutezToXtz(transfer.amount)
        }
      }

      const fa2Transfer = transfer as FA2Transfer

      const decimal = (holdings.find(holding => holding.contract.toLowerCase() === fa2Transfer.contractAddress.toLowerCase()) as DAOHolding).decimals

      return {
      ...transfer,
      amount: (Number(transfer.amount) / (10 ** decimal)).toString()
    }
  })
  }, [holdings, proposal])

  return (
    <ProposalDetails>
      {transfers.map((transfer, index) => {
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
      })}
    </ProposalDetails>
  );
};
