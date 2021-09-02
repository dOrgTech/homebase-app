import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import { useDAOID } from "modules/explorer/daoRouter";
import React from "react";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { TreasuryTableRow } from "..";
import { ProposalTableHeadText } from "./TableHeader";

export const TokenTable: React.FC = () => {
  const daoId = useDAOID();
  const { tokenHoldings } = useDAOHoldings(daoId);
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
          <Grid item xs={7}>
            <ProposalTableHeadText align={"right"}>
              BALANCE
            </ProposalTableHeadText>
          </Grid>
        </TableHeader>
      )}
      {tokenHoldings && tokenHoldings.length
        ? tokenHoldings.map((holding, i) => (
            <GenericTableContainer key={`holding-${i}`}>
              <TreasuryTableRow {...holding} />
            </GenericTableContainer>
          ))
        : null}
    </ResponsiveGenericTable>
  );
};
