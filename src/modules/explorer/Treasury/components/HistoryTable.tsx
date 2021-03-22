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
import { TransactionInfo } from "services/tzkt/types";
import { TreasuryHistoryRow } from "./HistoryRow";
import { ProposalTableHeadText } from "./TableHeader";

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

export const HistoryTable: React.FC<{
  treasuryMovements: Array<TransactionInfo>;
}> = ({ treasuryMovements }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

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

      {treasuryMovements.length > 0
        ? treasuryMovements.map((token, i) => (
            <GenericTableContainer key={`token-${i}`}>
              <TreasuryHistoryRow {...token} />
            </GenericTableContainer>
          ))
        : null}

      {history.length === 0 ? (
        <NoProposals variant="subtitle1" color="textSecondary">
          No active proposals
        </NoProposals>
      ) : null}
    </ResponsiveGenericTable>
  );
};
