import {
  Grid,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import React from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ProfileAvatar } from "./styled/ProfileAvatar";
import { UserProfileName } from "./UserProfileName";

export const UserBadge: React.FC<{ address: string, size?: number, short?: boolean }> = ({ address, size, short }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { network } = useTezos();

  return (
    <Grid container alignItems="center" direction="row" style={{ gap: 8 }} wrap="nowrap">
      <Grid item>
        <ProfileAvatar address={address} size={size || 22} />
      </Grid>
      <Grid item>
        <Link href={`https://${network}.tzkt.io/` + address} target="_blank">
          <Typography variant="body1" color="textSecondary">
            <UserProfileName
              address={address}
              short={short || isMobileSmall || isMediumSmall}
            />
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};
