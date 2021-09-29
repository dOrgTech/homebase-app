import {
  Button,
  Grid,
  Link,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  withTheme,
} from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router";
import ReactHtmlParser from "react-html-parser";
import { ReactComponent as ClipIcon } from "assets/logos/clip.svg";

import { VoteDialog } from "modules/explorer/components/VoteDialog";
import { StatusBadge } from "./StatusBadge";
import { ProposalStatusHistory } from "./ProposalStatusHistory";
import { RectangleContainer } from "./styled/RectangleHeader";
import { VotersProgress } from "./VotersProgress";
import { useDropProposal } from "services/contracts/baseDAO/hooks/useDropProposal";
import { BaseDAO } from "services/contracts/baseDAO";
import {
  mutezToXtz,
  parseUnits,
  toShortAddress,
} from "services/contracts/utils";
import { useCanDropProposal } from "../hooks/useCanDropProposal";
import { useCallback } from "react";
import { InfoIcon } from "./styled/InfoIcon";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { useProposal } from "services/indexer/dao/hooks/useProposal";
import {
  FA2Transfer,
  RegistryProposal,
  TreasuryProposal,
} from "services/indexer/dao/mappers/proposal/types";
import { useAgoraTopic } from "services/agora/hooks/useTopic";
import { useDAOID } from "../daoRouter";
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings";
import { TransferBadge } from "../Treasury/components/TransferBadge";
import { HighlightedBadge } from "./styled/HighlightedBadge";
import { DAOHolding } from "services/bakingBad/tokenBalances";

const StyledContainer = styled(withTheme(Grid))((props) => ({
  background: props.theme.palette.primary.main,
  boxSizing: "border-box",
}));

const StatsContainer = styled(Grid)(({ theme }) => ({
  minHeight: 175,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const TokensLocked = styled(Grid)({
  padding: "35px 8%",
});

const Subtitle = styled(Typography)({
  marginTop: 12,
});

const ButtonsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 15,
  },
}));

const Cycle = styled(Typography)({
  opacity: 0.8,
});

const DetailsContainer = styled(Grid)(({ theme }) => ({
  paddingBottom: 0,
  padding: "40px 8%",
  [theme.breakpoints.down("sm")]: {
    padding: "40px 16px",
  },
}));

// const DescriptionText = styled(Typography)({
//   paddingTop: 28,
//   paddingBottom: 10,
// });

const RectangleHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  padding: "20px 8%",
}));

const DetailsHeader = styled(RectangleHeader)(({ theme }) => ({
  borderTop: `2px solid ${theme.palette.primary.light}`,
  margin: "20px 0 35px 0",
}));

const ProposalStatusBadge = styled(StatusBadge)(({ theme }) => ({
  marginLeft: 15,
  [theme.breakpoints.down("sm")]: {
    marginTop: 15,
  },
}));

const DropButton = styled(Button)({
  marginTop: "12px",
});

const Container = styled(Grid)({
  paddingTop: 21,
});

const DetailsText = styled(Typography)({
  wordBreak: "break-all",
});

export const ProposalDetails: React.FC = () => {
  const { proposalId } = useParams<{
    proposalId: string;
  }>();
  const daoId = useDAOID();
  const theme = useTheme();
  const { data: proposal } = useProposal(daoId, proposalId);
  const { data: dao, cycleInfo } = useDAO(daoId);
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { mutate: dropProposal } = useDropProposal();
  const canDropProposal = useCanDropProposal(daoId, proposalId);
  const { data: agoraPost } = useAgoraTopic(
    Number(proposal?.metadata.agoraPostId)
  );
  const { data: holdings } = useDAOHoldings(daoId);

  const onDropProposal = useCallback(async () => {
    await dropProposal({
      dao: dao as BaseDAO,
      proposalId,
    });
  }, [dao, dropProposal, proposalId]);

  const list = useMemo(() => {
    if (!proposal || !(proposal instanceof RegistryProposal)) {
      return [];
    }

    return proposal.metadata.list;
  }, [proposal]);

  const transfers = useMemo(() => {
    if (!holdings || !proposal) {
      return [];
    }

    return (
      proposal as TreasuryProposal | RegistryProposal
    ).metadata.transfers.map((transfer) => {
      if (transfer.type === "XTZ") {
        return {
          ...transfer,
          amount: mutezToXtz(transfer.amount),
        };
      }

      const fa2Transfer = transfer as FA2Transfer;

      const decimals = (
        holdings.find(
          (holding) =>
            holding.token.contract.toLowerCase() ===
            fa2Transfer.contractAddress.toLowerCase()
        ) as DAOHolding
      ).token.decimals;

      return {
        ...transfer,
        amount: parseUnits(transfer.amount, decimals),
      };
    });
  }, [holdings, proposal]);

  const proposalCycle = proposal ? proposal.period : "-";
  const daoName = dao ? dao.data.name : "";

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
              {proposal && cycleInfo && (
                <ProposalStatusBadge
                  status={proposal.getStatus(cycleInfo.currentLevel).status}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <StyledContainer container direction="row">
                <Grid item xs={12} md={6}>
                  <Subtitle
                    variant="h3"
                    color="textSecondary"
                    align={isMobileSmall ? "center" : "left"}
                  >
                    {agoraPost
                      ? agoraPost.title
                      : `Proposal ${toShortAddress(proposal?.id || "")}`}
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

                <Grid container>
                  <Grid item>
                    <DropButton
                      variant="outlined"
                      color="secondary"
                      onClick={onDropProposal}
                      disabled={!canDropProposal}
                    >
                      DROP PROPOSAL
                    </DropButton>
                  </Grid>
                  <Grid item>
                    <Tooltip
                      placement="bottom"
                      title="Guardian and proposer may drop proposal at anytime. Anyone may drop proposal if proposal expired"
                    >
                      <InfoIcon color="secondary" />
                    </Tooltip>
                  </Grid>
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
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  PROPOSAL DETAILS
                </Typography>
                {agoraPost && (
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align={isMobileSmall ? "center" : "left"}
                  >
                    {ReactHtmlParser(agoraPost.post_stream.posts[0].cooked)}
                  </Typography>
                )}
              </Grid>
              {agoraPost && (
                <Grid item xs={12}>
                  <Link
                    href={`https://forum.tezosagora.org/t/${proposal?.metadata.agoraPostId}`}
                    underline="hover"
                    target="_blank"
                  >
                    <Grid container style={{ gap: 5 }} wrap="nowrap">
                      <Grid item>
                        <ClipIcon />
                      </Grid>
                      <Grid item>
                        <Typography color="secondary">
                          https://forum.tezosagora.org/t/
                          {proposal?.metadata.agoraPostId}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Link>
                </Grid>
              )}
              {proposal ? (
                <>
                  {transfers.map((transfer, index) => {
                    return (
                      <Container
                        key={index}
                        item
                        container
                        alignItems="center"
                        direction={isMobileSmall ? "column" : "row"}
                      >
                        {transfer.type === "XTZ" ? (
                          <TransferBadge
                            amount={transfer.amount}
                            address={transfer.beneficiary}
                            currency={"XTZ"}
                          />
                        ) : (
                          <TransferBadge
                            amount={transfer.amount}
                            address={transfer.beneficiary}
                            contract={(transfer as FA2Transfer).contractAddress}
                            tokenId={(transfer as FA2Transfer).tokenId}
                          />
                        )}
                      </Container>
                    );
                  })}
                  {list.map(({ key, value }, index) => (
                    <Container
                      key={index}
                      item
                      container
                      alignItems="center"
                      direction={isMobileSmall ? "column" : "row"}
                    >
                      <HighlightedBadge
                        justify="center"
                        alignItems="center"
                        direction="row"
                        container
                      >
                        <Grid item>
                          <DetailsText variant="body1" color="textSecondary">
                            Set &quot;{key}&quot; to &quot;{value}&quot;
                          </DetailsText>
                        </Grid>
                      </HighlightedBadge>
                    </Container>
                  ))}
                </>
              ) : null}
            </Grid>
          </Grid>
          {isMobileSmall && (
            <DetailsHeader xs={12} alignItems="center" container>
              <Typography variant="subtitle1" color="textSecondary">
                DETAILS
              </Typography>
            </DetailsHeader>
          )}
          <ProposalStatusHistory />
        </DetailsContainer>
      </Grid>
    </>
  );
};
