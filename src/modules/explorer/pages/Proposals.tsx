import {
  Grid,
  styled,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
  Button,
} from "@material-ui/core";
import React, { useCallback } from "react";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { DAOStatsRow } from "../components/DAOStatsRow";
import { RectangleContainer } from "../components/styled/RectangleHeader";
import { PrimaryButton } from "../components/styled/PrimaryButton";
import { ProposalsTable } from "../components/ProposalsTable";
import { AppTabBar } from "../components/AppTabBar";
import { TabPanel } from "../components/TabPanel";
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo";
import { RegistryProposalFormContainer } from "../components/ProposalForm/registryProposalForm";
import { useState } from "react";
import { TreasuryProposalFormContainer } from "../components/ProposalForm/treasuryProposalForm";
import { InfoIcon } from "../components/styled/InfoIcon";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import { useDAOID } from "../daoRouter";
import { PeriodLabel } from "../components/styled/VotingLabel";

const ButtonsContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  [theme.breakpoints.down("xs")]: {
    marginTop: 25,
  },
}));

export const Proposals: React.FC = () => {
  const daoId = useDAOID();
  const { data: dao } = useDAO(daoId);
  const { mutate } = useFlush();
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTab, setSelectedTab] = React.useState(0);
  const name = dao && dao.data.name;
  const shouldDisable = useIsProposalButtonDisabled(daoId);
  const [open, setOpen] = useState(false);

  const { data: allProposalsData, isLoading: isAllLoading } =
    useProposals(daoId);
  const { data: activeProposalsData, isLoading: isActiveLoading } =
    useProposals(daoId, ProposalStatus.ACTIVE);
  const { data: executedProposalsData, isLoading: isExecutedLoading } =
    useProposals(daoId, ProposalStatus.EXECUTED);

  const onFlush = useCallback(async () => {
    if (dao && allProposalsData) {
      mutate({
        dao,
        numOfProposalsToFlush: allProposalsData.length + 1,
      });
    }
  }, [dao, mutate, allProposalsData]);

  const handleNewProposal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid item xs>
        <RectangleContainer container direction="row">
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="secondary"
              align={isMobileSmall ? "center" : "left"}
            >
              {name}
            </Typography>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justify={isMobileSmall ? "center" : "flex-start"}
            >
              <Grid item>
                <Typography
                  variant="h5"
                  color="textSecondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  Proposals
                </Typography>
              </Grid>
              <Grid item>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={onFlush}
                    color="secondary"
                    // disabled={!dao?.storage.proposalsToFlush}
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
              </Grid>
            </Grid>
          </Grid>
          <ButtonsContainer
            item
            container
            xs={12}
            sm={6}
            justify={isMobileSmall ? "center" : "flex-end"}
            style={{ gap: 35 }}
          >
            <Grid item>
              <Grid container alignItems="baseline">
                <Grid item>
                  <PeriodLabel daoId={daoId} item />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container alignItems="baseline">
                <Grid item>
                  <PrimaryButton
                    variant="outlined"
                    onClick={handleNewProposal}
                    disabled={shouldDisable}
                  >
                    NEW PROPOSAL
                  </PrimaryButton>
                </Grid>
                {shouldDisable && (
                  <Tooltip
                    placement="bottom"
                    title="Not on proposal creation period"
                  >
                    <InfoIcon color="secondary" />
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </ButtonsContainer>
        </RectangleContainer>
        <DAOStatsRow />
        {isMobileSmall ? (
          <>
            <AppTabBar
              value={selectedTab}
              setValue={setSelectedTab}
              labels={[
                "ACTIVE PROPOSALS",
                "EXECUTED PROPOSALS",
                "ALL PROPOSALS",
              ]}
            />
            <TabPanel value={selectedTab} index={0}>
              <ProposalsTable
                status={ProposalStatus.ACTIVE}
                proposals={activeProposalsData || []}
                isLoading={isActiveLoading}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <ProposalsTable
                status={ProposalStatus.EXECUTED}
                proposals={executedProposalsData || []}
                isLoading={isExecutedLoading}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <ProposalsTable
                proposals={allProposalsData || []}
                isLoading={isAllLoading}
              />
            </TabPanel>
          </>
        ) : (
          <>
            <ProposalsTable
              proposals={allProposalsData || []}
              isLoading={isAllLoading}
            />
          </>
        )}

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
      </Grid>
      {dao ? (
        dao.data.type === "registry" ? (
          <RegistryProposalFormContainer
            open={open}
            handleClose={handleCloseModal}
          />
        ) : (
          <TreasuryProposalFormContainer
            open={open}
            handleClose={handleCloseModal}
          />
        )
      ) : null}
    </>
  );
};
