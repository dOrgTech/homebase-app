import React, { useCallback } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  styled,
  Typography,
  useTheme,
  Tooltip,
  useMediaQuery,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import VotingPeriodIcon from "assets/logos/votingPeriod.svg";
import ProgressBar from "react-customizable-progressbar";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { CopyAddress } from "modules/common/CopyAddress";
import { DAOStatsRow } from "../components/DAOStatsRow";
import { TopHoldersTable } from "../components/TopHoldersTable";
import { RectangleContainer } from "../components/styled/RectangleHeader";
import { ProposalsTable } from "../components/ProposalsTable";
import { MobileHeader } from "../components/styled/MobileHeader";
import { FreezeDialog } from "../components/FreezeDialog";
import { InfoIcon } from "../components/styled/InfoIcon";
import { PeriodLabel } from "../components/styled/VotingLabel";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import { useDAOID } from "../daoRouter";

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
  const history = useHistory();
  const daoId = useDAOID();
  const { data, isLoading: isDaoLoading, cycleInfo } = useDAO(daoId);
  const { mutate } = useFlush();

  const name = data && data.data.name;
  const description = data && data.data.description;
  const symbol = data && data.data.token.symbol.toUpperCase();
  const blocksLeft = cycleInfo && cycleInfo.blocksLeft;
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const { data: proposals, isLoading: isProposalsLoading } =
    useProposals(daoId);
  const { data: activeProposals, isLoading: isActiveProposalsLoading } =
    useProposals(daoId, ProposalStatus.ACTIVE);
  const isLoading = isDaoLoading || isProposalsLoading;

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
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={onFlush}
                          // disabled={!data?.storage.proposalsToFlush}
                        >
                          EXECUTE
                        </Button>
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
                    <CopyAddress address={data.data.address} />
                  )}
                </Grid>
              </Grid>
            </DAOInfoTitleAndDesc>
            <DAOInfoVotingPeriod item xs={12} md={5} lg={4}>
              <Box paddingBottom="28px" width="100%">
                <Grid container wrap="nowrap">
                  <Grid item>
                    {data && <PeriodLabel daoId={data.data.address} />}
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
                          {cycleInfo?.currentCycle}
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
                            ? ((blocksLeft || 0) / Number(data.data.period)) *
                              100
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
                          LEVELS LEFT TO VOTE
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant={isMobileSmall ? "h2" : "h3"}
                          color="textSecondary"
                        >
                          <Box>{blocksLeft} levels</Box>
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
                ACTIVE PROPOSALS
              </Typography>
            </MobileHeader>
          )}

          <ProposalsTable
            status={ProposalStatus.ACTIVE}
            proposals={activeProposals || []}
            isLoading={isActiveProposalsLoading}
          />
          <Grid container direction="row" justify="center">
            <UnderlineText
              variant="subtitle1"
              color="secondary"
              onClick={() => history.push(`/explorer/dao/${daoId}/proposals`)}
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
