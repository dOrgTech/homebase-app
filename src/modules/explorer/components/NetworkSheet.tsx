import { styled, Grid, Typography, capitalize } from "@material-ui/core";
import React, { useMemo } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { Network } from "services/beacon/context";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { ColorDot, networkDotColorMap } from "./ChangeNetworkButton";
import { ContentContainer } from "./ContentContainer";

const SheetItem = styled(ContentContainer)({
  height: 50,
  "& > *": {
    height: "100%",
  },
  cursor: "pointer",
});

interface Props {
  open: boolean;
  onClose: () => void;
}

const SUPPORTED_NETWORKS: Network[] = ["mainnet", "hangzhounet"];

export const NetworkSheet: React.FC<Props> = (props) => {
  const { network, changeNetwork } = useTezos();

  const options = useMemo(() => SUPPORTED_NETWORKS.filter((n) => n !== network), [network]);

  const handleChangeNetwork = (networkOption: Network) => {
    props.onClose();
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(network, networkOption);
    changeNetwork(networkOption);
    window.history.replaceState(null, "", newPath);
  };

  return (
    <ResponsiveDialog open={props.open} onClose={props.onClose} title={"Choose Network"}>
      <Grid container direction={"column"} style={{ gap: 20 }}>
        {options.map((networkOption, i) => (
          <SheetItem item key={`network-${i}`} onClick={() => handleChangeNetwork(networkOption)}>
            <Grid container justifyContent='center' alignItems='center' style={{ gap: 8 }}>
              <Grid item>
                <ColorDot color={networkDotColorMap[networkOption]} />
              </Grid>
              <Grid item>
                <Typography variant={"h6"} color='textPrimary'>
                  {capitalize(networkOption)}
                </Typography>
              </Grid>
            </Grid>
          </SheetItem>
        ))}
      </Grid>
    </ResponsiveDialog>
  );
};
