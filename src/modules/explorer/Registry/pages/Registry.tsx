import { Box, Grid, styled, Typography, withTheme } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";

import { SideBar } from "modules/explorer/components";
import { RegistryHeader } from "../components/RegistryHeader";
import { RegistryTableRow } from "../components/TableRow";
import { RegistryHistoryRow } from "../components/HistoryRow";

const ListItemContainer = styled(withTheme(Grid))((props) => ({
  paddingLeft: 112,
  background: props.theme.palette.primary.main,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
  },
}));

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  minHeight: 125,
  padding: "40px 112px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const TableContainer = styled(Box)({
  width: "100%",
  padding: "72px 112px",
  boxSizing: "border-box",
  paddingBottom: "24px",
  paddingLeft: 0,
});

const TableHeader = styled(Grid)({
  paddingLeft: 112,
});

const BorderBottom = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 20,
}));

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

const data = [
  { name: "Registry item", operationId: "092323221122" },
  { name: "Registry item", operationId: "092323221122" },
  { name: "Registry item", operationId: "092323221122" },
  { name: "Registry item", operationId: "092323221122" },
];

const history = [
  {
    name: "Registry item",
    description: "First line of proposal",
    date: "02/20/2021",
    address: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
  },
  {
    name: "Registry item",
    description: "First line of proposal",
    date: "02/20/2021",
    address: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
  },
  {
    name: "Registry item",
    description: "First line of proposal",
    date: "02/20/2021",
    address: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
  },
  {
    name: "Registry item",
    description: "First line of proposal",
    date: "02/20/2021",
    address: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
  },
];

export const Registry: React.FC = () => {
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();

  return (
    <PageLayout container wrap="nowrap">
      <SideBar dao={id} />
      <Grid item xs>
        <MainContainer container justify="space-between">
          <Grid item xs={12}>
            <RegistryHeader name={"MY GREAT TOKEN"} />
          </Grid>
        </MainContainer>
        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={12}>
              <BorderBottom item container wrap="nowrap">
                <Grid item xs={7}>
                  <ProposalTableHeadText align={"left"}>
                    REGISTRY ITEMS
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={3}>
                  <Grid item container direction="row" justify="center">
                    <ProposalTableHeadText align={"left"}>
                      OPERATION ID
                    </ProposalTableHeadText>
                  </Grid>
                </Grid>
                <Grid item xs={2}></Grid>
              </BorderBottom>
            </Grid>
          </TableHeader>

          {data.length
            ? data.map((item, i) => (
                <ListItemContainer key={`item-${i}`}>
                  <RegistryTableRow {...item} />
                </ListItemContainer>
              ))
            : null}
        </TableContainer>

        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={12}>
              <BorderBottom item container wrap="nowrap">
                <Grid item xs={6}>
                  <ProposalTableHeadText align={"left"}>
                    UPDATE HISTORY
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={3}>
                  <ProposalTableHeadText align={"right"}>
                    DATE
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={3}>
                  <ProposalTableHeadText align={"right"}>
                    PROPOSAL
                  </ProposalTableHeadText>
                </Grid>
              </BorderBottom>
            </Grid>
          </TableHeader>

          {history.length
            ? history.map((item, i) => (
                <ListItemContainer key={`item-${i}`}>
                  <RegistryHistoryRow {...item} />
                </ListItemContainer>
              ))
            : null}

          {history.length === 0 ? (
            <NoProposals variant="subtitle1" color="textSecondary">
              No active proposals
            </NoProposals>
          ) : null}
        </TableContainer>
      </Grid>
    </PageLayout>
  );
};
