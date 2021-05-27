import React, { useCallback, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  styled,
  Typography,
  useTheme,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import VotingPeriodIcon from "assets/logos/votingPeriod.svg";
import ProgressBar from "react-customizable-progressbar";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { useCycleInfo } from "services/contracts/baseDAO/hooks/useCycleInfo";
import { connectIfNotConnected } from "services/contracts/utils";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { useTezos } from "services/beacon/hooks/useTezos";
import { CopyAddress } from "modules/common/CopyAddress";
import { DAOStatsRow } from "../components/DAOStatsRow";
import { TopHoldersTable } from "../components/TopHoldersTable";
import { RectangleContainer } from "../components/styled/RectangleHeader";
import { ProposalsTable } from "../components/ProposalsTable";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { ViewButton } from "../components/ViewButton";
import { MobileHeader } from "../components/styled/MobileHeader";
import { useVisitedDAO } from "services/contracts/baseDAO/hooks/useVisitedDAO";
import { FreezeDialog } from "../components/FreezeDialog";
import { useMemo } from "react";
import { InfoIcon } from "../components/styled/InfoIcon";
import { PeriodLabel } from "../components/styled/VotingLabel";

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40,
});

const DAOInfoTitleAndDesc = styled(Grid)(({ theme }) => ({
  maxWidth: 600,
  marginBottom: 40,
  [theme.breakpoints.down("sm")]: {
    marginBottom: 20,
  },
}));

const DAOInfoVotingPeriod = styled(Grid)(({ theme }) => ({
  minWidth: 320,
  [theme.breakpoints.down("sm")]: {
    minWidth: "unset",
  },
}));

const BigIconContainer = styled(Box)({
  width: 112,
  marginBottom: 25,

  "& > img": {
    display: "block",
    margin: "auto",
  },
});

const UnderlineText = styled(Typography)(({ theme }) => ({
  textDecoration: "underline",
  cursor: "pointer",
  marginBottom: 28,
  [theme.breakpoints.down("sm")]: {
    marginTop: 28,
  },
}));

const CustomH1 = styled(Typography)(({ theme }) => ({
  fontSize: 55,
  lineHeight: "92px",
  textDecoration: "underline",
  fontWeight: 400,
  [theme.breakpoints.down("sm")]: {
    fontSize: 45,
    lineHeight: "68px",
  },
}));

const DescriptionContainer = styled(Box)({
  padding: "20px 0",
});

const StyledFreezeButtons = styled(Grid)(() => ({
  maxWidth: "100%",
}));

export const DAO: React.FC = () => {
  const { saveDaoId, saveDaoSymbol } = useVisitedDAO();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading: isDaoLoading } = useDAO(id);
  const { mutate } = useFlush();
  const { tezos, connect } = useTezos();

  const name = data && data.metadata.unfrozenToken.name;
  const description = data && data.metadata.description;
  const symbol = data && data.metadata.unfrozenToken.symbol.toUpperCase();

  const cycleInfo = useCycleInfo(id);
  const time = cycleInfo && cycleInfo.time;
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const { data: proposals, isLoading: isProposalsLoading } = useProposals(
    data ? data.address : ""
  );
  const { data: activeProposals } = useProposals(
    data ? data.address : "",
    ProposalStatus.ACTIVE
  );
  const isLoading = isDaoLoading || isProposalsLoading;
  // const tiRef = React.createRef();

  useEffect(() => {
    saveDaoId(id);
    saveDaoSymbol(symbol || "");
  }, [id, symbol, saveDaoId, saveDaoSymbol]);

  const timerInfo = useMemo(() => {
    if (!time) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    let n = time;

    const days = Math.floor(n / (24 * 3600));

    n = n % (24 * 3600);
    const hours = Math.floor(n / 3600);

    n %= 3600;
    const minutes = Math.floor(n / 60);

    n %= 60;
    const seconds = Math.floor(n);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }, [time]);

  const onFlush = useCallback(async () => {
    await connectIfNotConnected(tezos, connect);
    // @TODO: we need to add an atribute to the proposals
    // type in order to know if it was flushed or not
    if (proposals && proposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: proposals.length + 1,
      });
      return;
    }
  }, [connect, data, mutate, proposals, tezos]);

  return (
    <>
      {!isLoading ? (
        <Grid item xs>
          <RectangleContainer container justify="space-between">
            <DAOInfoTitleAndDesc item xs={12} md={7} lg={8}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="secondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  {symbol}
                </Typography>
              </Box>
              <Grid container style={{ height: "100%" }}>
                <Grid item>
                  <Box paddingBottom="10px">
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justify={isMobileSmall ? "center" : "flex-start"}
                    >
                      <Grid item>
                        <CustomH1
                          color="textSecondary"
                          align={isMobileSmall ? "center" : "left"}
                        >
                          {name}
                        </CustomH1>
                      </Grid>
                      <Grid item>
                        <ViewButton
                          variant="outlined"
                          onClick={onFlush}
                          disabled={!data?.storage.proposalsToFlush}
                        >
                          EXECUTE
                        </ViewButton>
                        <Tooltip
                          placement="bottom"
                          title="Execute all passed proposals and drop all expired or rejected"
                        >
                          <InfoIcon color="secondary" />
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <StyledFreezeButtons
                          container
                          wrap="nowrap"
                          spacing={1}
                        >
                          <Grid item>
                            <FreezeDialog freeze={true} />
                          </Grid>
                          <Grid item>
                            <FreezeDialog freeze={false} />
                          </Grid>
                        </StyledFreezeButtons>
                      </Grid>
                    </Grid>
                  </Box>
                  <DescriptionContainer>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align={isMobileSmall ? "center" : "left"}
                    >
                      {description}
                    </Typography>
                  </DescriptionContainer>

                  {data && !isMobileSmall && (
                    <CopyAddress address={data.address} />
                  )}
                </Grid>
              </Grid>
            </DAOInfoTitleAndDesc>
            <DAOInfoVotingPeriod item xs={12} md={5} lg={4}>
              <Box paddingBottom="28px" width="100%">
                <Grid container wrap="nowrap">
                  <Grid item>
                    {data && <PeriodLabel daoId={data.address} />}
                  </Grid>
                </Grid>
              </Box>
              <Box paddingBottom="16px">
                <Grid container wrap="nowrap">
                  <Grid item>
                    <BigIconContainer>
                      <img src={VotingPeriodIcon} />
                    </BigIconContainer>
                  </Grid>

                  <Grid item>
                    <Box paddingLeft={!isMobileSmall ? "35px" : 0}>
                      <Box>
                        <Typography variant="subtitle2" color="secondary">
                          CURRENT CYCLE
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant={isMobileSmall ? "h2" : "h3"}
                          color="textSecondary"
                        >
                          {cycleInfo?.current}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container wrap="nowrap">
                  <Grid item>
                    <BigIconContainer
                      width={80}
                      height={80}
                      marginTop={"-21px"}
                    >
                      <ProgressBar
                        progress={
                          data
                            ? ((time || 0) / data.storage.votingPeriod) * 100
                            : 100
                        }
                        radius={35}
                        strokeWidth={7}
                        strokeColor={theme.palette.secondary.main}
                        trackStrokeWidth={4}
                        trackStrokeColor={theme.palette.primary.light}
                      />
                    </BigIconContainer>
                  </Grid>
                  <Grid item>
                    <Box paddingLeft={!isMobileSmall ? "35px" : 0}>
                      <Box>
                        <Typography variant="subtitle2" color="secondary">
                          TIME LEFT TO VOTE
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant={isMobileSmall ? "h2" : "h3"}
                          color="textSecondary"
                        >
                          <Box>
                            {timerInfo.days}d {timerInfo.hours}h{" "}
                            {timerInfo.minutes}m {timerInfo.seconds}s
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DAOInfoVotingPeriod>
          </RectangleContainer>
          <DAOStatsRow />
          {isMobileSmall && activeProposals && activeProposals.length > 0 && (
            <MobileHeader container justify="space-between" alignItems="center">
              <Typography variant="body1" color="textSecondary">
                ALL PROPOSALS
              </Typography>
            </MobileHeader>
          )}

          <ProposalsTable
            headerText="All Proposals"
            // status={ProposalStatus.ACTIVE}
          />
          <Grid container direction="row" justify="center">
            <UnderlineText
              variant="subtitle1"
              color="secondary"
              onClick={() => history.push(`/explorer/dao/${id}/proposals`)}
            >
              VIEW ALL PROPOSALS
            </UnderlineText>
          </Grid>
          <TopHoldersTable />
        </Grid>
      ) : (
        <LoaderContainer container direction="row" justify="center">
          <CircularProgress color="secondary" />
        </LoaderContainer>
      )}
    </>
  );
};
