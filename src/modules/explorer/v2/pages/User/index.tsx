import {
  Box,
  Grid,
  Theme,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/styles";
import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router";
import { useAgoraTopic } from "services/agora/hooks/useTopic";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import {
  Proposal,
  ProposalStatus,
} from "services/indexer/dao/mappers/proposal/types";
import { ProfileAvatar } from "../../../components/styled/ProfileAvatar";
import { UserProfileName } from "../../../components/UserProfileName";
import { useDAOID } from "modules/explorer/v2/pages/DAO/router";
import { FreezeDialog } from "../../../components/FreezeDialog";
import { UserBalances } from "../../components/UserBalances";
import { StatusBadge } from "../../../components/StatusBadge";
import { ProposalsList } from "../../components/ProposalsList";

const ContentBlockItem = styled(Grid)({
  padding: "35px 52px",
  borderTop: `0.3px solid #5E6969`,
});

const BalancesHeader = styled(Grid)(({ theme }: { theme: Theme }) => ({
  minHeight: "178px",
  padding: "46px 55px",
  background: theme.palette.primary.main,
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
}));

const MainContainer = styled(Box)({
  width: "100%",
});

const UsernameText = styled(Typography)({
  fontSize: 28,
  wordBreak: "break-all"
});

const ProposalTitle = styled(Typography)({
  fontWeight: "bold",
});

const StatusText = styled(Typography)({
  textTransform: "uppercase",
  marginLeft: 10,
  fontSize: 18,
  marginRight: 30,
});

const VotedText = styled(Typography)({
  fontSize: 18,
});

export const ProposalItem: React.FC<{
  proposal: Proposal;
  status: ProposalStatus;
}> = ({ proposal, status, children }) => {
  const { data: agoraPost } = useAgoraTopic(
    Number(proposal.metadata.agoraPostId)
  );

  const formattedDate = dayjs(proposal.startDate).format("LLL");

  return (
    <ContentBlockItem container justify="space-between" alignItems="center">
      <Grid item sm={8}>
        <Grid container direction="column" style={{ gap: 20 }}>
          <Grid item>
            <ProposalTitle color="textPrimary" variant="h4">
              {agoraPost
                ? agoraPost.title
                : `Proposal ${toShortAddress(proposal.id)}`}
            </ProposalTitle>
          </Grid>
          <Grid item>
            <Grid container style={{ gap: 20 }} alignItems="center">
              <Grid item>
                <StatusBadge status={status} />
              </Grid>
              <Grid item>
                <Typography variant="body1" color="textPrimary">
                  Created {formattedDate}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{children}</Grid>
    </ContentBlockItem>
  );
};

export const User: React.FC = () => {
  const { account } = useTezos();
  const daoId = useDAOID();
  const { cycleInfo } = useDAO(daoId);
  const { data: proposals } = useProposals(daoId);
  const history = useHistory();

  useEffect(() => {
    if (!account) {
      history.push(`../${daoId}`);
    }
  }, [account, daoId, history]);

  const proposalsCreated = useMemo(() => {
    if (!proposals) {
      return [];
    }

    return proposals.filter(
      (p) => p.proposer.toLowerCase() === account.toLowerCase()
    );
  }, [account, proposals]);

  const proposalsVoted = useMemo(() => {
    if (!proposals) {
      return [];
    }

    return proposals.filter((p) =>
      p.voters
        .map((voter) => voter.address.toLowerCase())
        .includes(account.toLowerCase())
    );
  }, [account, proposals]);

  const getVoteDecision = (proposal: Proposal) =>
    proposal.voters.find((voter) => voter.address.toLowerCase())
      ?.support as boolean;

  return (
    <MainContainer>
      <Grid container direction="column" style={{ gap: 40 }}>
        <BalancesHeader item>
          <UserBalances daoId={daoId}>
            <Grid item>
              <Grid container alignItems="center" justify="space-between" style={{ gap: 20 }}>
                <Grid item>
                  <Grid container spacing={2} alignItems="center" wrap="nowrap">
                    <Grid item>
                      <ProfileAvatar size={43} address={account} />
                    </Grid>
                    <Grid item>
                      <UsernameText color="textPrimary">
                        <UserProfileName address={account} />
                      </UsernameText>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <FreezeDialog freeze={true} />
                    </Grid>
                    <Grid item>
                      <FreezeDialog freeze={false} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </UserBalances>
        </BalancesHeader>
        <Grid item>
          {proposalsCreated && cycleInfo && (
            <ProposalsList
              currentLevel={cycleInfo.currentLevel}
              proposals={proposalsCreated}
              title={"Proposals Posted"}
            />
          )}
        </Grid>
        <Grid item>
          {proposalsVoted && cycleInfo && (
            <ProposalsList
              title={"Voting History"}
              currentLevel={cycleInfo.currentLevel}
              proposals={proposalsVoted}
              rightItem={(proposal) => {
                const voteDecision = getVoteDecision(proposal);
                return (
                  <Grid container>
                    <Grid item>
                      <VotedText color="textPrimary">Voted</VotedText>
                    </Grid>
                    <Grid item>
                      <StatusText color={voteDecision ? "secondary" : "error"}>
                        {voteDecision ? "YES" : "NO"}
                      </StatusText>
                    </Grid>
                  </Grid>
                );
              }}
            />
          )}
        </Grid>
      </Grid>
    </MainContainer>
  );
};
