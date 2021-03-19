import { Grid, styled, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTokenHoldersWithVotes } from "services/contracts/baseDAO/hooks/useTokenHoldersWithVotes";
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

export const TopHoldersTable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: members } = useTokenHoldersWithVotes(id);

  const formattedMembers = useMemo(() => {
    if (!members) {
      return [];
    }
    return members
      .map((member) => {
        return {
          username: member.address,
          weight: member.balances[0].toString(),
          votes: member.votes.toString(),
          proposals_voted: member.proposalsVoted,
        };
      })
      .sort((a, b) => Number(b.weight) - Number(a.weight));
  }, [members]);

  return (
    <ResponsiveTableContainer>
      <TableHeader container wrap="nowrap">
        <Grid item xs={5}>
          <ProposalTableHeadText>
            TOP TOKEN HOLDERS BY ADDRESS
          </ProposalTableHeadText>
        </Grid>
        <Grid item xs={3}>
          <ProposalTableHeadText>VOTES</ProposalTableHeadText>
        </Grid>
        <Grid item xs={2}>
          <ProposalTableHeadText>WEIGHT</ProposalTableHeadText>
        </Grid>
        <Grid item xs={2}>
          <ProposalTableHeadText>PROPOSALS VOTED</ProposalTableHeadText>
        </Grid>
      </TableHeader>
      {formattedMembers.map((holder, i) => (
        <TopHoldersTableRow key={`holder-${i}`} {...holder} index={i} />
      ))}
    </ResponsiveTableContainer>
  );
};
