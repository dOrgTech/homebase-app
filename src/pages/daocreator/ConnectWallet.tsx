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
import { deployContract } from "../../services/deployContract";
import { useConnectWallet } from "../../store/wallet/hook";

const PageContainer = styled(Grid)({
  height: "100%",
});

export const ConnectWallet: React.FC = () => {
  const { tezos, connect } = useConnectWallet();
  console.log(tezos);

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
            <ListItem button={true} onClick={() => connect("thanos")}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Thanos" />
            </ListItem>
            <ListItem button={true} onClick={() => connect("tezbridge")}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="TezBridge" />
            </ListItem>
          </List>
          {tezos && (
            <Button onClick={async () => await deployContract(tezos)}>
              Deploy contract
            </Button>
          )}
        </Box>
      </Grid>
    </PageContainer>
  );
};
