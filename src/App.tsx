import React, { useEffect } from "react"
import "App.css"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query"

import { Box, ThemeProvider, Theme, StyledEngineProvider, styled } from "@mui/material"
import { SnackbarProvider, MaterialDesignContent, useSnackbar } from "notistack"

import { DAOExplorerRouter } from "modules/explorer/router"
import { CreatorProvider } from "modules/creator/state"
import ScrollToTop from "modules/common/ScrollToTop"
import { theme } from "theme"
// WagmiProvider is provided at the root via Web3Provider (index.tsx)

import { TZKTSubscriptionsProvider } from "services/bakingBad/context/TZKTSubscriptions"
import { WarningFooter } from "modules/common/WarningFooter"
import { ActionSheetProvider } from "modules/explorer/context/ActionSheets"
import { legacyTheme } from "theme/legacy"
import { ExplorerFooter } from "modules/common/Footer"
import { FAQ } from "modules/home/FAQ"
import { EnvKey, HUMANITEZ_DAO, getEnv } from "services/config"
import { DAOCreatorRouter } from "modules/creator/router"
import { CommunityCreator } from "modules/lite/creator"
import { EtherlinkDAOCreatorRouter } from "modules/etherlink/router"
import { useTezos } from "services/beacon/hooks/useTezos"
import {
  DISCORD_SUPPORT_LINK,
  SUPPORT_SHOWN_KEY,
  hasSupportThresholdBeenMet,
  trackAppError
} from "services/supportNotification"

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: () => trackAppError()
  }),
  mutationCache: new MutationCache({
    onError: () => trackAppError()
  }),
  defaultOptions: {
    queries: {
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 60000),
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      staleTime: 5000,
      gcTime: 300000
    }
  }
})

// notistack v3 moved per-variant styling from `classes.variantX` to the
// `Components` prop with styled MaterialDesignContent.
const snackbarVariantStyle = {
  padding: "6px 28px",
  height: 54,
  fontSize: 13,
  lineHeight: "0px",
  opacity: 1
}

const SuccessSnackbar = styled(MaterialDesignContent)({
  "&.notistack-MuiContent-success": {
    backgroundColor: "#4BCF93 !important",
    ...snackbarVariantStyle
  }
})

const ErrorSnackbar = styled(MaterialDesignContent)({
  "&.notistack-MuiContent-error": {
    backgroundColor: "#ED254E !important",
    ...snackbarVariantStyle
  }
})

const InfoSnackbar = styled(MaterialDesignContent)({
  "&.notistack-MuiContent-info": {
    backgroundColor: "#3866F9 !important",
    ...snackbarVariantStyle
  }
})

// notistack v3 dropped the top-level `style` prop; the container z-index
// is now applied through the `containerRoot` class.
const SnackbarContainer = styled("div")({
  zIndex: 1000003
})

// PostHog tracking is now handled globally via PostHogProvider in index.tsx
// Visit tracking can be done via PostHog's auto-capture or custom events

const SupportNotificationListener: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { account } = useTezos()

  const showSupportNotification = React.useCallback(() => {
    if (sessionStorage.getItem(SUPPORT_SHOWN_KEY) === "true") return
    sessionStorage.setItem(SUPPORT_SHOWN_KEY, "true")

    enqueueSnackbar("Having trouble? Get support on our Discord.", {
      variant: "info",
      autoHideDuration: 8000,
      action: (
        <a
          href={DISCORD_SUPPORT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#fff", display: "flex", alignItems: "center" }}
        >
          Open Discord
        </a>
      )
    })
  }, [enqueueSnackbar])

  // Check on login if errors already accumulated before wallet was connected
  useEffect(() => {
    if (!account) return
    if (hasSupportThresholdBeenMet()) {
      showSupportNotification()
    }
  }, [account, showSupportNotification])

  // Listen for new errors after login
  useEffect(() => {
    if (!account) return

    const handler = () => showSupportNotification()

    window.addEventListener("homebase-support-needed", handler)
    return () => window.removeEventListener("homebase-support-needed", handler)
  }, [account, showSupportNotification])

  return null
}

const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          classes={{
            containerRoot: SnackbarContainer.toString()
          }}
          Components={{
            success: SuccessSnackbar,
            error: ErrorSnackbar,
            info: InfoSnackbar
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
        >
          {/* <TanStackQueryClientProvider client={tsQueryClient}> */}
          <QueryClientProvider client={queryClient}>
            <SupportNotificationListener />
            <ActionSheetProvider>
              <Box bgcolor="primary.dark" position="absolute" width="100%">
                <Router>
                  <ScrollToTop />
                  <Switch>
                    <Route path="/creator-evm">
                      <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={legacyTheme}>
                          <EtherlinkDAOCreatorRouter />
                        </ThemeProvider>
                      </StyledEngineProvider>
                    </Route>
                    <Route path="/creator">
                      <CreatorProvider>
                        <StyledEngineProvider injectFirst>
                          <ThemeProvider theme={legacyTheme}>
                            <DAOCreatorRouter />
                          </ThemeProvider>
                        </StyledEngineProvider>
                      </CreatorProvider>
                      {/* <WarningFooter
                      text={
                        "The Homebase contract can't transfer FA1.2 tokens. Please make sure any and all tokens you send to the DAO treasury are implementing the FA2 standard."
                      }
                    /> */}
                    </Route>
                    <Route path="/lite">
                      <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={legacyTheme}>
                          <CommunityCreator />
                        </ThemeProvider>
                      </StyledEngineProvider>
                    </Route>
                    <Route path="/explorer">
                      <TZKTSubscriptionsProvider>
                        <DAOExplorerRouter />
                      </TZKTSubscriptionsProvider>

                      {window.location.href.indexOf(HUMANITEZ_DAO) !== -1 ? (
                        <>
                          {/* Special case for this DAO which was created before FA1.2 fix was created for the smart contract */}
                          <WarningFooter
                            text={
                              "The Homebase contract can't transfer FA1.2 tokens. Please make sure any and all tokens you send to the DAO treasury are implementing the FA2 standard."
                            }
                          />
                        </>
                      ) : null}
                      <ExplorerFooter></ExplorerFooter>
                    </Route>
                    <Route path="/faq">
                      <FAQ />
                    </Route>
                    <Redirect to="/explorer" />
                  </Switch>
                </Router>
              </Box>
            </ActionSheetProvider>
          </QueryClientProvider>
          {/* </TanStackQueryClientProvider> */}
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

const env = getEnv(EnvKey.REACT_APP_ENV)

export default App
