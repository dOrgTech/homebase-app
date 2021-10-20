import React, { useCallback } from "react";
import {
  Grid,
  styled,
  Typography,
  Button,
} from "@material-ui/core";

import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import { useDAOID } from "./router";

import { UserBadge } from "modules/explorer/components/UserBadge";
import { UserBalancesBox } from "../../components/UserBalances";
import { ContentContainer } from "../../components/ContentContainer";
import { ProposalsList } from "../../components/ProposalsList";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";

const HeroContainer = styled(ContentContainer)({
  padding: "38px 55px",
});

const TitleText = styled(Typography)({
  fontSize: 64,
  fontWeight: 500,
});

const SubtitleText = styled(Typography)({
  fontWeight: 400,
});

const ExecuteButton = styled(Button)({
  marginTop: "-35px",
});

const TableContainer = styled(ContentContainer)({
  width: "100%",
});

const TableHeader = styled(Grid)({
  minHeight: 76,
  padding: "24px 54px",
});

const HolderTableItem = styled(Grid)({
  padding: "30px 54px",
  borderTop: `0.3px solid #5E6969`,
});

const TableSubHeader = styled(Grid)({
  padding: "10px 54px",
  borderTop: `0.3px solid #5E6969`,
});

export const DAO: React.FC = () => {
  const daoId = useDAOID();
  const { data, cycleInfo, ledger } = useDAO(daoId);
  const { mutate } = useFlush();

  const name = data && data.data.name;
  const description = data && data.data.description;

  const { data: proposals } =
    useProposals(daoId, ProposalStatus.ACTIVE);

  const onFlush = useCallback(async () => {
    if (proposals && proposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: proposals.length + 1,
      });
      return;
    }
  }, [data, mutate, proposals]);

  return (
    <Grid container direction="column" style={{ gap: 42 }}>
      <HeroContainer item>
        <Grid container direction="column" style={{ gap: 36 }}>
          <Grid item>
            <Grid container style={{ gap: 20 }} alignItems="baseline">
              <Grid item>
                <TitleText color="textPrimary">{name}</TitleText>
              </Grid>
              <Grid item>
                <ExecuteButton
                  variant="contained"
                  color="secondary"
                  onClick={onFlush}
                >
                  Execute
                </ExecuteButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <SubtitleText variant="body1" color="textPrimary">
              {description}
            </SubtitleText>
          </Grid>
        </Grid>
      </HeroContainer>
      <UserBalancesBox daoId={daoId} />
      
      { data && cycleInfo && proposals && (<ProposalsList showFooter title="Active Proposals" currentLevel={cycleInfo.currentLevel} proposals={proposals} />)}
      <TableContainer item container direction="column">
          <TableHeader item>
            <Typography variant="body1" color="textPrimary">
              Top Adresses
            </Typography>
          </TableHeader>

          <TableSubHeader item container justifyContent="space-between">
            <Grid item sm={4}>
              <Typography color="textPrimary">Rank</Typography>
            </Grid>
            <Grid item sm={2}>
              <Typography color="textPrimary">Votes</Typography>
            </Grid>
            <Grid item sm={2}>
              <Typography color="textPrimary">Weight</Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography color="textPrimary">Proposals Voted</Typography>
            </Grid>
          </TableSubHeader>

          <Grid item>
            <Grid container>
              {cycleInfo &&
                ledger &&
                data &&
                ledger
                  ?.sort((a, b) =>
                    b.available_balance.minus(a.available_balance).toNumber()
                  )
                  .map((p, i) => (
                    <Grid item key={`holder-${i}`} xs={12}>
                      <HolderTableItem container>
                        <Grid item sm={4}>
                          <Grid
                            container
                            alignItems="center"
                            style={{ gap: 21 }}
                            wrap="nowrap"
                          >
                            <Grid item>
                              <Typography color="secondary">{i + 1}</Typography>
                            </Grid>
                            <Grid item>
                              <UserBadge
                                address={p.holder.address}
                                size={44}
                                gap={16}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item sm={2}>
                          <Typography color="textPrimary">
                            {p.holder.votes_cast.toString()}
                          </Typography>
                        </Grid>
                        <Grid item sm={2}>
                          <Typography color="textPrimary">
                            {p.available_balance
                              .multipliedBy(100)
                              .div(data.data.token.supply)
                              .decimalPlaces(2)
                              .toString()}{" "}
                            %
                          </Typography>
                        </Grid>
                        <Grid item sm={4}>
                          <Typography color="textPrimary">
                            {p.holder.proposals_voted.toString()}
                          </Typography>
                        </Grid>
                      </HolderTableItem>
                    </Grid>
                  ))}
            </Grid>
          </Grid>
      </TableContainer>
    </Grid>
  );
};
