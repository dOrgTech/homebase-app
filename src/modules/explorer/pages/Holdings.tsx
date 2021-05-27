import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { TemplateHeader } from "modules/explorer/components/TemplateHeader";
import { AppTabBar } from "../components/AppTabBar";
import { TabPanel } from "../components/TabPanel";
import { HistoryTable } from "../Treasury/components/HistoryTable";
import { TokenTable } from "../Treasury/components/TokenBalancesTable";

export const Holdings: React.FC = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <>
      <Grid item xs>
        <TemplateHeader template="treasury" />
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
