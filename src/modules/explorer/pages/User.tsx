import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  GridProps,
  Typography,
} from "@material-ui/core";
import { CheckCircleOutlined } from "@material-ui/icons";
import { styled } from "@material-ui/styles";
import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import React from "react";
import { useParams } from "react-router";
import { useAgoraTopic } from "services/agora/hooks/useTopic";
import { useTezos } from "services/beacon/hooks/useTezos";
import { toShortAddress } from "services/contracts/utils";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposals } from "services/indexer/dao/hooks/useProposals";
import {
  Proposal,
  ProposalStatus,
} from "services/indexer/dao/mappers/proposal/types";
import { TableStatusBadge } from "../components/ProposalTableRowStatusBadge";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ProfileAvatar } from "../components/styled/ProfileAvatar";
import { UserProfileName } from "../components/UserProfileName";

const ContentBlockBase = styled(Grid)({});

const ContentBlockHeader = styled(AccordionSummary)({
  padding: "12px 54px",
  "&.Mui-expanded": {
    padding: "4px 54px",
  },
});

const ContentBlockItem = styled(Grid)({
  padding: "41px 58px",
  borderTop: `0.3px solid ${hexToRgba("#7D8C8B", 0.65)}`,
});

const BalancesHeader = styled(ContentBlockBase)({
  minHeight: "178px",
  padding: "46px 55px",
});

const UsernameHeader = styled(Grid)({
  marginBottom: 20,
});

const MainContainer = styled(Box)({
  width: "100%",
  padding: "65px 114px",
});

const BalanceHeaderText = styled(Typography)({
  fontSize: 21,
  letterSpacing: "-0.01em",
  paddingBottom: 10,
});

const BalanceTokenText = styled(Typography)({
  fontSize: 24,
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
    <StyledAccordion>
      <ContentBlockHeader
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Grid container alignItems="center">
          <Grid item>
            <HeaderText color="textSecondary">{headerText}</HeaderText>
          </Grid>
        </Grid>
      </ContentBlockHeader>
      <StyledAccordionDetails>
        <ContentBlockBase {...props}>{children}</ContentBlockBase>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

const ProposalItem: React.FC<{ proposal: Proposal; status: ProposalStatus }> =
  ({ proposal, status, children }) => {
    const { data: agoraPost } = useAgoraTopic(
      Number(proposal.metadata.agoraPostId)
    );

    const formattedDate = dayjs(proposal.startDate).format("LLL");

    return (
      <ContentBlockItem container justify="space-between" alignItems="center">
        <Grid item sm={6}>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <ProposalTitle color="textSecondary" variant="h4">
                {agoraPost
                  ? agoraPost.title
                  : `Proposal ${toShortAddress(proposal.id)}`}
              </ProposalTitle>
            </Grid>
            <Grid item>
              <Grid container spacing={4} alignItems="center">
                <Grid item>
                  <TableStatusBadge status={status} />
                </Grid>
                <Grid item>
                  <Typography variant="body1" color="textSecondary">
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
  const { id: daoId } = useParams<{
    id: string;
  }>();
  const { account } = useTezos();
  const { data: dao, cycleInfo } = useDAO(daoId);
  const { data: proposals } = useProposals(daoId);
  const balances = [
    {
      header: "Available Balance",
      balance: 1000,
    },
    {
      header: "Pending Balance",
      balance: 1000,
    },
    {
      header: "Staked Balance",
      balance: 1000,
    },
  ];

  return (
    <MainContainer>
      <Grid container direction="column" spacing={5}>
        <UsernameHeader item>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <ProfileAvatar size={43} address={account} />
                </Grid>
                <Grid item>
                  <UsernameText color="textSecondary">
                    <UserProfileName address={account} />
                  </UsernameText>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Button variant="outlined" color="secondary">
                    Withdraw
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="secondary">
                    Deposit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </UsernameHeader>
        <Grid item>
          <BalancesHeader container justify="space-between" alignItems="center">
            {dao &&
              balances.map(({ header, balance }, i) => (
                <Grid item key={`balance-${i}`}>
                  <BalanceHeaderText color="secondary">
                    {header}
                  </BalanceHeaderText>
                  <Grid container alignItems="baseline" spacing={2}>
                    <Grid item>
                      <Typography variant="h5" color="textSecondary">
                        {balance}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <BalanceTokenText color="textSecondary">
                        {dao.data.token.symbol}
                      </BalanceTokenText>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
          </BalancesHeader>
        </Grid>
        <Grid item>
          {proposals && cycleInfo && (
            <ContentBlock
              container
              direction="column"
              headerText="Proposals Posted"
            >
              {proposals.map((proposal, i) => (
                <ProposalItem
                  key={`posted-proposal-${i}`}
                  proposal={proposal}
                  status={proposal.getStatus(cycleInfo.currentLevel).status}
                >
                  <Grid container>
                    <Grid item>
                      <CheckCircleOutlined
                        fontSize={"large"}
                        color="secondary"
                      />
                    </Grid>
                    <Grid item>
                      <StatusText color="textSecondary">
                        {proposal.getStatus(cycleInfo.currentLevel).status}
                      </StatusText>
                    </Grid>
                  </Grid>
                </ProposalItem>
              ))}
            </ContentBlock>
          )}
        </Grid>
        <Grid item>
          {proposals && cycleInfo && (
            <ContentBlock
              container
              direction="column"
              headerText="Proposals Posted"
            >
              {proposals.map((proposal, i) => (
                <ProposalItem
                  key={`posted-proposal-${i}`}
                  proposal={proposal}
                  status={proposal.getStatus(cycleInfo.currentLevel).status}
                >
                  <Grid container>
                    <Grid item>
                      <VotedText color="textSecondary">Voted</VotedText>
                    </Grid>
                    <Grid item>
                      <StatusText color="secondary">YES</StatusText>
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
