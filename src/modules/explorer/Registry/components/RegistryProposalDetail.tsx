import {
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import BigNumber from "bignumber.js";
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge";
import { useDAOID } from "modules/explorer/daoRouter";
import { TransferBadge } from "modules/explorer/Treasury/components/TransferBadge";
import React, { useMemo } from "react";
import { DAOHolding } from "services/bakingBad/tokenBalances/types";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { mutezToXtz } from "services/contracts/utils";
import {
  FA2Transfer,
  RegistryProposal,
} from "services/indexer/dao/mappers/proposal/types";

const Container = styled(Grid)({
  paddingTop: 21,
});

const DetailsText = styled(Typography)({
  wordBreak: "break-all",
});

interface Props {
  proposal: RegistryProposal;
}

export const RegistryProposalDetail: React.FC<Props> = ({ proposal }) => {
  const theme = useTheme();
  const daoId = useDAOID();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: holdings } = useDAOHoldings(daoId);

  const list = useMemo(() => {
    if (!proposal) {
      return [];
    }

    return proposal.metadata.list;
  }, [proposal]);

  const transfers = useMemo(() => {
    if (!holdings || !proposal || !proposal.metadata.transfers) {
      return [];
    }

    return proposal.metadata.transfers.map((transfer) => {
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
        amount: new BigNumber(transfer.amount, decimal),
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
              />
            ) : (
              <TransferBadge
                amount={transfer.amount}
                address={transfer.beneficiary}
                contract={(transfer as FA2Transfer).contractAddress}
                tokenId={(transfer as FA2Transfer).tokenId}
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
              <DetailsText variant="body1" color="textSecondary">
                Set &quot;{key}&quot; to &quot;{value}&quot;
              </DetailsText>
            </Grid>
          </HighlightedBadge>
        </Container>
      ))}
    </>
  );
};
