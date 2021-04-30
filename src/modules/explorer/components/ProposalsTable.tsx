import React from "react";
import {
  CircularProgress,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { ResponsiveTableContainer } from "./ResponsiveTable";
import { TableHeader } from "./styled/TableHeader";
import { ProposalTableRow } from "./ProposalTableRow";

const ProposalTableHeadText: React.FC = ({ children }) => (
  <ProposalTableHeadItem variant="subtitle1" color="textSecondary">
    {children}
  </ProposalTableHeadItem>
);

const ProposalTableHeadItem = styled(Typography)({
  fontWeight: "bold",
});

const NoProposals = styled(Typography)(({ theme }) => ({
  marginTop: 20,
  marginBottom: 20,

  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
  },
}));

interface Props {
  headerText: string;
  status?: ProposalStatus;
}

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40,
});

export const ProposalsTable: React.FC<Props> = ({ headerText, status }) => {
  const { id } = useParams<{ id: string }>();
  const { data: dao } = useDAO(id);
  const { data: proposalsData, isLoading } = useProposals(
    dao && dao.address,
    status
  );
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ResponsiveTableContainer>
      {!isMobileSmall ? (
        <TableHeader container direction="row">
          <Grid item xs={3}>
            <ProposalTableHeadText>
              {headerText.toUpperCase()}
            </ProposalTableHeadText>
          </Grid>
          {/* <Grid item xs={2}>
            <ProposalTableHeadItem color="textSecondary" align="center">
              CYCLE
            </ProposalTableHeadItem>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={3}>
            <ProposalTableHeadText>THRESHOLD %</ProposalTableHeadText>
          </Grid> */}
        </TableHeader>
      ) : null}

      {proposalsData &&
        proposalsData.map((proposal, i) => (
          <ProposalTableRow
            key={`proposal-${i}`}
            {...proposal}
            daoId={dao?.address}
          />
        ))}

      {proposalsData && proposalsData.length === 0 ? (
        <NoProposals variant="subtitle1" color="textSecondary">
          No {status ? status : ""} proposals
        </NoProposals>
      ) : null}

      {isLoading && (
        <LoaderContainer container direction="row" justify="center">
          <CircularProgress color="secondary" />
        </LoaderContainer>
      )}
    </ResponsiveTableContainer>
  );
};
