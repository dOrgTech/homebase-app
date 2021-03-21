import {
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTreasuryInfo } from "services/tzkt/hooks/useTreasuryInfo";
import { TransactionInfo } from "services/tzkt/types";
import { HoldingsHeader } from "modules/explorer/components";
import {
  TreasuryTableRow,
  TreasuryHistoryRow,
} from "modules/explorer/Treasury";
import { useTokenBalances } from "services/contracts/baseDAO/hooks/useTokenBalances";
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";

const RightText = styled(Typography)({
  opacity: 0.8,
  fontWeight: 400,
});

const LeftText = styled(Typography)({
  fontWeight: 700,
});

const ProposalTableHeadText: React.FC<{ align: any }> = ({ children, align }) =>
  align === "left" ? (
    <LeftText variant="subtitle1" color="textSecondary" align={align}>
      {children}
    </LeftText>
  ) : (
    <RightText variant="subtitle1" color="textSecondary" align={align}>
      {children}
    </RightText>
  );

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

export const Holdings: React.FC = () => {
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();

  const { data: tokenBalances } = useTokenBalances(id);
  const [treasuryMovements, setTreasuryMovements] = useState<TransactionInfo[]>(
    []
  );
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const transactions = useTreasuryInfo(id);

  useEffect(() => {
    if (transactions.status === "success") {
      setTreasuryMovements(transactions.data);
    }
  }, [transactions]);

  return (
    <>
      <Grid item xs>
        <HoldingsHeader />
        <ResponsiveGenericTable>
          {!isMobileSmall && (
            <TableHeader item container wrap="nowrap" id="demo">
              <Grid item xs={6}>
                <ProposalTableHeadText align={"left"}>
                  TOKEN BALANCES
                </ProposalTableHeadText>
              </Grid>
              <Grid item xs={6}>
                <ProposalTableHeadText align={"right"}>
                  BALANCE
                </ProposalTableHeadText>
              </Grid>
            </TableHeader>
          )}
          {tokenBalances && tokenBalances.length
            ? tokenBalances.map((token, i) => (
                <GenericTableContainer key={`token-${i}`}>
                  <TreasuryTableRow {...token} />
                </GenericTableContainer>
              ))
            : null}
        </ResponsiveGenericTable>

        <ResponsiveGenericTable>
          <TableHeader item container wrap="nowrap" id="demo">
            <Grid item xs={isMobileSmall ? 12 : 6}>
              <ProposalTableHeadText align={"left"}>
                TOKEN TRANSFER HISTORY
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText align={"right"}>
                {!isMobileSmall ? "DATE" : null}
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText align={"right"}>
                {!isMobileSmall ? "RECIPIENT" : null}
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText align={"right"}>
                {!isMobileSmall ? "AMOUNT" : null}
              </ProposalTableHeadText>
            </Grid>
          </TableHeader>

          {treasuryMovements.length
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
      </Grid>
    </>
  );
};
