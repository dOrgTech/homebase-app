import { Grid, styled, Typography } from "@material-ui/core";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import { ProposalTableHeadText } from "modules/explorer/Treasury/components/TableHeader";
import React, { useState } from "react";
import { RegistryItemDialog } from "./ItemDialog";
import { RegistryTableRow } from "./TableRow";

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

export const RegistryItemsTable: React.FC<{
  isMobileSmall: boolean;
  registryList: Array<any>;
}> = ({ isMobileSmall, registryList }) => {
  const [dialogRegistryItem, setDialogRegistryItem] =
    useState<{ key: string; value: string }>();
  const [open, setOpen] = useState(false);

  const onClickRow = (item: { key: string; value: string }) => {
    setDialogRegistryItem(item);
  };

  return (
    <ResponsiveGenericTable>
      {!isMobileSmall && (
        <TableHeader item container wrap="nowrap" id="demo" alignItems="center">
          <Grid item xs={3}>
            <ProposalTableHeadText align={"left"}>
              REGISTRY ITEMS
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={6}>
            <Grid item container direction="row">
              <ProposalTableHeadText align={"left"}>
                VALUE
              </ProposalTableHeadText>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <ProposalTableHeadText align={"left"}>
              LAST UPDATED
            </ProposalTableHeadText>
          </Grid>
          <Grid item xs={2}></Grid>
        </TableHeader>
      )}

      {registryList.map((item, i) => (
        <GenericTableContainer key={`item-${i}`}>
          <RegistryTableRow {...item} onClickRow={() => onClickRow(item)} />
        </GenericTableContainer>
      ))}

      <RegistryItemDialog
        item={dialogRegistryItem || { key: "", value: "" }}
        open={open}
        handleClose={() => setOpen(false)}
      />
      {registryList.length === 0 ? (
        <NoProposals variant="subtitle1" color="textSecondary">
          No registry items
        </NoProposals>
      ) : null}
    </ResponsiveGenericTable>
  );
};
