import { styled, Grid, Typography, capitalize } from "@material-ui/core";
import React, { useMemo } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BottomSheet } from "./BottomSheet";
import { Network } from "services/beacon/context";

const SheetContainer = styled(Grid)({
  paddingTop: 50,
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

const MenuText = styled(Typography)({
  fontSize: 14,
});

const SUPPORTED_NETWORKS: Network[] = ["mainnet", "florencenet", "granadanet"];

export const NetworkSheet: React.FC<Props> = (props) => {
  const { network, changeNetwork } = useTezos();

  const options = useMemo(
    () => SUPPORTED_NETWORKS.filter((n) => n !== network),
    [network]
  );

  return (
    <BottomSheet open={props.open} onDismiss={props.onClose}>
      <SheetContainer>
        {options.map((networkOption, i) => (
          <SheetItem key={`network-${i}`} onClick={() => {
              props.onClose()
              changeNetwork(networkOption)
            }}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <MenuText color="textPrimary">{capitalize(networkOption)}</MenuText>
              </Grid>
            </Grid>
          </SheetItem>
        ))}
      </SheetContainer>
    </BottomSheet>
  );
};
