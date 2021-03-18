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
import { Button } from "@material-ui/core";
import { useFlush } from "services/contracts/baseDAO/hooks/useFlush";
import { ActionTypes, ModalsContext } from "../ModalsContext";
import { connectIfNotConnected } from "services/contracts/utils";
import { useTezos } from "services/beacon/hooks/useTezos";
import { Info } from "@material-ui/icons";
import { DAOStatsRow } from "../components/DAOStatsRow";
import { ActiveProposalsTable } from "../components/ActiveProposalsTable";
import { PassedProposalsTable } from "../components/PassedProposalsTable";
import { AllProposalsTable } from "../components/AllProposalsTable";

const StyledContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  minHeight: 125,
  padding: "4% 0",
  boxSizing: "border-box",
}));

const MainContainer = styled(Grid)(({ theme }) => ({
  padding: "40px 8%",
  borderBottom: `2px solid ${theme.palette.primary.light}`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: 53,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.secondary.main,
  minWidth: 171,
}));

const InfoIconInput = styled(Info)({
  cursor: "default",
  top: 0,
  fontSize: 20,
  marginLeft: 6,
});

const FlushContainer = styled(Grid)({
  display: "flex",
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
  const isMobileMedium = useMediaQuery(theme.breakpoints.down("md"));

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
        <MainContainer>
          <StyledContainer container direction="row">
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="secondary">
                {name}
              </Typography>
              <Typography variant="h5" color="textSecondary">
                Proposals
              </Typography>
            </Grid>
            <ButtonsContainer
              item
              container
              xs={12}
              sm={6}
              justify={isMobileMedium ? "flex-start" : "flex-end"}
              spacing={2}
            >
              <Grid item>
                <StyledButton
                  variant="outlined"
                  onClick={onNewProposal}
                  disabled={!dao}
                >
                  NEW PROPOSAL
                </StyledButton>
              </Grid>
              <FlushContainer item>
                <StyledButton
                  variant="outlined"
                  onClick={onFlush}
                  disabled={!dao}
                >
                  FLUSH
                </StyledButton>
                <Tooltip title="Execute all passed proposals and drop all expired or rejected">
                  <InfoIconInput color="secondary" />
                </Tooltip>
              </FlushContainer>
            </ButtonsContainer>
          </StyledContainer>
        </MainContainer>
        <DAOStatsRow />
        <>
          <ActiveProposalsTable />
        </>
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

        <PassedProposalsTable />
        <AllProposalsTable />
      </Grid>
    </>
  );
};
