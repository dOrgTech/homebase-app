import {
  styled,
  Box,
  Grid,
  Button,
  Typography,
  Popover,
  useMediaQuery,
  useTheme,
  PopoverProps,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Network } from "services/beacon/context";
import { useTezos } from "services/beacon/hooks/useTezos";

const StyledPopover = styled(Popover)({
  ".MuiPaper-root": {
    borderRadius: 4,
  },
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

export const ChangeNetworkButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [popperOpen, setPopperOpen] = useState(false);
  const { changeNetwork, network } = useTezos();
  const history = useHistory();
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(!popperOpen);
  };

  const handleNetworkChange = (network: Network) => {
    changeNetwork(network);
    setPopperOpen(!popperOpen);
    history.push("/explorer/daos");
  };

  return (
    <>
      <Button color="secondary" variant="outlined" onClick={handleClick}>
        {isMobileSmall ? "" : "Network: "}
        {network}
      </Button>
      <NetworkMenu
        open={popperOpen}
        anchorEl={anchorEl}
        onClose={() => {
          setPopperOpen(false);
        }}
        handleNetworkChange={handleNetworkChange}
      />
    </>
  );
};

export const NetworkMenu: React.FC<
  PopoverProps & { handleNetworkChange: (network: Network) => void }
> = ({ handleNetworkChange, ...props }) => {
  return (
    <StyledPopover
      id={"wallet-Popper"}
      style={{ zIndex: 1500, borderRadius: 4 }}
      PaperProps={{
        style: { borderRadius: 4, backgroundColor: "transparent" },
      }}
      {...props}
    >
      <AddressMenu>
        <AddressMenuItem
          container
          alignItems="center"
          onClick={() => handleNetworkChange("mainnet")}
        >
          <Grid item>
            <Typography variant="subtitle2" color="textSecondary">
              MAINNET
            </Typography>
          </Grid>
        </AddressMenuItem>
        <AddressMenuItem
          container
          alignItems="center"
          onClick={() => handleNetworkChange("florencenet")}
        >
          <Grid item>
            <Typography variant="subtitle2" color="textSecondary">
              FLORENCENET
            </Typography>
          </Grid>
        </AddressMenuItem>
      </AddressMenu>
    </StyledPopover>
  );
};
