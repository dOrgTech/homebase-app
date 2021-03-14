import {
  Box,
  Grid,
  styled,
  Typography,
  LinearProgress,
  Tooltip,
} from "@material-ui/core";
import React, { useCallback, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ProposalTableRow } from "modules/explorer/components/ProposalTableRow";
import { TokenHoldersDialog } from "modules/explorer/components/TokenHolders";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { Button } from "@material-ui/core";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { ActionTypes, ModalsContext } from "../ModalsContext";
import { connectIfNotConnected } from "services/contracts/utils";
import { useTezos } from "services/beacon/hooks/useTezos";
import { Info } from "@material-ui/icons";

const StyledContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  height: 184,
  paddingTop: "4%",
  boxSizing: "border-box",
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  paddingBottom: 0,
  padding: "40px 112px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const StatsBox = styled(Grid)(({ theme }) => ({
  borderRight: `2px solid ${theme.palette.primary.light}`,
  width: "unset",
  "&:last-child": {
    borderRight: "none",
  },
}));

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

const StatsContainer = styled(Grid)(({ theme }) => ({
  height: 175,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const TokensLocked = styled(StatsBox)({
  padding: "0 50px 0 112px",
});

const LockedTokensBar = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  "&.MuiLinearProgress-colorSecondary": {
    background: `${theme.palette.primary.light}`,
  },
}));

const VotingAddresses = styled(StatsBox)({
  minWidth: 250,
});

const ActiveProposals = styled(StatsBox)({
  paddingLeft: "42px",
});

const TableContainer = styled(Box)({
  width: "100%",
  padding: "72px 112px",
  paddingBottom: 30,
  boxSizing: "border-box",
});

const TableHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 20,
}));

const ProposalTableHeadText = styled(Typography)({
  fontWeight: "bold",
});

const StyledButton = styled(Button)(({ theme }) => ({
  height: 53,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
}));

const InfoIconInput = styled(Info)({
  cursor: "default",
  top: 0,
  fontSize: 20,
  marginLeft: 6,
});

const FlushContainer = styled(Grid)({
  display: "flex",
});

export const Proposals: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: dao } = useDAO(id);
  const { data } = useDAO(id);
  const { mutate } = useFlush();

  const { tezos, connect } = useTezos();
  const name = dao && dao.metadata.unfrozenToken.name;
  const symbol = dao && dao.metadata.unfrozenToken.symbol.toUpperCase();
  const amountLocked = useMemo(() => {
    if (!dao) {
      return 0;
    }

    return dao.ledger.reduce((acc, current) => {
      const frozenBalance = current.balances[1] || 0;
      return acc + frozenBalance;
    }, 0);
  }, [dao]);

  const amountNotLocked = useMemo(() => {
    if (!dao) {
      return 0;
    }

    return dao.ledger.reduce((acc, current) => {
      const frozenBalance = current.balances[0] || 0;
      return acc + frozenBalance;
    }, 0);
  }, [dao]);

  const addressesWithUnfrozenBalance = useMemo(() => {
    if (!dao) {
      return 0;
    }

    return dao.ledger.reduce((acc, current) => {
      const frozenBalance = current.balances[0];
      if (frozenBalance) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }, [dao]);

  const totalTokens = amountLocked + amountNotLocked;

  const amountLockedPercentage = totalTokens
    ? (amountLocked / totalTokens) * 100
    : 0;

  const { data: proposalsData } = useProposals(dao && dao.address);

  const activeProposals = useMemo(() => {
    if (!proposalsData) {
      return [];
    }

    return proposalsData.filter(
      (proposalData) => proposalData.status === ProposalStatus.ACTIVE
    );
  }, [proposalsData]);

  const passedProposals = useMemo(() => {
    if (!proposalsData) {
      return [];
    }

    return proposalsData.filter(
      (proposalData) => proposalData.status === ProposalStatus.PASSED
    );
  }, [proposalsData]);

  const { dispatch } = useContext(ModalsContext);

  const onNewProposal = useCallback(() => {
    if (dao) {
      switch (dao.template) {
        case "registry":
          dispatch({
            type: ActionTypes.OPEN_REGISTRY_TRANSACTION,
            payload: {
              daoAddress: dao.address,
            },
          });
          break;
        case "treasury":
          dispatch({
            type: ActionTypes.OPEN_TREASURY_PROPOSAL,
            payload: {
              daoAddress: dao.address,
            },
          });
          break;
      }
    }
  }, [dao, dispatch]);

  const onFlush = useCallback(async () => {
    await connectIfNotConnected(tezos, connect);
    // @TODO: we need to add an atribute to the proposals
    // type in order to know if it was flushed or not
    if (proposalsData && proposalsData.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: proposalsData.length + 1,
      });
      return;
    }

    console.log("no proposal data");
  }, [connect, data, mutate, proposalsData, tezos]);

  return (
    <>
      <Grid item xs>
        <MainContainer>
          <StyledContainer container direction="row">
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="secondary">
                {name}
              </Typography>
              <Typography variant="h5" color="textSecondary">
                Proposals
              </Typography>
            </Grid>
            <Grid item container xs={6} justify="flex-end" spacing={2}>
              <Grid item>
                <StyledButton
                  variant="outlined"
                  onClick={onNewProposal}
                  disabled={!dao}
                >
                  NEW PROPOSAL
                </StyledButton>
              </Grid>
              <FlushContainer item>
                <StyledButton
                  variant="outlined"
                  onClick={onFlush}
                  disabled={!dao}
                >
                  FLUSH
                </StyledButton>
                <Tooltip title="Execute all passed proposals and drop all expired or rejected">
                  <InfoIconInput color="secondary" />
                </Tooltip>
              </FlushContainer>
            </Grid>
          </StyledContainer>
        </MainContainer>
        <StatsContainer container>
          <TokensLocked
            item
            xs={6}
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
                    {amountLocked}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                {dao && <TokenHoldersDialog address={dao?.address} />}
              </Grid>
            </Grid>
            <LockedTokensBar
              variant="determinate"
              value={amountLockedPercentage}
              color="secondary"
            />
          </TokensLocked>
          <VotingAddresses
            item
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Box>
              <Typography variant="subtitle2" color="secondary">
                Voting Addresses
              </Typography>
              <Typography variant="h3" color="textSecondary">
                {addressesWithUnfrozenBalance}
              </Typography>
            </Box>
          </VotingAddresses>
          <ActiveProposals
            item
            xs
            container
            direction="column"
            justify="center"
          >
            <Box>
              <Typography variant="subtitle2" color="secondary">
                Active Proposals
              </Typography>
              <Typography variant="h3" color="textSecondary">
                {activeProposals?.length}
              </Typography>
            </Box>
          </ActiveProposals>
        </StatsContainer>
        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={4}>
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                ACTIVE PROPOSALS
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText
                variant="subtitle1"
                color="textSecondary"
                align="center"
              >
                CYCLE
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              {/* <ProposalTableHeadText
                  variant="subtitle1"
                  color="textSecondary"
                >
                  STATUS
                </ProposalTableHeadText> */}
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                THRESHOLD %
              </ProposalTableHeadText>
            </Grid>
          </TableHeader>
          {activeProposals.map((proposal, i) => (
            <ProposalTableRow
              key={`proposal-${i}`}
              {...proposal}
              daoId={dao?.address}
              quorumTreshold={dao?.storage.quorumTreshold || 0}
            />
          ))}
          {activeProposals.length === 0 ? (
            <NoProposals variant="subtitle1" color="textSecondary">
              No active proposals
            </NoProposals>
          ) : null}
        </TableContainer>

        {/* <ProposalsContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <UnderlineText
              color="textSecondary"
              variant="subtitle1"
              align="center"
            >
              LOAD MORE
            </UnderlineText>
          </ProposalsContainer> */}

        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={5}>
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                PASSED PROPOSALS
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                {""}
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={5}>
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                {""}
              </ProposalTableHeadText>
            </Grid>
          </TableHeader>
          {passedProposals.map((proposal, i) => (
            <ProposalTableRow
              key={`proposal-${i}`}
              {...proposal}
              daoId={dao?.address}
              quorumTreshold={dao?.storage.quorumTreshold || 0}
            />
          ))}

          {passedProposals.length === 0 ? (
            <NoProposals variant="subtitle1" color="textSecondary">
              No passed proposals
            </NoProposals>
          ) : null}
        </TableContainer>

        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={5}>
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                ALL PROPOSALS
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                {""}
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={5}>
              <ProposalTableHeadText variant="subtitle1" color="textSecondary">
                {""}
              </ProposalTableHeadText>
            </Grid>
          </TableHeader>
          {proposalsData &&
            proposalsData.map((proposal, i) => (
              <ProposalTableRow
                key={`proposal-${i}`}
                {...proposal}
                daoId={dao?.address}
                quorumTreshold={dao?.storage.quorumTreshold || 0}
              />
            ))}
        </TableContainer>
      </Grid>
    </>
  );
};
