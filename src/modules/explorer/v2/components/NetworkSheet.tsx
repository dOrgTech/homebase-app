import { styled, Grid, Typography, capitalize } from "@material-ui/core";
import React, { useMemo } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { Network } from "services/beacon/context";
import {ResponsiveDialog} from "./ResponsiveDialog";
import {ColorDot, networkDotColorMap} from "./ChangeNetworkButton";

const SheetContainer = styled(Grid)({
  padding: 12,
});

const SheetItem = styled(Grid)({
  height: 65,
  borderTop: "0.25px solid #7D8C8B",
  "& > *": {
    height: "100%",
  },
  cursor: "pointer"
});

interface Props {
  open: boolean;
  onClose: () => void;
}

const TitleContainer = styled(Grid)({
  padding: 25
})

const SUPPORTED_NETWORKS: Network[] = ["mainnet", "hangzhounet"];

export const NetworkSheet: React.FC<Props> = (props) => {
  const { network, changeNetwork } = useTezos();

  const options = useMemo(
    () => SUPPORTED_NETWORKS.filter((n) => n !== network),
    [network]
  );

  return (
    <ResponsiveDialog open={props.open} onClose={props.onClose}>
      <SheetContainer container direction={"column"}>
        <TitleContainer item>
          <Typography variant={"h4"} align={"center"} color={"textPrimary"}>Choose Network</Typography>
        </TitleContainer>
        {options.map((networkOption, i) => (
          <SheetItem item key={`network-${i}`} onClick={() => {
              props.onClose()
              changeNetwork(networkOption)
            }}>
            <Grid container justifyContent="center" alignItems="center" style={{ gap: 8 }}>
              <Grid item>
                <ColorDot color={networkDotColorMap[networkOption]} />
              </Grid>
              <Grid item>
                <Typography variant={"h6"} color="textPrimary">{capitalize(networkOption)}</Typography>
              </Grid>
            </Grid>
          </SheetItem>
        ))}
      </SheetContainer>
    </ResponsiveDialog>
  );
};
