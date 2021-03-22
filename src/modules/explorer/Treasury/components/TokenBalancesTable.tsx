import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import React from "react";
import { BalanceInfo } from "services/contracts/baseDAO/hooks/useTokenBalances";
import { TreasuryTableRow } from "..";
import { ProposalTableHeadText } from "./TableHeader";

export const TokenTable: React.FC<{
  tokenBalances: Array<BalanceInfo> | undefined;
}> = ({ tokenBalances }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ResponsiveGenericTable>
      {!isMobileSmall && (
        <TableHeader item container wrap="nowrap" id="demo">
          <Grid item xs={5}>
            <ProposalTableHeadText align={"left"}>
              TOKEN BALANCES
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={5}>
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
  );
};
