import {
  Grid,
  GridProps,
  makeStyles,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { Blockie } from "modules/common/Blockie";
import { ExternalLink } from "modules/common/ExternalLink";
import { HighlightedBadge } from "modules/explorer/components/styled/HighlightedBadge";
import React from "react";
import { toShortAddress } from "services/contracts/utils";
import { FA2Symbol } from "./FA2Symbol";

const ArrowContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: "0 10px",
}));

const linkStyle = makeStyles({
  root: {
    color: "#fff",
    marginLeft: 6,
  },
});

interface Props extends GridProps {
  address: string;
  amount: string;
  currency?: string;
  contract?: string;
  long?: boolean;
}

export const TransferBadge: React.FC<Props> = ({
  address,
  amount,
  currency,
  long,
  contract,
  ...props
}) => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const link = linkStyle();
  return (
    <HighlightedBadge
      justify="center"
      alignItems="center"
      direction="row"
      container
      {...props}
    >
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          {amount} {contract ? <FA2Symbol contractAddress={contract} /> : currency}
        </Typography>
      </Grid>
      <ArrowContainer item>
        <ArrowForward color="inherit" />
      </ArrowContainer>
      <Grid item>
        <Blockie address={address} size={23} />
      </Grid>
      <Grid item>
        {!long ? (
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ paddingLeft: 8 }}
          >
            {toShortAddress(address)}
          </Typography>
        ) : (
          <>
            <Typography>
              <ExternalLink
                className={link.root}
                link={"https://edo2net.tzkt.io/" + address}
              >
                {isMobileSmall ? toShortAddress(address) : address}
              </ExternalLink>
            </Typography>
          </>
        )}
      </Grid>
    </HighlightedBadge>
  );
};
