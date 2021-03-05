import { Box, Grid, styled, Typography, withTheme } from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import { SideBar } from "modules/explorer/components";
import { RegistryHeader } from "../components/RegistryHeader";
import { RegistryTableRow } from "../components/TableRow";
import { RegistryHistoryRow } from "../components/HistoryRow";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { RegistryDAO } from "services/contracts/baseDAO";
import { useRegistryList } from "services/contracts/baseDAO/hooks/useRegistryList";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import dayjs from "dayjs";
import {
  ProposalStatus,
  RegistryProposalWithStatus,
} from "services/bakingBad/proposals/types";

const ListItemContainer = styled(withTheme(Grid))((props) => ({
  paddingLeft: 112,
  background: props.theme.palette.primary.main,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
  },
}));

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  minHeight: 125,
  padding: "40px 112px",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const TableContainer = styled(Box)({
  width: "100%",
  padding: "72px 112px",
  boxSizing: "border-box",
  paddingBottom: "24px",
  paddingLeft: 0,
});

const TableHeader = styled(Grid)({
  paddingLeft: 112,
});

const BorderBottom = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 20,
}));

const RightText = styled(Typography)({
  opacity: 0.8,
  fontWeight: 400,
});

const LeftText = styled(Typography)({
  fontWeight: 700,
});

const ProposalTableHeadText: React.FC<{ align: any }> = ({ children, align }) =>
  align === "left" ? (
    <LeftText variant="subtitle1" color="textSecondary" align={align}>
      {children}
    </LeftText>
  ) : (
    <RightText variant="subtitle1" color="textSecondary" align={align}>
      {children}
    </RightText>
  );

const NoProposals = styled(Typography)({
  marginTop: 20,
  marginBottom: 20,
});

export const Registry: React.FC = () => {
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();

  const { data: daoData } = useDAO(id);
  const dao = daoData as RegistryDAO | undefined;
  const { data: registryData } = useRegistryList(dao?.address);
  const { data: proposalsData } = useProposals(dao?.address);
  const registryProposalsData = proposalsData as
    | RegistryProposalWithStatus[]
    | undefined;

  const proposals = useMemo(() => {
    if (!registryProposalsData) {
      return [];
    }

    return registryProposalsData
      .filter((proposal) => proposal.status === ProposalStatus.PASSED)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .map((proposal) => ({
        date: dayjs(proposal.startDate).format("L"),
        description: "Proposal description",
        address: proposal.id,
        name: proposal.list.map((item, i) =>
          i === 0 ? item.key : `, ${item.key}`
        ),
      }));
  }, [registryProposalsData]);

  const registryList = useMemo(() => {
    if (!registryData) {
      return [];
    }

    return registryData.map((d) => ({
      ...d,
      name: d.key,
    }));
  }, [registryData]);

  return (
    <PageLayout container wrap="nowrap">
      <SideBar dao={id} />
      <Grid item xs>
        <MainContainer container justify="space-between">
          <Grid item xs={12}>
            <RegistryHeader name={"MY GREAT TOKEN"} />
          </Grid>
        </MainContainer>
        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={12}>
              <BorderBottom item container wrap="nowrap">
                <Grid item xs={3}>
                  <ProposalTableHeadText align={"left"}>
                    REGISTRY ITEMS
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={4}>
                  <Grid item container direction="row" justify="center">
                    <ProposalTableHeadText align={"left"}>
                      VALUE
                    </ProposalTableHeadText>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <ProposalTableHeadText align={"left"}>
                    LAST UPDATED
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={2}></Grid>
              </BorderBottom>
            </Grid>
          </TableHeader>

          {registryList.map((item, i) => (
            <ListItemContainer key={`item-${i}`}>
              <RegistryTableRow {...item} />
            </ListItemContainer>
          ))}
          {registryList.length === 0 ? (
            <ListItemContainer>
              <NoProposals variant="subtitle1" color="textSecondary">
                No registry items
              </NoProposals>
            </ListItemContainer>
          ) : null}
        </TableContainer>

        <TableContainer>
          <TableHeader container wrap="nowrap">
            <Grid item xs={12}>
              <BorderBottom item container wrap="nowrap">
                <Grid item xs={6}>
                  <ProposalTableHeadText align={"left"}>
                    UPDATE HISTORY
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={3}>
                  <ProposalTableHeadText align={"right"}>
                    DATE
                  </ProposalTableHeadText>
                </Grid>
                <Grid item xs={3}>
                  <ProposalTableHeadText align={"right"}>
                    PROPOSAL
                  </ProposalTableHeadText>
                </Grid>
              </BorderBottom>
            </Grid>
          </TableHeader>

          {proposals.map((item, i) => (
            <ListItemContainer key={`item-${i}`}>
              <RegistryHistoryRow {...item} />
            </ListItemContainer>
          ))}

          {proposals.length === 0 ? (
            <ListItemContainer>
              <NoProposals variant="subtitle1" color="textSecondary">
                No entries
              </NoProposals>
            </ListItemContainer>
          ) : null}
        </TableContainer>
      </Grid>
    </PageLayout>
  );
};
