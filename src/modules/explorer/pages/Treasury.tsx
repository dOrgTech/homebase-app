import {
  Box,
  Grid,
  IconButton,
  styled,
  Typography,
  withTheme,
} from "@material-ui/core";
import React from "react";
import HouseIcon from "assets/logos/house.svg";
import VotingIcon from "assets/logos/voting.svg";

import { Header } from "modules/explorer/components/Header";
import { TreasuryTableRow } from "../components/TreasuryTableRow";
import { TreasuryHistoryRow } from "../components/TreasuryHistoryRow";

const ListItemContainer = styled(withTheme(Grid))((props) => ({
  paddingLeft: 112,
  background: props.theme.palette.primary.main,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
  },
}));

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

const SideBar = styled(Grid)({
  width: 102,
  borderRight: "2px solid #3D3D3D",
});

const SidebarButton = styled(IconButton)({
  paddingTop: 32,
  width: "100%",
});

const MainContainer = styled(Grid)({
  minHeight: 125,
  padding: "40px 112px",
  borderBottom: "2px solid #3D3D3D",
});

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

const BorderBottom = styled(Grid)({
  borderBottom: "2px solid #3d3d3d",
  paddingBottom: 20,
});

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

const UnderlineText = styled(Typography)({
  textDecoration: "underline",
  cursor: "pointer",
  marginBottom: 28,
});

export const Treasury: React.FC = () => {
  const tokenBalances = [
    { name: "token name", balance: 4322, address: "" },
    { name: "token name", balance: 4322, address: "" },
  ];

  const history = [
    {
      date: "2021-02-18T19:01:28Z",
      name: "token name",
      recipient: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
      balance: 1622,
    },
    {
      date: "2021-02-17T19:01:28Z",
      name: "token name",
      recipient: "tz1bQgEea45ciBpYdFj4y4P3hNyDM8aMF6WB",
      balance: 5712,
    },
  ];
  return (
    <PageLayout container wrap="nowrap">
      <SideBar item>
        <SidebarButton>
          <img src={HouseIcon} />
        </SidebarButton>
        <SidebarButton>
          <img src={VotingIcon} />
        </SidebarButton>
      </SideBar>

      <Grid item xs>
        <MainContainer container justify="space-between">
          <Grid item xs={12}>
            <Header name={"MY GREAT TOKEN"} />
          </Grid>
        </MainContainer>
        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={12}>
              <BorderBottom item container wrap="nowrap">
                <Grid item xs={6}>
                  <ProposalTableHeadText align={"left"}>
                    TOKEN BALANCES
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={5}>
                  <ProposalTableHeadText align={"right"}>
                    BALANCE
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={1}></Grid>
              </BorderBottom>
            </Grid>
          </TableHeader>

          {tokenBalances.length > 0 &&
            tokenBalances.map((token, i) => (
              <ListItemContainer key={`token-${i}`}>
                <TreasuryTableRow {...token} />
              </ListItemContainer>
            ))}

          {tokenBalances.length === 0 ? (
            <NoProposals variant="subtitle1" color="textSecondary">
              No active proposals
            </NoProposals>
          ) : null}
        </TableContainer>
        <Grid container direction="row" justify="center">
          <UnderlineText variant="subtitle1" color="textSecondary">
            LOAD 10 MORE
          </UnderlineText>
        </Grid>

        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={12}>
              <BorderBottom item container wrap="nowrap">
                <Grid item xs={6}>
                  <ProposalTableHeadText align={"left"}>
                    TOKEN TRANSFER HISTORY
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={2}>
                  <ProposalTableHeadText align={"right"}>
                    DATE
                  </ProposalTableHeadText>
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
              </BorderBottom>
            </Grid>
          </TableHeader>

          {history.length > 0 &&
            history.map((token, i) => (
              <ListItemContainer key={`token-${i}`}>
                <TreasuryHistoryRow {...token} />
              </ListItemContainer>
            ))}

          {history.length === 0 ? (
            <NoProposals variant="subtitle1" color="textSecondary">
              No active proposals
            </NoProposals>
          ) : null}
        </TableContainer>
        <Grid container direction="row" justify="center">
          <UnderlineText variant="subtitle1" color="textSecondary">
            LOAD 10 MORE
          </UnderlineText>
        </Grid>
      </Grid>
    </PageLayout>
  );
};
