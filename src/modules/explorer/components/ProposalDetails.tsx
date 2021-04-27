import {
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme
} from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";

import { VoteDialog } from "modules/explorer/components/VoteDialog";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposal } from "services/contracts/baseDAO/hooks/useProposal";
import { RegistryProposalWithStatus, TransferProposalWithStatus } from "services/bakingBad/proposals/types";
import { StatusBadge } from "./StatusBadge";
import { ProposalStatusHistory } from "./ProposalStatusHistory";
import { RectangleContainer } from "./styled/RectangleHeader";
import { VotersProgress } from "./VotersProgress";
import { TransferDetail } from "../Treasury/components/TransferDetail";
import { RegistryUpdateDetail } from "../Registry/components/RegistryUpdateDetail";

const StyledContainer = styled(withTheme(Grid))(props => ({
  background: props.theme.palette.primary.main,
  boxSizing: "border-box"
}));

const StatsContainer = styled(Grid)(({ theme }) => ({
  minHeight: 175,
  borderBottom: `2px solid ${theme.palette.primary.light}`
}));

const TokensLocked = styled(Grid)({
  padding: "35px 8%"
});

const Subtitle = styled(Typography)({
  marginTop: 12
});

const ButtonsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 15
  }
}));

const Cycle = styled(Typography)({
  opacity: 0.8
});

const DetailsContainer = styled(Grid)(({ theme }) => ({
  paddingBottom: 0,
  padding: "40px 8%",
  [theme.breakpoints.down("sm")]: {
    padding: "40px 0"
  }
}));

const TitleText = styled(Typography)({
  fontWeight: "bold"
});

const DescriptionText = styled(Typography)({
  paddingTop: 28,
  paddingBottom: 10
});

const RectangleHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "20px 8%"
}));

const DetailsHeader = styled(RectangleHeader)(({ theme }) => ({
  borderTop: `2px solid ${theme.palette.primary.light}`,
  margin: "20px 0 35px 0"
}));

const ProposalStatusBadge = styled(StatusBadge)(({ theme }) => ({
  marginLeft: 15,
  [theme.breakpoints.down("sm")]: {
    marginTop: 15
  }
}));

export const ProposalDetails: React.FC = () => {
  const { proposalId, id: daoId } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const theme = useTheme();
  const { data: proposalData } = useProposal(daoId, proposalId);
  const proposal = proposalData as (TransferProposalWithStatus | RegistryProposalWithStatus | undefined);
  const { data: dao } = useDAO(daoId);
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const proposalCycle = proposal ? proposal.cycle : "-";
  const daoName = dao ? dao.metadata.unfrozenToken.name : "";

  return (
    <>
      <Grid item xs>
        <RectangleContainer>
          <Grid
            container
            direction={isMobileSmall ? "column" : "row"}
            alignItems="center"
          >
            <Grid item>
              <Typography
                variant="subtitle1"
                color="secondary"
                align={isMobileSmall ? "center" : "left"}
              >
                {daoName} &gt; PROPOSALS
              </Typography>
            </Grid>
            <Grid item>
              {proposal && <ProposalStatusBadge status={proposal.status} />}
            </Grid>
            <Grid item xs={12}>
              <StyledContainer container direction="row">
                <Grid item xs={12} md={6}>
                  <Subtitle
                    variant="h3"
                    color="textSecondary"
                    align={isMobileSmall ? "center" : "left"}
                  >
                    Proposal Title
                  </Subtitle>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ButtonsContainer
                    container
                    direction="row"
                    alignItems="center"
                    wrap="nowrap"
                    justify={isMobileSmall ? "center" : "flex-end"}
                  >
                    <VoteDialog />
                  </ButtonsContainer>
                </Grid>
              </StyledContainer>
            </Grid>
          </Grid>
        </RectangleContainer>
        <RectangleHeader container direction="row">
          <Cycle color="textSecondary">CYCLE: {proposalCycle}</Cycle>
        </RectangleHeader>
        <StatsContainer container>
          <TokensLocked container direction="row" alignItems="center">
            <Grid item xs={12}>
              <Typography color="secondary">VOTES</Typography>
            </Grid>
            <VotersProgress
              showButton={true}
              daoId={daoId}
              proposalId={proposalId}
            />
          </TokensLocked>
        </StatsContainer>
        <DetailsContainer container direction="row">
          <Grid item xs={12} md={7} style={{ paddingBottom: 40 }}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={12}>
                <TitleText
                  variant="subtitle1"
                  color="textSecondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  Proposal
                </TitleText>
                <DescriptionText
                  variant="subtitle1"
                  color="textSecondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  Proposal Description
                </DescriptionText>
              </Grid>
              {proposal? proposal.type === "transfer"? <TransferDetail proposal={proposal as TransferProposalWithStatus}/>: <RegistryUpdateDetail proposal={proposal as RegistryProposalWithStatus} />: null}
            </Grid>
          </Grid>
          {isMobileSmall && (
            <DetailsHeader xs={12} alignItems="center" container>
              <TitleText variant="subtitle1" color="textSecondary">
                DETAILS
              </TitleText>
            </DetailsHeader>
          )}
          <ProposalStatusHistory />
        </DetailsContainer>
      </Grid>
    </>
  );
};
