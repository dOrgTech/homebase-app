import { Grid, styled, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAO } from "services/indexer/dao/hooks/useDAO";

const BalancesBox = styled(Grid)(({ theme }) => ({
  minHeight: "153px",
  padding: "38px 55px",
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
}));

interface Balances {
  available: {
    displayName: string;
    balance?: string;
  };
  pending: {
    displayName: string;
    balance?: string;
  };
  staked: {
    displayName: string;
    balance?: string;
  };
}

const BalanceHeaderText = styled(Typography)({
  fontSize: 21,
  letterSpacing: "-0.01em",
  paddingBottom: 10,
});

const BalanceTokenText = styled(Typography)({
  fontSize: 24,
});

export const UserBalances: React.FC<{ daoId: string }> = ({
  daoId,
  children,
}) => {
  const { account } = useTezos();
  const { data: dao, ledger } = useDAO(daoId);

  const balances = useMemo(() => {
    const userBalances: Balances = {
      available: {
        displayName: "Available Balance",
      },
      pending: {
        displayName: "Pending Balance",
      },
      staked: {
        displayName: "Staked Balance",
      },
    };

    if (!ledger) {
      return userBalances;
    }

    const userLedger = ledger.find(
      (l) => l.holder.address.toLowerCase() === account.toLowerCase()
    );

    if (!userLedger) {
      userBalances.available.balance = "-";
      userBalances.pending.balance = "-";
      userBalances.staked.balance = "-";

      return userBalances;
    }

    userBalances.available.balance = userLedger.available_balance.toString();
    userBalances.pending.balance = userLedger.pending_balance.toString();
    userBalances.staked.balance = userLedger.staked.toString();

    return userBalances;
  }, [account, ledger]);

  const balancesList = Object.keys(balances).map(
    (key) => balances[key as keyof Balances]
  );

  return (
    <Grid container direction="column" style={{ gap: 40 }}>
      {children}
      <Grid item container justifyContent="space-between">
        {dao &&
          balancesList.map(({ displayName, balance }, i) => (
            <Grid item key={`balance-${i}`}>
              <BalanceHeaderText color="secondary">
                {displayName}
              </BalanceHeaderText>
              <Grid container alignItems="baseline" spacing={2}>
                <Grid item>
                  <Typography variant="h5" color="textPrimary">
                    {balance}
                  </Typography>
                </Grid>
                <Grid item>
                  <BalanceTokenText color="textPrimary">
                    {balance !== "-" ? dao.data.token.symbol : ""}
                  </BalanceTokenText>
                </Grid>
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export const UserBalancesBox: React.FC<{ daoId: string }> = ({ daoId }) => {
  return (
    <BalancesBox item>
      <UserBalances daoId={daoId} />
    </BalancesBox>
  );
};
