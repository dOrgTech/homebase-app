import React from "react";
import {
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import { TreasuryHistoryRow } from "./HistoryRow";
import { ProposalTableHeadText } from "./TableHeader";
import { useTransfers } from "services/contracts/baseDAO/hooks/useTransfers";
import { useDAOID } from "modules/explorer/daoRouter";

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

export const HistoryTable: React.FC = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const daoId = useDAOID();
  const { data: transfers } = useTransfers(daoId);

  return (
    <ResponsiveGenericTable>
      {!isMobileSmall && (
        <TableHeader
          item
          container
          wrap="nowrap"
          id="demo"
          justifyContent="space-between"
        >
          <Grid item xs={3}>
            <ProposalTableHeadText align={"left"}>
              TOKEN TRANSFER HISTORY
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={3}>
            <ProposalTableHeadText align={"left"}>DATE</ProposalTableHeadText>
          </Grid>
          <Grid item xs={3}>
            <ProposalTableHeadText align={"left"}>
              RECIPIENT
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={1}>
            <ProposalTableHeadText align={"left"}>AMOUNT</ProposalTableHeadText>
          </Grid>
        </TableHeader>
      )}

      {transfers && transfers.length > 0
        ? transfers.map((transfer, i) => (
            <GenericTableContainer key={`token-${i}`}>
              <TreasuryHistoryRow
                name={transfer.token.symbol}
                amount={transfer.amount}
                recipient={transfer.to}
                date={transfer.timestamp}
                hash={transfer.hash}
              />
            </GenericTableContainer>
          ))
        : null}

      {history.length === 0 ? (
        <NoProposals variant="subtitle1" color="textSecondary">
          No transfers listed
        </NoProposals>
      ) : null}
    </ResponsiveGenericTable>
  );
};
