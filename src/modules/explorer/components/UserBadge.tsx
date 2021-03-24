import {
  Grid,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Blockie } from "modules/common/Blockie";
import React from "react";
import { toShortAddress } from "services/contracts/utils";
import { HighlightedBadge } from "./styled/HighlightedBadge";

export const UserBadge: React.FC<{ address: string; full?: boolean }> = ({
  address,
  full,
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <HighlightedBadge
      justify="center"
      alignItems="center"
      direction="row"
      container
    >
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
              {isMobileSmall ? toShortAddress(address) : address}
            </Typography>
          </Link>
        </Grid>
      )}
    </HighlightedBadge>
  );
};
