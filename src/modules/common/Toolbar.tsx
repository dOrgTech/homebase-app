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
  withTheme
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { TezosToolkit } from "@taquito/taquito";

import HomeButton from "assets/logos/homebase.svg";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { Blockie } from "./Blockie";
import { ExitToAppOutlined, FileCopyOutlined } from "@material-ui/icons";
import { AccountBalanceWallet } from "@material-ui/icons";
import { useVisitedDAO } from "services/contracts/baseDAO/hooks/useVisitedDAO";
import { useTokenHolders } from "services/contracts/baseDAO/hooks/useTokenHolders";

const StyledAppBar = styled(AppBar)({
  boxShadow: "none"
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
  marginLeft: 8
});

const AddressContainer = styled(Grid)({
  width: "min-content",
  paddingRight: 24,
  cursor: "pointer"
});

const LogoText = styled(Typography)({
  fontWeight: "bold",
  fontSize: "24px",
  cursor: "pointer"
});

const ConnectWallet = styled(Button)({
  maxHeight: 50,
  alignSelf: "baseline"
});

const AddressMenu = styled(Box)(() => ({
  width: 264,
  borderRadius: 4,
  backgroundColor: "#282B31"
}));

const AddressMenuItem = styled(Grid)(({ theme }) => ({
  cursor: "pointer",
  boxSizing: "border-box",
  color: theme.palette.text.secondary,
  padding: "20px 34px",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${theme.palette.secondary.light}`,
    cursor: "pointer"
  }
}));

const AddressMenuIcon = styled(Grid)({
  paddingRight: "12px",
  marginBottom: "-4px"
});

const AddressBarWrapper = styled(Grid)(({ theme }) => ({
  padding: "15px",
  marginRight: 10,
  borderRadius: 4,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)"
  },
  [theme.breakpoints.down("xs")]: {
    marginLeft: 15,
    padding: "0px"
  }
}));

const custom = (theme: Theme, mode: "creator" | "explorer") => ({
  appBorder: {
    borderBottom:
      mode === "explorer" ? `2px solid ${theme.palette.primary.light}` : "unset"
  }
});

const LogoItem = styled("img")({
  cursor: "pointer"
});

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4
  }
});

const LogIn = styled(AccountBalanceWallet)(({ theme }) => ({
  color: theme.palette.secondary.main,
  height: 28,
  width: 28,
  marginLeft: 15
}));

const ToolbarContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    justifyContent: "center",
    marginLeft: 16
  }
}));

const BalanceContainer = styled(Grid)({
  background: "rgb(75, 207, 147)",
  borderRadius: 4,
  padding: 4,
  "&:hover": {
    background: "#608871"
  }
});

const Symbol = styled(Typography)({
  marginLeft: 4
});

export const ConnectWalletButton = ({
  connect
}: {
  connect: () => Promise<TezosToolkit>;
}) => (
  <ConnectWallet color="secondary" variant="outlined" onClick={connect}>
    Connect Wallet
  </ConnectWallet>
);

const StyledExplorerAppBar = styled(StyledAppBar)({
  minHeight: 100
});

const StyledCreatorAppBar = styled(withTheme(StyledAppBar))(props => ({
  borderBottom: `2px solid ${props.theme.palette.primary.light}`,
  minHeight: 80
})
);

interface BaseGridProps {
  children: any, mode: "creator" | "explorer", isMobileSmall: boolean, isMobileExtraSmall: boolean
}

export const BaseGrid = ({
  children,
  mode,
  isMobileSmall,
  isMobileExtraSmall,
}: BaseGridProps): JSX.Element => {
  return (
    <Grid
      item
      xs={
        mode === "creator" && !isMobileSmall
          ? 12
          : isMobileExtraSmall
            ? 1
            : 9
      }
      container
      justify={
        isMobileExtraSmall && mode === "explorer"
          ? "flex-start"
          : "flex-end"
      }
    >
      {children}
    </Grid>
  );
};

interface ExplorerLogoProps {
  history: any,
}

export const ExplorerLogo = ({
  history,
}: ExplorerLogoProps): JSX.Element => {
  return (
    <>
      <Grid
        item
        xs={11}
        sm={3}
      >
        <Box
          onClick={() => history.push("/explorer")}
        >
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
  mode
}) => {
  const { connect, account, reset } = useTezos();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [popperOpen, setPopperOpen] = useState(false);
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { daoId, daoSymbol } = useVisitedDAO();
  const { data } = useTokenHolders(daoId);

  console.log(data);

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
    const balance = data.find(({ address }) => address.toLowerCase() === account.toLowerCase());
    const unfrozenBalance = balance ? balance.balances[0] : 0;
    return unfrozenBalance || 0;
  }, [data, account])

  const history = useHistory();

  return (
    <StyledAppBar
      position="sticky"
      color="primary"
      style={
        mode === "explorer" ?
          custom(theme, mode).appBorder :
          undefined
      }
    >
      <StyledToolbar>
        <Grid container direction="row" alignItems="center" wrap="wrap">
          {mode === "explorer" ? (
            <ExplorerLogo history={history} />
          ) : null}
          <BaseGrid mode={mode} isMobileSmall={isMobileSmall} isMobileExtraSmall={isMobileExtraSmall}>
            {account ? (
              <>
                <Grid
                  container
                  alignItems="center"
                  justify={isMobileExtraSmall ? "flex-start" : "flex-end"}
                >
                  <Grid
                    item
                    xs={7}
                    container
                    justify="flex-end"
                    direction="row"
                  >
                    {!isMobileSmall && data && data.length > 0 ? (
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
                        <Symbol color="textSecondary">{daoSymbol}</Symbol>
                      </BalanceContainer>
                    ) : null}
                  </Grid>
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
                    style: { borderRadius: 4, backgroundColor: "transparent" }
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
                      style={{
                        borderTop: "2px solid rgba(255, 255, 255, 0.2)"
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
              <ConnectWalletButton connect={connect} />
            ) : (
              <LogIn onClick={connect} />
            )}
          </BaseGrid>
        </Grid>
      </StyledToolbar>
    </StyledAppBar >
  );
};
