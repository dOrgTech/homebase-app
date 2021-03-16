import { Grid, Link, styled, Typography } from "@material-ui/core";
import { Blockie } from "modules/common/Blockie";
import React from "react";
import { toShortAddress } from "services/contracts/utils";
import hexToRgba from "hex-to-rgba";

const Container = styled(Grid)(({ theme }) => ({
  backgroundColor: hexToRgba(theme.palette.secondary.light, 0.07),
  boxSizing: "border-box",
  padding: 8,
  width: "fit-content",
  borderRadius: 4,
}));

export const UserBadge: React.FC<{ address: string; full?: boolean }> = ({
  address,
  full,
}) => {
  return (
    <Container justify="center" alignItems="center" direction="row" container>
      <Grid item>
        <Blockie address={address} size={23} />
      </Grid>
      {!full ? (
        <Grid item>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ paddingLeft: 8 }}
          >
            {toShortAddress(address)}
          </Typography>
        </Grid>
      ) : (
        <Grid item>
          <Link href={"https://edo2net.tzkt.io/" + address} target="_blank">
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ paddingLeft: 8 }}
            >
              {address}
            </Typography>
          </Link>
        </Grid>
      )}
    </Container>
  );
};
