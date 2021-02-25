import { Box, Grid, styled, Typography, withTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Header } from "modules/explorer/components/Header";
import { TreasuryTableRow } from "modules/explorer/components/TreasuryTableRow";
import { TreasuryHistoryRow } from "modules/explorer/components/TreasuryHistoryRow";
import { SideBar } from "modules/explorer/components/SideBar";
import { useBalance } from "modules/common/hooks/useBalance";
import { useTreasuryInfo } from "services/tzkt/hooks/useTreasuryInfo";
import { TransactionInfo } from "services/tzkt/types";

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

export const SUPPORTED_TOKENS = ["XTZ"];

interface BalanceInfo {
  name: string;
  balance?: number;
}

export const Treasury: React.FC = () => {
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();

  const [tokenBalances, setTokenBalances] = useState<BalanceInfo[]>([]);
  const [treasuryMovements, setTreasuryMovements] = useState<TransactionInfo[]>(
    []
  );

  const getBalance = useBalance();
  const transactions = useTreasuryInfo(id);

  useEffect(() => {
    if (transactions.status === "success") {
      setTreasuryMovements(transactions.data);
    }
  }, [transactions]);

  useEffect(() => {
    (async () => {
      const allBalances = SUPPORTED_TOKENS.map((token) =>
        getBalance(id, token)
      );
      const balances = await Promise.all(allBalances);
      const tokensInformation = SUPPORTED_TOKENS.map((token, index) => {
        return {
          name: token,
          balance: balances[index],
        };
      });

      setTokenBalances(tokensInformation);
    })();
  }, [id, getBalance]);

  return (
    <PageLayout container wrap="nowrap">
      <SideBar dao={id} />

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

          {tokenBalances.length
            ? tokenBalances.map((token, i) => (
                <ListItemContainer key={`token-${i}`}>
                  <TreasuryTableRow {...token} />
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

          {treasuryMovements.length &&
            treasuryMovements.map((token, i) => (
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
      </Grid>
    </PageLayout>
  );
};
