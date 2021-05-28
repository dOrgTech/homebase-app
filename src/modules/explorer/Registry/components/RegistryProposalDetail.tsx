import {
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge";
import { TransferBadge } from "modules/explorer/Treasury/components/TransferBadge";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  FA2Transfer,
  RegistryProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { mutezToXtz } from "services/contracts/utils";

const Container = styled(Grid)({
  paddingTop: 21,
});

interface Props {
  proposal: RegistryProposalWithStatus;
}

export const RegistryProposalDetail: React.FC<Props> = ({ proposal }) => {
  const theme = useTheme();
  const { id: daoId } =
    useParams<{
      proposalId: string;
      id: string;
    }>();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: holdings } = useDAOHoldings(daoId);

  const list = useMemo(() => {
    if (!proposal) {
      return [];
    }

    return proposal.list;
  }, [proposal]);

  const transfers = useMemo(() => {
    if (!holdings || !proposal || !proposal.transfers) {
      return [];
    }

    return proposal.transfers.map((transfer) => {
      if (transfer.type === "XTZ") {
        return {
          ...transfer,
          amount: mutezToXtz(transfer.amount),
        };
      }

      const fa2Transfer = transfer as FA2Transfer;

      const decimal = (
        holdings.find(
          (holding) =>
            holding.contract.toLowerCase() ===
            fa2Transfer.contractAddress.toLowerCase()
        ) as DAOHolding
      ).decimals;

      return {
        ...transfer,
        amount: (Number(transfer.amount) / 10 ** decimal).toString(),
      };
    });
  }, [holdings, proposal]);

  return (
    <>
      {transfers.map((transfer, index) => {
        return (
          <Container
            key={index}
            item
            container
            alignItems="center"
            direction={isMobileSmall ? "column" : "row"}
          >
            {transfer.type === "XTZ" ? (
              <TransferBadge
                amount={transfer.amount}
                address={transfer.beneficiary}
                currency={"XTZ"}
                long={true}
              />
            ) : (
              <TransferBadge
                amount={transfer.amount}
                address={transfer.beneficiary}
                contract={(transfer as FA2Transfer).contractAddress}
                tokenId={(transfer as FA2Transfer).tokenId}
                long={true}
              />
            )}
          </Container>
        );
      })}
      {list.map(({ key, value }, index) => (
        <Container
          key={index}
          item
          container
          alignItems="center"
          direction={isMobileSmall ? "column" : "row"}
        >
          <HighlightedBadge
            justify="center"
            alignItems="center"
            direction="row"
            container
          >
            <Grid item>
              <Typography variant="body1" color="textSecondary">
                Set &quot;{key}&quot; to &quot;{value}&quot;
              </Typography>
            </Grid>
          </HighlightedBadge>
        </Container>
      ))}
    </>
  );
};
