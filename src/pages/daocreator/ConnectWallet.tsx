import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  styled,
  Button,
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import React from "react";
import { useSelector } from "react-redux";
import { deployContract } from "../../services/deployContract";
import { AppState } from "../../store";
import { useConnectWallet } from "../../store/wallet/hook";

const PageContainer = styled(Grid)({
  height: "100%",
});

export const ConnectWallet: React.FC = () => {
  const { tezos, connect } = useConnectWallet();

  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  return (
    <PageContainer container justify="center" alignItems="center">
      <Grid item>
        <Typography align="left" variant="h5">
          Connect your wallet
        </Typography>
        <Typography align="left" variant="body2">
          Create an organization by picking a template below
        </Typography>
        <Box>
          <List>
            <ListItem button={true} onClick={() => connect()}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Connect" />
            </ListItem>
          </List>
        </Box>
      </Grid>
    </PageContainer>
  );
};