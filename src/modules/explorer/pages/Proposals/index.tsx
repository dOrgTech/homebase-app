import React, { useCallback, useState } from "react";
import {Grid, styled, Typography, Button, Tooltip} from "@material-ui/core";

import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import { useDAOID } from "../DAO/router";

import { UserBalancesBox } from "../../components/UserBalances";
import { ContentContainer } from "../../components/ContentContainer";
import { ProposalsList } from "../../components/ProposalsList";
import { DAOStatsRow } from "../../components/DAOStatsRow";
import { ProposalStatus } from "services/indexer/dao/mappers/proposal/types";
// import { ProposalFormContainer } from "modules/explorer/components/ProposalForm";
import {InfoIcon} from "../../components/styled/InfoIcon";
import {useIsProposalButtonDisabled} from "../../../../services/contracts/baseDAO/hooks/useCycleInfo";
import {ProposalSelectionMenu} from "../../components/ProposalSelectionMenu";

const HeroContainer = styled(ContentContainer)({
  padding: "38px 45px",
});

const TitleText = styled(Typography)({
  fontSize: 30,
  fontWeight: 500,
});

export const Proposals: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const daoId = useDAOID();
  const { data, cycleInfo } = useDAO(daoId);
  const { mutate } = useFlush();
  const shouldDisable = useIsProposalButtonDisabled(daoId);
  const { data: proposals } = useProposals(daoId);
  const { data: activeProposals } = useProposals(daoId, ProposalStatus.ACTIVE);
  const { data: executableProposals } = useProposals(daoId, ProposalStatus.EXECUTABLE);
  const { data: expiredProposals } = useProposals(daoId, ProposalStatus.EXPIRED);

  const onFlush = useCallback(async () => {
    if (executableProposals && expiredProposals && executableProposals.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: executableProposals.length,
        expiredProposalIds: expiredProposals.map(p => p.id)
      });
      return;
    }
  }, [data, mutate, executableProposals, expiredProposals]);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const handleProposalModal = () => {
    setOpenModal(true);
  };

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <HeroContainer item>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Grid container style={{ gap: 20 }} alignItems="center">
                <Grid item>
                  <TitleText color="textPrimary">Proposals</TitleText>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={onFlush}
                    disabled={!executableProposals || !executableProposals.length}
                  >
                    Execute
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
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleProposalModal}
                disabled={shouldDisable}
              >
                New Proposal
              </Button>
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
        </HeroContainer>
        <DAOStatsRow />
        <UserBalancesBox daoId={daoId} />

        {data && cycleInfo && activeProposals && (
          <ProposalsList
            title={"Active Proposals"}
            currentLevel={cycleInfo.currentLevel}
            proposals={activeProposals}
          />
        )}

        {data && cycleInfo && proposals && (
          <ProposalsList
            title={"All Proposals"}
            currentLevel={cycleInfo.currentLevel}
            proposals={proposals}
          />
        )}
      </Grid>
      {/*<ProposalFormContainer*/}
      {/*  open={openModal}*/}
      {/*  handleClose={onCloseModal}*/}
      {/*/>*/}
      <ProposalSelectionMenu open={openModal} handleClose={onCloseModal}/>
    </>
  );
};
