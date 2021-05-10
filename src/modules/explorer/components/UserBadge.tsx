import {
  Grid,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
  styled
} from "@material-ui/core";
import { Blockie } from "modules/common/Blockie";
import React from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { HighlightedBadge } from "./styled/HighlightedBadge";

const CustomBlockie = styled(Blockie)({
  marginRight: 2,
});

export const UserBadge: React.FC<{ address: string; full?: boolean }> = ({
  address,
  full
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const { network } = useTezos()

  return (
    <HighlightedBadge
      justify="center"
      alignItems="center"
      direction="row"
      container
    >
      <Grid item>
        <CustomBlockie address={address} size={22} />
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
          <Link href={`https://${network}.tzkt.io/` + address} target="_blank">
            <Typography
              variant="body1"
              color="textSecondary"
              style={
                isLargeScreen ? { paddingLeft: 2, fontSize: 14.5 } : undefined
              }
            >
              {isMobileSmall || isMediumSmall
                ? toShortAddress(address)
                : address}
            </Typography>
          </Link>
        </Grid>
      )}
    </HighlightedBadge>
  );
};
