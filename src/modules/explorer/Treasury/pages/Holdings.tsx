import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTreasuryInfo } from "services/tzkt/hooks/useTreasuryInfo";
import { TransactionInfo } from "services/tzkt/types";
import { HoldingsHeader } from "modules/explorer/components";
import { useTokenBalances } from "services/contracts/baseDAO/hooks/useTokenBalances";
import { HistoryTable } from "../components/HistoryTable";
import { TokenTable } from "../components/TokenBalancesTable";
import { TabPanel } from "modules/explorer/components/TabPanel";
import { AppTabBar } from "modules/explorer/components/AppTabBar";

export const Holdings: React.FC = () => {
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();

  const { data: tokenBalances } = useTokenBalances(id);
  const [treasuryMovements, setTreasuryMovements] = useState<TransactionInfo[]>(
    []
  );
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const transactions = useTreasuryInfo(id);

  useEffect(() => {
    if (transactions.status === "success") {
      setTreasuryMovements(transactions.data);
    }
  }, [transactions]);
  const [value, setValue] = React.useState(0);

  return (
    <>
      <Grid item xs>
        <HoldingsHeader />
        {isMobileSmall ? (
          <>
            <AppTabBar
              value={value}
              setValue={setValue}
              label1={"TOKEN BALANCES"}
              label2={"TRANSFER HISTORY"}
            />
            <TabPanel value={value} index={0}>
              <TokenTable
                isMobileSmall={isMobileSmall}
                tokenBalances={tokenBalances}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <HistoryTable
                isMobileSmall={isMobileSmall}
                treasuryMovements={treasuryMovements}
              />
            </TabPanel>
          </>
        ) : (
          <>
            <TokenTable
              isMobileSmall={isMobileSmall}
              tokenBalances={tokenBalances}
            />
            <HistoryTable
              isMobileSmall={isMobileSmall}
              treasuryMovements={treasuryMovements}
            />
          </>
        )}
      </Grid>
    </>
  );
};
