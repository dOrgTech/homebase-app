import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  styled,
  Typography,
  Box,
  Grid,
  Theme,
  useTheme,
  Popover,
  useMediaQuery,
  Link,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { TezosToolkit } from "@taquito/taquito";

import HomeButton from "assets/logos/homebase_logo.svg";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { Blockie } from "./Blockie";
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons";
import { AccountBalanceWallet } from "@material-ui/icons";
import { useTokenHolders } from "services/contracts/baseDAO/hooks/useTokenHolders";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { ChangeNetworkButton, NetworkMenu } from "./ChangeNetworkButton";
import { Network } from "services/beacon/context";

const StyledAppBar = styled(AppBar)({
  boxShadow: "none",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  padding: "22px 37px",
  boxSizing: "border-box",
  justifyContent: "space-between",
  flexWrap: "wrap",
});

const StatusDot = styled(Box)({
  borderRadius: "100%",
  width: 8,
  height: 8,
  background: "#4BCF93",
  marginLeft: 8,
});

const AddressContainer = styled(Grid)(({ theme }) => ({
  width: "min-content",
  paddingRight: 24,
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    paddingRight: 0,
  },
}));

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  cursor: "pointer",
});

const ConnectWallet = styled(Button)({
  maxHeight: 50,
  alignSelf: "baseline",
});

const AddressMenu = styled(Box)(() => ({
  width: 264,
  borderRadius: 4,
  backgroundColor: "#282B31",
}));

const AddressMenuItem = styled(Grid)(({ theme }) => ({
  cursor: "pointer",
  boxSizing: "border-box",
  color: theme.palette.text.secondary,
  padding: "20px 34px",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${theme.palette.secondary.light}`,
    cursor: "pointer",
  },
}));

const AddressMenuIcon = styled(Grid)({
  paddingRight: "12px",
  marginBottom: "-4px",
});

const AddressBarWrapper = styled(Grid)(({ theme }) => ({
  padding: "15px",
  marginRight: 10,
  borderRadius: 4,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
  },
  [theme.breakpoints.down("xs")]: {
    marginLeft: 15,
    padding: "0px",
  },
  [theme.breakpoints.down("md")]: {
    marginRight: -30,
  },
}));

const explorerBorder = (theme: Theme) => ({
  appBorder: {
    borderBottom: `2px solid ${theme.palette.primary.light}`,
  },
});

const LogoItem = styled("img")({
  cursor: "pointer",
  paddingTop: 8,
});

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4,
  },
});

const LogIn = styled(AccountBalanceWallet)(({ theme }) => ({
  color: theme.palette.secondary.main,
  height: 28,
  width: 28,
  marginLeft: 15,
}));

const ToolbarContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    justifyContent: "center",
    marginLeft: 16,
  },
  [theme.breakpoints.down("md")]: {
    display: "flex",
    justifyContent: "center",
    marginLeft: 0,
  },
}));

const BalanceContainer = styled(Grid)({
  background: "rgb(75, 207, 147)",
  borderRadius: 4,
  padding: 4,
  "&:hover": {
    background: "#608871",
  },
});

const Symbol = styled(Typography)({
  marginLeft: 4,
});

export const ConnectWalletButton = ({
  connect,
}: {
  connect: () => Promise<TezosToolkit>;
}) => (
  <ConnectWallet color="secondary" variant="outlined" onClick={() => connect()}>
    Connect Wallet
  </ConnectWallet>
);

interface ToolbarWrapperProps {
  children: any;
  mode: "creator" | "explorer";
  isMobileSmall: boolean;
  isMobileExtraSmall: boolean;
}

const ToolbarWrapper = ({
  children,
  mode,
  isMobileSmall,
  isMobileExtraSmall,
}: ToolbarWrapperProps): JSX.Element => {
  const xsValue = useMemo(() => {
    if (mode === "creator") {
      if (!isMobileSmall) {
        return 12;
      }
    }

    if (isMobileExtraSmall) {
      return 1;
    }

    return 9;
  }, [isMobileExtraSmall, isMobileSmall, mode]);

  return (
    <Grid
      item
      xs={xsValue}
      container
      justify={
        isMobileExtraSmall && mode === "explorer" ? "flex-start" : "flex-end"
      }
    >
      {children}
    </Grid>
  );
};

interface ExplorerLogoProps {
  history: any;
}

const ExplorerLogo = ({ history }: ExplorerLogoProps): JSX.Element => {
  return (
    <>
      <Grid item xs={11} sm={3}>
        <Box onClick={() => history.push("/explorer")}>
          <ToolbarContainer container alignItems="center" wrap="nowrap">
            <Grid item>
              <LogoItem src={HomeButton} />
            </Grid>
            <Grid item>
              <Box paddingLeft="10px">
                <LogoText color="textSecondary">Homebase</LogoText>
              </Box>
            </Grid>
          </ToolbarContainer>
        </Box>
      </Grid>
    </>
  );
};

export const Navbar: React.FC<{ mode: "creator" | "explorer" }> = ({
  mode,
}) => {
  const { connect, account, reset, changeNetwork, network } = useTezos();
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { id: daoId } =
    useParams<{
      id: string;
    }>();
  const { data: dao } = useDAO(daoId);
  const { data } = useTokenHolders(daoId);

  const [networkAnchorEl, setNetworkAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [networkPopperOpen, setNetworkPopperOpen] = useState(false);

  const handleNetworkClick = (event: React.MouseEvent<any>) => {
    setNetworkAnchorEl(event.currentTarget);
    setNetworkPopperOpen(!networkPopperOpen);
  };

  const handleNetworkChange = (network: Network) => {
    changeNetwork(network);
    setPopperOpen(!popperOpen);
    setNetworkPopperOpen(!networkPopperOpen);
    history.push("/explorer/daos");
  };

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(!popperOpen);
  };

  const handleLogout = () => {
    reset();
    setPopperOpen(false);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setPopperOpen(false);
  };

  const userBalance = useMemo(() => {
    if (!data) {
      return 0;
    }
    const balance = data.find(
      ({ address }) => address.toLowerCase() === account.toLowerCase()
    );
    const frozenBalance = balance ? balance.balances[0] : 0;
    return frozenBalance || 0;
  }, [data, account]);

  const history = useHistory();

  return (
    <StyledAppBar
      position="sticky"
      color="primary"
      style={mode === "explorer" ? explorerBorder(theme).appBorder : undefined}
    >
      <StyledToolbar>
        <Grid
          container
          direction="row"
          alignItems="center"
          wrap="wrap"
          justify={"flex-end"}
        >
          {mode === "explorer" ? <ExplorerLogo history={history} /> : null}
          <ToolbarWrapper
            mode={mode}
            isMobileSmall={isMobileSmall}
            isMobileExtraSmall={isMobileExtraSmall}
          >
            {account ? (
              <>
                <Grid
                  container
                  alignItems="center"
                  justify={isMobileExtraSmall ? "flex-start" : "flex-end"}
                >
                  {!isMobileSmall && data && data.length > 0 && dao ? (
                    <>
                      <Grid
                        item
                        xs={7}
                        container
                        justify="flex-end"
                        direction="row"
                      >
                        <BalanceContainer
                          container
                          item
                          justify="center"
                          direction="row"
                          xs={3}
                          sm={4}
                        >
                          <Typography color="textSecondary">
                            {userBalance}
                          </Typography>
                          <Symbol color="textSecondary">
                            {dao.metadata.unfrozenToken.symbol}
                          </Symbol>
                        </BalanceContainer>
                      </Grid>
                      <Grid item>
                        <ChangeNetworkButton />
                      </Grid>
                    </>
                  ) : null}

                  {!isMobileExtraSmall ? (
                    <Grid item>
                      <Link
                        href="https://github.com/dOrgTech/homebase-app/issues/new"
                        rel="noreferrer noopener"
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <Button color="secondary" variant="outlined">
                          Submit an issue
                        </Button>
                      </Link>
                    </Grid>
                  ) : null}

                  <AddressBarWrapper item>
                    <AddressContainer
                      container
                      alignItems="center"
                      wrap="nowrap"
                      justify="flex-end"
                      onClick={handleClick}
                    >
                      <Grid item>
                        <Blockie address={account} marginRight={"8px"} />
                      </Grid>
                      {!isMobileSmall || !isMobileExtraSmall ? (
                        <>
                          <Grid item>
                            <Typography variant="subtitle1">
                              {toShortAddress(account)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <StatusDot />
                          </Grid>
                        </>
                      ) : null}
                    </AddressContainer>
                  </AddressBarWrapper>
                </Grid>

                <StyledPopover
                  id={"wallet-Popper"}
                  open={popperOpen}
                  anchorEl={anchorEl}
                  style={{ zIndex: 1500, borderRadius: 4 }}
                  onClose={() => {
                    setPopperOpen(false);
                  }}
                  PaperProps={{
                    style: { borderRadius: 4, backgroundColor: "transparent" },
                  }}
                >
                  <AddressMenu>
                    <AddressMenuItem
                      container
                      alignItems="center"
                      onClick={() => handleCopy(account)}
                    >
                      <AddressMenuIcon item>
                        <FileCopyOutlined color="inherit" fontSize="inherit" />
                      </AddressMenuIcon>
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          {toShortAddress(account)}
                        </Typography>
                      </Grid>
                    </AddressMenuItem>
                    <AddressMenuItem
                      container
                      alignItems="center"
                      onClick={handleNetworkClick}
                    >
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          Change network ({network})
                        </Typography>
                      </Grid>
                    </AddressMenuItem>
                    <AddressMenuItem
                      style={{
                        borderTop: "2px solid rgba(255, 255, 255, 0.2)",
                      }}
                      container
                      alignItems="center"
                      onClick={handleLogout}
                    >
                      <AddressMenuIcon item>
                        <ExitToAppOutlined color="inherit" fontSize="inherit" />
                      </AddressMenuIcon>
                      <Grid item>
                        <Typography variant="subtitle2" color="textSecondary">
                          Log out
                        </Typography>
                      </Grid>
                    </AddressMenuItem>
                  </AddressMenu>
                </StyledPopover>
              </>
            ) : !isMobileSmall ? (
              <Grid container justify="flex-end" wrap="nowrap" spacing={1}>
                <Grid item>
                  <Link
                    href="https://github.com/dOrgTech/homebase-app/issues/new"
                    rel="noreferrer noopener"
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    <Button color="secondary" variant="outlined">
                      Submit an issue
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <ChangeNetworkButton />
                </Grid>
                <Grid item>
                  <ConnectWalletButton connect={() => connect()} />
                </Grid>
              </Grid>
            ) : (
              <Grid container justify="flex-end" wrap="nowrap">
                <Grid item>
                  <LogIn onClick={() => connect()} />
                </Grid>
              </Grid>
            )}
          </ToolbarWrapper>
        </Grid>
      </StyledToolbar>
      <NetworkMenu
        open={networkPopperOpen}
        anchorEl={networkAnchorEl}
        onClose={() => {
          setNetworkPopperOpen(false);
        }}
        handleNetworkChange={handleNetworkChange}
      />
    </StyledAppBar>
  );
};
