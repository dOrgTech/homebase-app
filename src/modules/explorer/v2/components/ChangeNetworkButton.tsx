import {
  Box,
  capitalize,
  Grid,
  styled,
  Typography,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ActionSheet, useActionSheet } from "../context/ActionSheets";

const StyledConnectedButton = styled(Box)({
  "& > *": {
    height: "100%",
  },
  background: "#24282B",
  borderRadius: 4,
  padding: 5,
  cursor: "pointer",
  "&:hover": {
    background: "rgb(39, 56, 51)"
  }
});

const ColorDot = styled(Box)({
  height: 6,
  width: 6,
  backgroundColor: ({ color }: { color: string }) => color,
  borderRadius: "50%",
});

const NetworkText = styled(Typography)({
  fontSize: "14px",
});

export const ChangeNetworkButton = () => {
  const { network } = useTezos()
  const theme = useTheme();
  const { open } = useActionSheet(ActionSheet.Network);

  return (
    <StyledConnectedButton onClick={() => open()}>
      <Grid container style={{ gap: 5 }} alignItems="center" wrap="nowrap">
        <Grid item>
          <ColorDot color={theme.palette.secondary.main} />
        </Grid>
        <Grid item>
          <NetworkText color="textPrimary">{capitalize(network)}</NetworkText>
        </Grid>
      </Grid>
    </StyledConnectedButton>
  );
};