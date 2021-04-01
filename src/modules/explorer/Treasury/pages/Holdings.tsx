import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";

import { HoldingsHeader } from "modules/explorer/components";
import { HistoryTable } from "../components/HistoryTable";
import { TokenTable } from "../components/TokenBalancesTable";
import { TabPanel } from "modules/explorer/components/TabPanel";
import { AppTabBar } from "modules/explorer/components/AppTabBar";

export const Holdings: React.FC = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <>
      <Grid item xs>
        <HoldingsHeader />
        {isMobileSmall ? (
          <>
            <AppTabBar
              value={selectedTab}
              setValue={setSelectedTab}
              labels={["TOKEN BALANCES", "TRANSFER HISTORY"]}
            />
            <TabPanel value={selectedTab} index={0}>
              <TokenTable />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <HistoryTable />
            </TabPanel>
          </>
        ) : (
          <>
            <TokenTable />
            <HistoryTable />
          </>
        )}
      </Grid>
    </>
  );
};
