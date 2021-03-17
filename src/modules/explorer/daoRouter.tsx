import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";

import { DAO } from "modules/explorer/pages/DAO";
import { Holdings } from "modules/explorer/Treasury/pages/Holdings";
import { Proposals } from "modules/explorer/pages/Proposals";
import { ProposalsPageBase } from "modules/explorer/components/ProposalsPageBase";
import { Registry } from "./Registry/pages/Registry";
import { Grid, styled, useMediaQuery, useTheme } from "@material-ui/core";
import { SideBar } from "./components";
import { ProposalDetails as TreausuryProposalDetails } from "./Treasury/components/ProposalDetails";
import { ProposalDetails as RegistryProposalDetails } from "./Registry/components/ProposalDetails";

const PageLayout = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: "calc(100vh - 102px)",
  [theme.breakpoints.down("xs")]: {
    minHeight: "calc(100vh - 102px)",
    marginBottom: 53,
  },
}));

export const DAORouter = (): JSX.Element => {
  const match = useRouteMatch();
  const theme = useTheme();
  const isMobileExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <PageLayout
      container
      wrap="nowrap"
      direction={isMobileExtraSmall ? "column" : "row"}
    >
      <Switch>
        <Route path={`${match.url}/:id/proposal/treasury/:proposalId`}>
          <SideBar />
          <ProposalsPageBase ProposalDetails={<TreausuryProposalDetails />} />
        </Route>
        <Route path={`${match.url}/:id/proposal/registry/:proposalId`}>
          <SideBar />
          <ProposalsPageBase ProposalDetails={<RegistryProposalDetails />} />
        </Route>
        <Route path={`${match.url}/:id/proposals`}>
          <SideBar />
          <Proposals />
        </Route>
        <Route path={`${match.url}/:id/treasury`}>
          <SideBar />
          <Holdings />
        </Route>
        <Route path={`${match.url}/:id/registry`}>
          <SideBar />
          <Registry />
        </Route>
        <Route path={`${match.url}/:id/overview`}>
          <SideBar />
          <DAO />
        </Route>
        <Redirect from={`${match.url}/:id`} to={`${match.url}/:id/overview`} />
      </Switch>
    </PageLayout>
  );
};
