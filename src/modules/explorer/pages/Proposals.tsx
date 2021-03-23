import {
  Grid,
  styled,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { ActionTypes, ModalsContext } from "../ModalsContext";
import { connectIfNotConnected } from "services/contracts/utils";
import { useTezos } from "services/beacon/hooks/useTezos";
import { Info } from "@material-ui/icons";
import { DAOStatsRow } from "../components/DAOStatsRow";
import { RectangleContainer } from "../components/styled/RectangleHeader";
import { PrimaryButton } from "../components/styled/PrimaryButton";
import { ProposalsTable } from "../components/ProposalsTable";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { ViewButton } from "../components/ViewButton";
import { AppTabBar } from "../components/AppTabBar";
import { TabPanel } from "../components/TabPanel";

const InfoIconInput = styled(Info)({
  cursor: "default",
  top: 0,
  fontSize: 20,
  marginLeft: 6,
});

const ButtonsContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  [theme.breakpoints.down("xs")]: {
    marginTop: 25,
  },
}));

export const Proposals: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: dao } = useDAO(id);
  const { data } = useDAO(id);
  const { mutate } = useFlush();
  const theme = useTheme();
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTab, setSelectedTab] = React.useState(0);

  const { tezos, connect } = useTezos();
  const name = dao && dao.metadata.unfrozenToken.name;

  const { data: proposalsData } = useProposals(dao && dao.address);

  const { dispatch } = useContext(ModalsContext);

  const onNewProposal = useCallback(() => {
    if (dao) {
      switch (dao.template) {
        case "registry":
          dispatch({
            type: ActionTypes.OPEN_REGISTRY_TRANSACTION,
            payload: {
              daoAddress: dao.address,
            },
          });
          break;
        case "treasury":
          dispatch({
            type: ActionTypes.OPEN_TREASURY_PROPOSAL,
            payload: {
              daoAddress: dao.address,
            },
          });
          break;
      }
    }
  }, [dao, dispatch]);

  const onFlush = useCallback(async () => {
    await connectIfNotConnected(tezos, connect);
    // @TODO: we need to add an atribute to the proposals
    // type in order to know if it was flushed or not
    if (proposalsData && proposalsData.length && data) {
      mutate({
        dao: data,
        numOfProposalsToFlush: proposalsData.length + 1,
      });
      return;
    }

    console.log("no proposal data");
  }, [connect, data, mutate, proposalsData, tezos]);

  return (
    <>
      <Grid item xs>
        <RectangleContainer container direction="row">
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="secondary"
              align={isMobileSmall ? "center" : "left"}
            >
              {name}
            </Typography>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justify={isMobileSmall ? "center" : "flex-start"}
            >
              <Grid item>
                <Typography
                  variant="h5"
                  color="textSecondary"
                  align={isMobileSmall ? "center" : "left"}
                >
                  Proposals
                </Typography>
              </Grid>
              <Grid item>
                <Grid item>
                  <ViewButton
                    variant="outlined"
                    onClick={onFlush}
                    disabled={!dao}
                  >
                    FLUSH
                  </ViewButton>
                  <Tooltip title="Execute all passed proposals and drop all expired or rejected">
                    <InfoIconInput color="secondary" />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <ButtonsContainer
            item
            container
            xs={12}
            sm={6}
            justify={isMobileSmall ? "center" : "flex-end"}
            spacing={2}
          >
            <Grid item>
              <PrimaryButton
                variant="outlined"
                onClick={onNewProposal}
                disabled={!dao}
              >
                NEW PROPOSAL
              </PrimaryButton>
            </Grid>
          </ButtonsContainer>
        </RectangleContainer>
        <DAOStatsRow />
        {isMobileSmall ? (
          <>
            <AppTabBar
              value={selectedTab}
              setValue={setSelectedTab}
              labels={["ACTIVE PROPOSALS", "PASSED PROPOSALS", "ALL PROPOSALS"]}
            />
            <TabPanel value={selectedTab} index={0}>
              <ProposalsTable
                headerText="Active Proposals"
                status={ProposalStatus.ACTIVE}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <ProposalsTable
                headerText="Passed Proposals"
                status={ProposalStatus.PASSED}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <ProposalsTable headerText="All Proposals" />
            </TabPanel>
          </>
        ) : (
          <>
            <ProposalsTable
              headerText="Active Proposals"
              status={ProposalStatus.ACTIVE}
            />

            <ProposalsTable
              headerText="Passed Proposals"
              status={ProposalStatus.PASSED}
            />
            <ProposalsTable headerText="All Proposals" />
          </>
        )}

        {/* <ProposalsContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <UnderlineText
              color="textSecondary"
              variant="subtitle1"
              align="center"
            >
              LOAD MORE
            </UnderlineText>
          </ProposalsContainer> */}
      </Grid>
    </>
  );
};
