import { Box, Grid, styled, Typography, withTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTreasuryInfo } from "services/tzkt/hooks/useTreasuryInfo";
import { TransactionInfo } from "services/tzkt/types";
import { Header, SideBar } from "modules/explorer/components";
import {
  TreasuryTableRow,
  TreasuryHistoryRow,
} from "modules/explorer/Treasury";
import { useTokenBalances } from "services/contracts/baseDAO/hooks/useTokenBalances";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { FileCopyOutlined } from "@material-ui/icons";

const ListItemContainer = styled(withTheme(Grid))((props) => ({
  paddingLeft: 112,
  background: props.theme.palette.primary.main,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
  },
}));

const CopyIcon = styled(FileCopyOutlined)({
  cursor: "pointer",
});

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

export const Holdings: React.FC = () => {
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const { data: dao } = useDAO(id);

  const { data: tokenBalances } = useTokenBalances(id);
  const [treasuryMovements, setTreasuryMovements] = useState<TransactionInfo[]>(
    []
  );

  const transactions = useTreasuryInfo(id);

  useEffect(() => {
    if (transactions.status === "success") {
      setTreasuryMovements(transactions.data);
    }
  }, [transactions]);

  return (
    <PageLayout container wrap="nowrap">
      <SideBar dao={id} />

      <Grid item xs>
        <MainContainer container justify="space-between">
          <Grid item xs={12}>
            <Header name={"MY GREAT TOKEN"} />
            {dao && (
              <Grid container alignItems="center">
                <Grid item>
                  <Typography variant="subtitle1" color="textSecondary">
                    {dao.address}
                  </Typography>
                </Grid>
                <Grid item>
                  <Box
                    padding="5px 0 0 10px"
                    marginTop="auto"
                    onClick={() => {
                      navigator.clipboard.writeText(dao.address);
                    }}
                  >
                    <CopyIcon color="secondary" fontSize="small" />
                  </Box>
                </Grid>
              </Grid>
            )}
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
                <Grid item xs={6}>
                  <ProposalTableHeadText align={"right"}>
                    BALANCE
                  </ProposalTableHeadText>
                </Grid>
              </BorderBottom>
            </Grid>
          </TableHeader>

          {tokenBalances && tokenBalances.length
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

          {treasuryMovements.length
            ? treasuryMovements.map((token, i) => (
                <ListItemContainer key={`token-${i}`}>
                  <TreasuryHistoryRow {...token} />
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
