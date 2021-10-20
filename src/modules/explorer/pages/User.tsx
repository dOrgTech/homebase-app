import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  GridProps,
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
import RemoveIcon from "@material-ui/icons/Remove";
import { ProfileAvatar } from "../components/styled/ProfileAvatar";
import { UserProfileName } from "../components/UserProfileName";
import { useDAOID } from "modules/explorer/v2/pages/DAO/router";
import { FreezeDialog } from "../components/FreezeDialog";
import { UserBalances } from "../v2/components/UserBalances";
import { StatusBadge } from "../components/StatusBadge";

const ContentBlockHeader = styled(AccordionSummary)(
  ({ theme }: { theme: Theme }) => ({
    padding: "12px 54px",
    "&.Mui-expanded": {
      padding: "4px 54px",
    },
    color: theme.palette.text.secondary,
  })
);

const ContentBlockItem = styled(Grid)({
  padding: "35px 52px",
  borderTop: `0.3px solid #5E6969`,
});

const BalancesHeader = styled(Grid)({
  minHeight: "178px",
  padding: "46px 55px",
  background: "#24282B",
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
});

const MainContainer = styled(Box)({
  width: "100%",
});

const UsernameText = styled(Typography)({
  fontSize: 28,
});

const ProposalTitle = styled(Typography)({
  fontWeight: "bold",
});

const HeaderText = styled(Typography)({
  fontWeight: "bold",
  fontSize: 18,
});

const StyledAccordion = styled(Accordion)({
  background: "#24282B",
  boxSizing: "border-box",
  borderRadius: 8,
  boxShadow: "none",
});

interface ContentBlockProps extends GridProps {
  headerText: string;
}

const StatusText = styled(Typography)({
  textTransform: "uppercase",
  marginLeft: 10,
  fontSize: 18,
  marginRight: 30,
});

const VotedText = styled(Typography)({
  fontSize: 18,
});

const StyledAccordionDetails = styled(AccordionDetails)({
  padding: 0,
});

const ContentBlock: React.FC<ContentBlockProps> = ({
  headerText,
  children,
  ...props
}) => {
  return (
    <StyledAccordion defaultExpanded>
      <ContentBlockHeader
        expandIcon={<RemoveIcon />}
        IconButtonProps={{
          color: "inherit",
        }}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Grid container alignItems="center">
          <Grid item>
            <HeaderText color="textPrimary">{headerText}</HeaderText>
          </Grid>
        </Grid>
      </ContentBlockHeader>
      <StyledAccordionDetails>
        <Grid {...props}>{children}</Grid>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

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
  console.log(account);
  const daoId = useDAOID();
  const { cycleInfo } = useDAO(daoId);
  const { data: proposals } = useProposals(daoId);
  const history = useHistory();

  useEffect(() => {
    if (!account) {
      /*history.push(`../${daoId}`);*/
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

    return proposals
      .filter((p) =>
        p.voters
          .map((voter) => voter.address.toLowerCase())
          .includes(account.toLowerCase())
      )
      .map((p) => ({
        proposal: p,
        voteDecision: p.voters.find((voter) => voter.address.toLowerCase())
          ?.support as boolean,
      }));
  }, [account, proposals]);

  return (
    <MainContainer>
      <Grid container direction="column" style={{ gap: 40 }}>
        <BalancesHeader item>
          <UserBalances daoId={daoId}>
            <Grid item>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <Grid container spacing={2} alignItems="center">
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
            <ContentBlock
              container
              direction="column"
              headerText="Proposals Posted"
            >
              {proposalsCreated.map((proposal, i) => (
                <ProposalItem
                  key={`posted-proposal-${i}`}
                  proposal={proposal}
                  status={proposal.getStatus(cycleInfo.currentLevel).status}
                >
                  {/* <Grid container>
                    <Grid item>
                      <CheckCircleOutlined
                        fontSize={"large"}
                        color="secondary"
                      />
                    </Grid>
                    <Grid item>
                      <StatusText color="textPrimary">
                        {proposal.getStatus(cycleInfo.currentLevel).status}
                      </StatusText>
                    </Grid>
                  </Grid> */}
                </ProposalItem>
              ))}
            </ContentBlock>
          )}
        </Grid>
        <Grid item>
          {proposalsVoted && cycleInfo && (
            <ContentBlock
              container
              direction="column"
              headerText="Voting History"
            >
              {proposalsVoted.map(({ proposal, voteDecision }, i) => (
                <ProposalItem
                  key={`posted-proposal-${i}`}
                  proposal={proposal}
                  status={proposal.getStatus(cycleInfo.currentLevel).status}
                >
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
                </ProposalItem>
              ))}
            </ContentBlock>
          )}
        </Grid>
      </Grid>
    </MainContainer>
  );
};
