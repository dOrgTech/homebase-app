import React, { useCallback, useMemo } from "react";
import { Grid, styled, Typography, Button, useTheme, useMediaQuery, Tooltip } from "@material-ui/core";

import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import { useDAOID } from "./router";

import { UserBalancesBox } from "../../components/UserBalances";
import { ContentContainer } from "../../components/ContentContainer";
import { ProposalsList } from "../../components/ProposalsList";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";
import { DAOStatsRow } from "../../components/DAOStatsRow";
import { UsersTable } from "../../components/UsersTable";
import BigNumber from "bignumber.js";
import { InfoIcon } from "../../components/styled/InfoIcon";
import { MigrationSection } from "modules/explorer/components/MigrationSection";

const HeroContainer = styled(ContentContainer)(({ theme }) => ({
  padding: "38px 55px",

  [theme.breakpoints.down("xs")]: {
    padding: "38px 29px",
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: 64,
  fontWeight: 500,

  [theme.breakpoints.down("xs")]: {
    fontSize: 26,
  },
}));

const SubtitleText = styled(Typography)({
  fontWeight: 400,
});

const ExecuteButton = styled(Button)({
  marginTop: "-35px",
});

const TableContainer = styled(ContentContainer)({
  width: "100%",
});

export const DAO: React.FC = () => {
  const daoId = useDAOID();
  const { data, cycleInfo, ledger } = useDAO(daoId);
  const { mutate } = useFlush();
  const theme = useTheme();
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const name = data && data.data.name;
  const description = data && data.data.description;

  const { data: proposals } = useProposals(daoId, ProposalStatus.ACTIVE);

  const onFlush = useCallback(async () => {
    if (proposals && proposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: proposals.length + 1,
      });
      return;
    }
  }, [data, mutate, proposals]);

  const usersTableData = useMemo(() => {
    if (!ledger || !cycleInfo || !data) {
      return [];
    }

    return ledger
      .sort((a, b) => b.available_balance.minus(a.available_balance).toNumber())
      .map((p) => ({
        address: p.holder.address,
        totalStaked: new BigNumber(p.total_balance).dp(10).toString(),
        availableStaked: new BigNumber(p.available_balance).dp(10).toString(),
        votes: p.holder.votes_cast.toString(),
        proposalsVoted: p.holder.proposals_voted.toString(),
      }));
  }, [cycleInfo, data, ledger]);

  return (
    <Grid container direction='column' style={{ gap: isExtraSmall ? 25 : 42 }}>
      <HeroContainer item>
        <Grid container direction='column' style={{ gap: 36 }}>
          <Grid item>
            <Grid container style={{ gap: 20 }} alignItems='baseline'>
              <Grid item>
                <TitleText color='textPrimary'>{name}</TitleText>
              </Grid>
              <Grid item>
                <ExecuteButton
                  variant='contained'
                  color='secondary'
                  size={isExtraSmall ? "small" : "medium"}
                  onClick={onFlush}>
                  Execute
                </ExecuteButton>
                <Tooltip placement='bottom' title='Execute all passed proposals and drop all expired or rejected'>
                  <InfoIcon color='secondary' />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <SubtitleText variant='body1' color='textPrimary'>
              {description}
            </SubtitleText>
          </Grid>
        </Grid>
      </HeroContainer>
      <MigrationSection />
      <UserBalancesBox daoId={daoId} />
      <DAOStatsRow />

      {data && cycleInfo && proposals && (
        <ProposalsList
          showFooter
          title='Active Proposals'
          currentLevel={cycleInfo.currentLevel}
          proposals={proposals}
        />
      )}
      <TableContainer item>
        <UsersTable data={usersTableData} />
      </TableContainer>
    </Grid>
  );
};
