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
import { AppState } from "../../../store";
import { useConnectWallet } from "../../../store/wallet/hook";

const PageContainer = styled(Grid)({
  height: "90%",
});

const SpacingTitle = styled(Typography)({
  marginBottom: 15,
});

export const ConnectWallet: React.FC = () => {
  const { tezos, connect } = useConnectWallet();

  const account = useSelector<AppState, AppState["wallet"]["address"]>(
    (state) => state.wallet.address
  );

  return (
    <PageContainer container justify="flex-start" alignItems="center">
      <Grid item>
        <SpacingTitle align="left" variant="h3" color="textSecondary">
          Connect your wallet
        </SpacingTitle>
        <SpacingTitle align="left" variant="subtitle1" color="textSecondary">
          Create an organization by picking a template below
        </SpacingTitle>
        <Box>
          <List>
            <ListItem button={true} onClick={() => connect()}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="subtitle1" color="textSecondary">
                  {" "}
                  Connect
                </Typography>{" "}
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Grid>
    </PageContainer>
  );
};
