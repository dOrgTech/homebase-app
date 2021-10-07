import {
  Button,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { styled, useTheme } from "@material-ui/styles";
import { StatusBadge } from "modules/explorer/components/StatusBadge";
import { UserBadge } from "modules/explorer/components/UserBadge";
import { VotersProgress } from "modules/explorer/components/VotersProgress";
import { useDAOID } from "modules/explorer/daoRouter";
import { useCanDropProposal } from "modules/explorer/hooks/useCanDropProposal";
import React, { useCallback } from "react";
import { useParams } from "react-router";
import { useAgoraTopic } from "services/agora/hooks/useTopic";
import { BaseDAO } from "services/contracts/baseDAO";
import { useDropProposal } from "services/contracts/baseDAO/hooks/useDropProposal";
import { toShortAddress } from "services/contracts/utils";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposal } from "services/indexer/dao/hooks/useProposal";
import { ContentContainer } from "../../components/ContentContainer";

const Container = styled(ContentContainer)({
  padding: "36px 45px",
});

export const ProposalDetails: React.FC = () => {
  const { proposalId } = useParams<{
    proposalId: string;
  }>();
  const daoId = useDAOID();
  console.log(daoId, " ", proposalId);
  const theme = useTheme<Theme>();
  const { data: proposal } = useProposal(daoId, proposalId);
  const { data: dao, cycleInfo } = useDAO(daoId);
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { mutate: dropProposal } = useDropProposal();
  const canDropProposal = useCanDropProposal(daoId, proposalId);
  const { data: agoraPost } = useAgoraTopic(
    Number(proposal?.metadata.agoraPostId)
  );

  const onDropProposal = useCallback(async () => {
    await dropProposal({
      dao: dao as BaseDAO,
      proposalId,
    });
  }, [dao, dropProposal, proposalId]);

  const proposalCycle = proposal ? proposal.period : "-";
  const daoName = dao ? dao.data.name : "";

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <Container item>
          <Grid container direction="column">
            <Grid item>
              <Typography
                variant="h3"
                color="textPrimary"
                align={isMobileSmall ? "center" : "left"}
              >
                {agoraPost
                  ? agoraPost.title
                  : `Proposal ${toShortAddress(proposal?.id || "")}`}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item>
                  {proposal && cycleInfo && (
                    <Grid container style={{ gap: 20 }}>
                      <Grid item>
                        <StatusBadge
                          status={
                            proposal.getStatus(cycleInfo.currentLevel).status
                          }
                        />
                      </Grid>
                      <Grid item>
                        <Typography color="textPrimary" variant="subtitle2">
                          CREATED BY
                        </Typography>
                      </Grid>
                      <Grid item>
                        <UserBadge address={proposal.proposer} />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item>
                  <Grid container style={{ gap: 28 }}>
                    <Grid item>
                      <Button variant="contained" color="secondary">
                        Vote For
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="secondary">
                        Vote Against
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Grid item>
          <Grid container>
            <Container item>
              <Grid container direction="column">
                <Grid item>
                  <Grid container style={{ gap: 18 }}>
                    <Grid item>
                      <Typography color="secondary">Votes</Typography>
                    </Grid>
                    <Grid item>
                      <Typography color="textPrimary">
                        Cycle: {proposalCycle}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <VotersProgress
                    showButton={true}
                    daoId={daoId}
                    proposalId={proposalId}
                  />
                </Grid>
              </Grid>
            </Container>
            <Container item></Container>
          </Grid>
        </Grid>
        <Container item></Container>
        <Container item></Container>
      </Grid>
    </>
  );
};
