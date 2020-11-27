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
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import React from "react";

const PageContainer = styled(Grid)({
  height: "100%",
});

export const ConnectWallet: React.FC = () => {
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
            <ListItem button={true}>
              <ListItemAvatar>
                <Avatar>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Thanos" />
            </ListItem>
          </List>
        </Box>
      </Grid>
    </PageContainer>
  );
};
