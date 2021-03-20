import { Grid, styled, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

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
import { TableHeader } from "modules/explorer/components/styled/TableHeader";
import { ResponsiveGenericTable } from "modules/explorer/components/ResponsiveGenericTable";
import { GenericTableContainer } from "modules/explorer/components/GenericTableContainer";

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
  paddingLeft: 112,
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
    <>
      <Grid item xs>
        <RegistryHeader />
        <ResponsiveGenericTable>
          <TableHeader item container wrap="nowrap" id="demo">
            <Grid item xs={3}>
              <ProposalTableHeadText align={"left"}>
                REGISTRY ITEMS
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={4}>
              <Grid item container direction="row">
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
          </TableHeader>

          {registryList.map((item, i) => (
            <GenericTableContainer key={`item-${i}`}>
              <RegistryTableRow {...item} />
            </GenericTableContainer>
          ))}
          {registryList.length === 0 ? (
            <NoProposals variant="subtitle1" color="textSecondary">
              No registry items
            </NoProposals>
          ) : null}
        </ResponsiveGenericTable>

        <ResponsiveGenericTable>
          <TableHeader item container wrap="nowrap" id="demo">
            <Grid item xs={4}>
              <ProposalTableHeadText align={"left"}>
                UPDATE HISTORY
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={3}>
              <ProposalTableHeadText align={"left"}>
                PROPOSAL TITLE
              </ProposalTableHeadText>
            </Grid>
            <Grid item xs={3}>
              <ProposalTableHeadText align={"left"}>DATE</ProposalTableHeadText>
            </Grid>
            <Grid item xs={2}>
              <ProposalTableHeadText align={"left"}>
                PROPOSAL
              </ProposalTableHeadText>
            </Grid>
          </TableHeader>

          {proposals.map((item, i) => (
            <GenericTableContainer key={`item-${i}`}>
              <RegistryHistoryRow {...item} />
            </GenericTableContainer>
          ))}

          {proposals.length === 0 ? (
            <NoProposals variant="subtitle1" color="textSecondary">
              No entries
            </NoProposals>
          ) : null}
        </ResponsiveGenericTable>
      </Grid>
    </>
  );
};
