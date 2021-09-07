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

export const UserBadge: React.FC<{ address: string }> = ({ address }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { network } = useTezos();

  return (
    <Grid container alignItems="center" direction="row" style={{ gap: 8 }}>
      <Grid item>
        <ProfileAvatar address={address} size={22} />
      </Grid>
      <Grid item>
        <Link href={`https://${network}.tzkt.io/` + address} target="_blank">
          <Typography variant="body1" color="textSecondary">
            <UserProfileName
              address={address}
              short={isMobileSmall || isMediumSmall}
            />
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};
