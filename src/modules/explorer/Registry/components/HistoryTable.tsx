import React from "react";
import { Grid, styled, Typography } from "@material-ui/core";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import { ProposalTableHeadText } from "modules/explorer/Treasury/components/TableHeader";
import { RegistryHistoryRow } from "./HistoryRow";

const NoProposals = styled(Typography)(({ theme }) => ({
  marginTop: 20,
  marginBottom: 20,
  paddingLeft: 112,
  [theme.breakpoints.down("xs")]: {
    paddingLeft: 0,
    display: "flex",
    justifyContent: "center",
  },
}));

export const HistoryTable: React.FC<{
  isMobileSmall: boolean;
  proposals: Array<any>;
}> = ({ isMobileSmall, proposals }) => {
  return (
    <ResponsiveGenericTable>
      {!isMobileSmall ? (
        <TableHeader item container wrap="nowrap" id="demo">
          <Grid item xs={4}>
            <ProposalTableHeadText align={"left"}>
              UPDATE HISTORY
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={3}>
            <ProposalTableHeadText align={"left"}>
              PROPOSAL TITLE
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={3}>
            <ProposalTableHeadText align={"left"}>DATE</ProposalTableHeadText>
          </Grid>
          <Grid item xs={2}>
            <ProposalTableHeadText align={"left"}>
              PROPOSAL
            </ProposalTableHeadText>
          </Grid>
        </TableHeader>
      ) : null}
      {proposals.map((item, i) => (
        <GenericTableContainer key={`item-${i}`}>
          <RegistryHistoryRow {...item} />
        </GenericTableContainer>
      ))}

      {proposals.length === 0 ? (
        <NoProposals variant="subtitle1" color="textSecondary">
          No entries
        </NoProposals>
      ) : null}
    </ResponsiveGenericTable>
  );
};
