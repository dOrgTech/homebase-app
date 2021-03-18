import { Grid, styled, Typography, withTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTreasuryInfo } from "services/tzkt/hooks/useTreasuryInfo";
import { TransactionInfo } from "services/tzkt/types";
import { Header } from "modules/explorer/components";
import {
  TreasuryTableRow,
  TreasuryHistoryRow,
} from "modules/explorer/Treasury";
import { useTokenBalances } from "services/contracts/baseDAO/hooks/useTokenBalances";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { CopyAddress } from "modules/common/CopyAddress";
import { ResponsiveTableContainer } from "modules/explorer/components/ResponsiveTable";

const ListItemContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
  },
}));

const MainContainer = styled(Grid)({
  minHeight: 125,
  padding: "40px 8% 0 8%",
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
    <>
      <Grid item xs>
        <MainContainer container justify="space-between">
          <Grid item xs={12}>
            <Header name={"MY GREAT TOKEN"} />
            {dao && <CopyAddress address={dao.address} />}
          </Grid>
        </MainContainer>
        <ResponsiveTableContainer>
          <Grid container wrap="nowrap">
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
          </Grid>

          {tokenBalances && tokenBalances.length
            ? tokenBalances.map((token, i) => (
                <ListItemContainer key={`token-${i}`}>
                  <TreasuryTableRow {...token} />
                </ListItemContainer>
              ))
            : null}
        </ResponsiveTableContainer>

        <ResponsiveTableContainer>
          <Grid container wrap="nowrap">
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
          </Grid>

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
        </ResponsiveTableContainer>
      </Grid>
    </>
  );
};
