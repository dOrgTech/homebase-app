import {
  Grid,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
  styled,
} from "@material-ui/core";
import React from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ProfileAvatar } from "./styled/ProfileAvatar";
import { UserProfileName } from "./UserProfileName";

const Text = styled(Typography)({
  wordBreak: "break-all"
})

export const UserBadge: React.FC<{ address: string, size?: number, gap?: number, short?: boolean }> = ({ address, size, gap, short }) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { network } = useTezos();

  return (
    <Grid container wrap="nowrap" alignItems="center" direction="row" style={{ gap: gap || 8 }}>
      <Grid item>
        <ProfileAvatar address={address} size={size || 22} />
      </Grid>
      <Grid item>
        <Link href={`https://${network}.tzkt.io/` + address} target="_blank">
          <Text variant="body1" color="textPrimary">
            <UserProfileName
              address={address}
              short={short || isMobileSmall || isMediumSmall}
            />
          </Text>
        </Link>
      </Grid>
    </Grid>
  );
};
