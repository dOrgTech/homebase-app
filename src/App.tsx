import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import mixpanel from "mixpanel-browser";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, makeStyles, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";

import { DAOExplorerRouter } from "modules/explorer/router";
import { DAOCreate } from "modules/creator";
import { CreatorProvider } from "modules/creator/state";
import ScrollToTop from "modules/common/ScrollToTop";
import { theme } from "theme";

import "App.css";
import { TZKTSubscriptionsProvider } from "services/bakingBad/context/TZKTSubscriptions";
import { Landing } from "modules/home/Landing";
import { WarningFooter } from "modules/common/WarningFooter";
import { ActionSheetProvider } from "modules/explorer/context/ActionSheets";
import { legacyTheme } from "theme/legacy";
import { Footer } from "modules/common/Footer"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 60000),
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      staleTime: 5000,
      cacheTime: 30000,
    },
  },
});

const styles = makeStyles({
  success: {
    backgroundColor: "#4BCF93 !important",
    padding: "6px 28px",
    height: 54,
    fontSize: 13,
    lineHeight: "0px",
    opacity: 1,
  },
  error: {
    backgroundColor: "#ED254E !important",
    padding: "6px 28px",
    height: 54,
    fontSize: 13,
    lineHeight: "0px",
    opacity: 1,
  },
  info: {
    backgroundColor: "#3866F9 !important",
    padding: "6px 28px",
    height: 54,
    fontSize: 13,
    lineHeight: "0px",
    opacity: 1,
  },
});

if (!process.env.REACT_APP_MIXPANEL_TOKEN) {
  throw new Error("REACT_APP_MIXPANEL_TOKEN env variable is missing");
}

if (!process.env.REACT_APP_MIXPANEL_DEBUG_ENABLED) {
  throw new Error("REACT_APP_MIXPANEL_DEBUG_ENABLED env variable is missing");
}

mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
  debug: process.env.REACT_APP_MIXPANEL_DEBUG_ENABLED == "true",
});
mixpanel.track("Visit");

const App: React.FC = () => {
  const classes = styles();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        classes={{
          variantSuccess: classes.success,
          variantError: classes.error,
          variantInfo: classes.info,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ActionSheetProvider>
            <Box bgcolor="primary.dark" position="absolute" width="100%">
              <Router>
                <ScrollToTop />
                <Switch>
                  <Route path="/creator">
                    <CreatorProvider>
                      <ThemeProvider theme={legacyTheme}>
                        <DAOCreate />
                      </ThemeProvider>
                    </CreatorProvider>
                    <WarningFooter
                      text={
                        "Homebase is highly experimental, and changes are to be expected in the coming weeks. Please use at your own risk. The DAO you created will not be deprecated."
                      }
                    />
                   
                  </Route>
                  <Route path="/explorer">
                    <TZKTSubscriptionsProvider>
                      <DAOExplorerRouter />
                    </TZKTSubscriptionsProvider>
                    <WarningFooter
                      text={
                        "Homebase is highly experimental, and changes are to be expected in the coming weeks. Please use at your own risk. The DAO you created will not be deprecated."
                      }
                    />
                    <Footer></Footer>
                  </Route>
                  <Route path="/">
                    <Landing />
                  </Route>
                  <Redirect to="/" />
                </Switch>
              </Router>
            </Box>
          </ActionSheetProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
