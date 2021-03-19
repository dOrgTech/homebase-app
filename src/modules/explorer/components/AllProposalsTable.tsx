import React from "react";
import { Grid, styled, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { ProposalTableRow } from "./ProposalTableRow";
import { ResponsiveTableContainer } from "./ResponsiveTable";
import { TableHeader } from "./styled/TableHeader";

const ProposalTableHeadText: React.FC = ({ children }) => (
  <ProposalTableHeadItem variant="subtitle1" color="textSecondary">
    {children}
  </ProposalTableHeadItem>
);

const ProposalTableHeadItem = styled(Typography)({
  fontWeight: "bold",
});

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

export const AllProposalsTable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: dao } = useDAO(id);
  const { data: proposalsData } = useProposals(dao && dao.address);

  return (
    <ResponsiveTableContainer>
      <TableHeader container direction="row">
        <Grid item xs={4}>
          <ProposalTableHeadText>ALL PROPOSALS</ProposalTableHeadText>
        </Grid>
        <Grid item xs={2}>
          <ProposalTableHeadItem color="textSecondary" align="center">
            CYCLE
          </ProposalTableHeadItem>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}>
          <ProposalTableHeadText>THRESHOLD %</ProposalTableHeadText>
        </Grid>
      </TableHeader>
      {proposalsData &&
        proposalsData.map((proposal, i) => (
          <ProposalTableRow
            key={`proposal-${i}`}
            {...proposal}
            daoId={dao?.address}
            quorumTreshold={dao?.storage.quorumTreshold || 0}
          />
        ))}

      {proposalsData && proposalsData.length === 0 ? (
        <NoProposals variant="subtitle1" color="textSecondary">
          No proposals
        </NoProposals>
      ) : null}
    </ResponsiveTableContainer>
  );
};
