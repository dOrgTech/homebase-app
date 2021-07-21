import {
  styled,
  Grid,
  LinearProgress,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { BigNumber } from "bignumber.js";
import React, { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { useDAO } from "services/indexer/dao";
import { StatsBox } from "./StatsBox";

const StatsContainer = styled(Grid)(({ theme }) => ({
  minHeight: 175,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  [theme.breakpoints.down("sm")]: {
    borderBottom: "unset",
  },
}));

const TokensLocked = styled(StatsBox)({
  padding: "50px 8%",
});

const VotingAddresses = styled(StatsBox)(({ theme }) => ({
  minWidth: 250,

  [theme.breakpoints.down("sm")]: {
    minWidth: "unset",
    textAlign: "center",
    borderRight: `2px solid ${theme.palette.primary.light}`,
    padding: "25px 5px",
  },
  [theme.breakpoints.up("sm")]: {
    padding: "50px 0 50px 42px",
  },
}));

const ActiveProposals = styled(StatsBox)(({ theme }) => ({
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
    padding: "25px 5px",
  },
  [theme.breakpoints.up("sm")]: {
    padding: "50px 0 50px 42px",
  },
}));

const LockedTokensBar = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: theme.palette.primary.light,
  },
}));

export const DAOStatsRow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useDAO(id);
  const theme = useTheme();
  const symbol = data && data.data.token.symbol.toUpperCase();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const { data: activeProposals } = useProposals(id, ProposalStatus.ACTIVE);

  const amountLocked = useMemo(() => {
    if (!data) {
      return new BigNumber(0);
    }

    return data.data.ledger.reduce((acc, current) => {
      const frozenBalance = new BigNumber(current.balance) || new BigNumber(0);
      return acc.plus(frozenBalance);
    }, new BigNumber(0));
  }, [data]);

  const amountNotLocked = useMemo(() => {
    if (!data) {
      return new BigNumber(0);
    }

    return data.data.token.supply
  }, [data]);

  const totalTokens = amountLocked.plus(amountNotLocked);

  const amountLockedPercentage = totalTokens
    ? amountLocked.div(totalTokens).multipliedBy(100)
    : new BigNumber(0);

  const addressesWithUnfrozenBalance = useMemo(() => {
    if (!data) {
      return new BigNumber(0);
    }

    return data.data.ledger.reduce((acc, current) => {
      const frozenBalance = current.balance;
      if (frozenBalance) {
        return acc.plus(1);
      }

      return acc;
    }, new BigNumber(0));
  }, [data]);

  return (
    <StatsContainer container>
      <TokensLocked
        item
        xs={12}
        md={6}
        container
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Box>
              <Typography variant="subtitle2" color="secondary">
                {symbol} Locked
              </Typography>
            </Box>
            <Box padding="12px 0">
              <Typography variant="h3" color="textSecondary">
                {amountLocked.dp(10).toString()}
              </Typography>
            </Box>
          </Grid>
          {/* <Grid item>
            <TokenHoldersDialog address={id} />
          </Grid> */}
        </Grid>
        <LockedTokensBar
          variant="determinate"
          value={amountLockedPercentage.toNumber()}
          color="secondary"
        />
      </TokensLocked>
      <VotingAddresses
        item
        container
        direction="column"
        alignItems="center"
        justify={isMobileSmall ? "flex-start" : "center"}
        xs={6}
        md={2}
      >
        <Box width="100%">
          <Typography variant="subtitle2" color="secondary">
            VOTING ADDRESSES
          </Typography>
          <Typography variant="h3" color="textSecondary">
            {addressesWithUnfrozenBalance.toString()}
          </Typography>
        </Box>
      </VotingAddresses>
      <ActiveProposals
        item
        xs
        container
        direction="column"
        justify="center"
        onClick={() => history.push(`/explorer/dao/${id}/proposals`)}
      >
        <Box>
          <Typography variant="subtitle2" color="secondary">
            ACTIVE PROPOSALS
          </Typography>
          <Typography variant="h3" color="textSecondary">
            {activeProposals && activeProposals.length}
          </Typography>
        </Box>
      </ActiveProposals>
    </StatsContainer>
  );
};
