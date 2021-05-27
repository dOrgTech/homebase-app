import React, { useMemo } from "react";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { useParams } from "react-router-dom";

import { TemplateHeader } from "modules/explorer/components/TemplateHeader";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { RegistryDAO } from "services/contracts/baseDAO";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import dayjs from "dayjs";
import {
  ProposalStatus,
  RegistryProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { RegistryItemsTable } from "../components/RegistryItemsTable";
import { HistoryTable } from "../components/HistoryTable";
import { AppTabBar } from "modules/explorer/components/AppTabBar";
import { TabPanel } from "modules/explorer/components/TabPanel";

export const Registry: React.FC = () => {
  const { id } = useParams<{
    proposalId: string;
    id: string;
  }>();
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: daoData } = useDAO(id);
  const dao = daoData as RegistryDAO | undefined;
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
    if (!dao) {
      return [];
    }

    return dao.extra.registry.map((d) => ({
      ...d,
      name: d.key,
    }));
  }, [dao]);

  const [value, setValue] = React.useState(0);

  return (
    <>
      <Grid item xs>
        <TemplateHeader template="registry" />

        {isMobileSmall ? (
          <>
            <AppTabBar
              value={value}
              setValue={setValue}
              labels={["REGISTRY ITEMS", "UPDATE HISTORY"]}
            />
            <TabPanel value={value} index={0}>
              <RegistryItemsTable
                isMobileSmall={isMobileSmall}
                registryList={registryList}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <HistoryTable
                isMobileSmall={isMobileSmall}
                proposals={proposals}
              />
            </TabPanel>
          </>
        ) : (
          <>
            <RegistryItemsTable
              isMobileSmall={isMobileSmall}
              registryList={registryList}
            />
            <HistoryTable isMobileSmall={isMobileSmall} proposals={proposals} />
          </>
        )}
      </Grid>
    </>
  );
};
