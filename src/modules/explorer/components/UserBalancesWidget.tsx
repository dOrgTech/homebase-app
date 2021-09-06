import { Grid, styled, Theme, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import hexToRgba from "hex-to-rgba";
import React, { useMemo } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useDAOID } from "../daoRouter";

const BalanceBox = styled(Grid)(
  ({
    radiusSide,
    color,
  }: {
    radiusSide: "left" | "right" | "none";
    color: string;
  }) => {
    let borderRadius = "0";

    switch (radiusSide) {
      case "none": {
        break;
      }
      case "left": {
        borderRadius = "4px 0 0 4px";
        break;
      }
      case "right": {
        borderRadius = "0 4px 4px 0";
        break;
      }
    }

    return {
      width: 166,
      height: 41.85,
      borderRadius,
      color,
      backgroundColor: hexToRgba(color, 0.15),
      "& > div": {
        height: "100%",
      },
    };
  }
);

const TitleText = styled(Typography)({
  fontSize: 11,
  fontWeight: 500,
});

const BalanceText = styled(Typography)({
  fontSize: 15,
  fontWeight: 500,
});

export const UserBalancesWidget: React.FC = () => {
  const { account } = useTezos();
  const daoId = useDAOID();
  const { ledger, data: dao } = useDAO(daoId);
  const theme = useTheme<Theme>();
  const userLedger = useMemo(() => {
    const found = ledger?.find(
      (l) => l.holder.address.toLowerCase() === account.toLowerCase()
    );

    return (
      found || {
        available_balance: "0",
        pending_balance: "0",
        staked: "0",
      }
    );
  }, [account, ledger]);

  console.log(userLedger, ledger, dao);

  return (
    <Grid container>
      {userLedger && dao && (
        <>
          <BalanceBox
            item
            color={theme.palette.secondary.main}
            radiusSide="left"
          >
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <TitleText align="center" color="inherit">
                  Available Balance
                </TitleText>
                <BalanceText align="center" color="textSecondary">
                  {userLedger.available_balance.toString()}{" "}
                  {dao.data.token.symbol}
                </BalanceText>
              </Grid>
            </Grid>
          </BalanceBox>
          <BalanceBox item color={theme.palette.warning.main} radiusSide="none">
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <TitleText align="center" color="inherit">
                  Pending Balance
                </TitleText>
                <BalanceText align="center" color="textSecondary">
                  {userLedger.pending_balance.toString()}{" "}
                  {dao.data.token.symbol}
                </BalanceText>
              </Grid>
            </Grid>
          </BalanceBox>
          <BalanceBox item color={theme.palette.info.main} radiusSide="right">
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <TitleText align="center" color="inherit">
                  Staked Balance
                </TitleText>
                <BalanceText align="center" color="textSecondary">
                  {userLedger.staked.toString()} {dao.data.token.symbol}
                </BalanceText>
              </Grid>
            </Grid>
          </BalanceBox>
        </>
      )}
    </Grid>
  );
};
