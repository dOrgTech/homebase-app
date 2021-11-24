import { styled, Grid, Typography } from "@material-ui/core";
import { Blockie } from "modules/common/Blockie";
import { CopyButton } from "modules/common/CopyButton";
import React from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { ArrowDownwardOutlined, ExitToApp } from "@material-ui/icons";
import { BottomSheet } from "./BottomSheet";

const SheetContainer = styled(Grid)({
  paddingTop: 50,
});

const SheetItem = styled(Grid)({
  height: 65,
  borderTop: "0.25px solid #7D8C8B",
  "& > *": {
    height: "100%"
  }
});

interface Props {
  open: boolean;
  onClose: () => void;
}

const MenuText = styled(Typography)({
  fontSize: 14,
});

export const ConnectionSheet: React.FC<Props> = (props) => {
  const { account } = useTezos();

  return (
    <BottomSheet open={props.open} onDismiss={props.onClose}>
      <SheetContainer>
        <SheetItem>
          <Grid container justifyContent="center" style={{ gap: 9 }} alignItems="center">
            {account ? (
              <>
                <Grid item>
                  <Blockie address={account} size={24} />
                </Grid>
                <Grid item>
                  <MenuText color="textPrimary">
                    {toShortAddress(account)}
                  </MenuText>
                </Grid>
                <Grid item>
                  <CopyButton text={account} />
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <ArrowDownwardOutlined htmlColor="#FFF" fontSize="small" />
                </Grid>
                <Grid item>
                  <MenuText color="textPrimary">
                    Connect Wallet
                  </MenuText>
                </Grid>
              </>
            )}
          </Grid>
        </SheetItem>
        <SheetItem>
          <Grid container justifyContent="center" style={{ gap: 9 }} alignItems="center">
            <Grid item>
              <ExitToApp htmlColor="#FFF" fontSize="small" />
            </Grid>
            <Grid item>
              <MenuText color="textPrimary">Log Out</MenuText>
            </Grid>
          </Grid>
        </SheetItem>
      </SheetContainer>
    </BottomSheet>
  );
};
