import {
  CircularProgress,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import BigNumber from "bignumber.js";
import React, { useMemo, useState } from "react";
import { useTokenHoldersWithVotes } from "services/contracts/baseDAO/hooks/useTokenHoldersWithVotes";
import { useDAOID } from "../daoRouter";
import { ResponsiveTableContainer } from "./ResponsiveTable";
import { TableHeader } from "./styled/TableHeader";
import { TopHoldersTableRow } from "./TokenHolders";

const ProposalTableHeadText: React.FC = ({ children }) => (
  <ProposalTableHeadItem variant="subtitle1" color="textSecondary">
    {children}
  </ProposalTableHeadItem>
);

const ProposalTableHeadItem = styled(Typography)({
  fontWeight: "bold",
});

const Header = styled(TableHeader)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: "20px 0 20px 25px",
  },
}));

const UnderlineText = styled(Typography)(() => ({
  textDecoration: "underline",
  cursor: "pointer",
  margin: "28px 0",
}));

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40,
});

export const TopHoldersTable: React.FC = () => {
  const daoId = useDAOID();
  const [displayAll, setDisplayAll] = useState(false);
  const { data: members, isLoading } = useTokenHoldersWithVotes(daoId);
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const formattedMembers = useMemo(() => {
    if (!members) {
      return [];
    }
    return members
      .map((member) => {
        return {
          username: member.holder.address,
          total_balance: new BigNumber(member.total_balance).dp(10).toString(),
          available_balance: new BigNumber(member.available_balance)
            .dp(10)
            .toString(),
          votes: member.votes.dp(10).toString(),
          proposals_voted: member.proposalsVoted,
        };
      })
      .sort((a, b) => Number(b.total_balance) - Number(a.total_balance));
  }, [members]);

  return (
    <ResponsiveTableContainer>
      <Header container wrap="nowrap">
        <Grid item xs={12} md={4}>
          <ProposalTableHeadText>
            TOKEN HOLDERS BY STAKED TOKENS
          </ProposalTableHeadText>
        </Grid>
        {!isMobileSmall && (
          <>
            <Grid item xs={2}>
              <ProposalTableHeadText>VOTES</ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText>AVAILABLE STAKED</ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText>TOTAL STAKED</ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText>PROPOSALS VOTED</ProposalTableHeadText>
            </Grid>
          </>
        )}
      </Header>

      <>
        {isLoading && (
          <LoaderContainer container direction="row" justify="center">
            <CircularProgress color="secondary" />
          </LoaderContainer>
        )}
      </>

      {displayAll ? (
        <>
          {formattedMembers.map((holder, i) => (
            <TopHoldersTableRow key={`holder-${i}`} {...holder} index={i} />
          ))}
          <Grid container direction="row" justify="center">
            <UnderlineText
              variant="subtitle1"
              color="secondary"
              onClick={() => setDisplayAll(false)}
            >
              DISPLAY LESS
            </UnderlineText>
          </Grid>
        </>
      ) : (
        <>
          {formattedMembers.slice(0, 10).map((holder, i) => (
            <TopHoldersTableRow key={`holder-${i}`} {...holder} index={i} />
          ))}
          {formattedMembers.length && (
            <Grid container direction="row" justify="center">
              <UnderlineText
                variant="subtitle1"
                color="secondary"
                onClick={() => setDisplayAll(true)}
              >
                DISPLAY ALL HOLDERS
              </UnderlineText>
            </Grid>
          )}
        </>
      )}
    </ResponsiveTableContainer>
  );
};
