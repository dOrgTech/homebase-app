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
import { useParams } from "react-router-dom";

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

export const HistoryTable: React.FC = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const { data: transfers } = useTransfers(id);

  return (
    <ResponsiveGenericTable>
      {!isMobileSmall && (
        <TableHeader item container wrap="nowrap" id="demo">
          <Grid item xs={6}>
            <ProposalTableHeadText align={"left"}>
              TOKEN TRANSFER HISTORY
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={2}>
            <ProposalTableHeadText align={"right"}>DATE</ProposalTableHeadText>
          </Grid>
          <Grid item xs={2}>
            <ProposalTableHeadText align={"right"}>
              RECIPIENT
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={2}>
            <ProposalTableHeadText align={"right"}>
              AMOUNT
            </ProposalTableHeadText>
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
