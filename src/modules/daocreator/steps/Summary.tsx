import { Box, Grid, styled, Typography } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { TokenHoldersRow } from "../../daoexplorer/components/TokenHoldersRow";
import { CreatorContext } from "../state/context";
import { ActionTypes, TokenHolder } from "../state/types";

const CustomTypography = styled(Typography)({
  marginTop: 10,
});

const SecondContainer = styled(Grid)({
  marginTop: 25,
});

const TitleSpacing = styled(Typography)({
  marginTop: 12,
});

const ContainerSpacing = styled(Typography)({
  marginTop: 24,
});

const ContainerSpacingButton = styled(Typography)({
  marginTop: 24,
  cursor: "pointer",
});

const ContainerButton = styled(Typography)({
  paddingBottom: 8,
  marginTop: 24,
  borderBottom: "1px solid #3D3D3D",
});

const AdminContainer = styled(Grid)({
  border: "1px solid #3D3D3D",
  marginTop: 16,
  padding: "16px 18px",
});

const AdminAddress = styled(Typography)({
  wordBreak: "break-all",
});

const UnderlinedGrid = styled(Grid)({
  borderBottom: "1px solid #3D3D3D",
  padding: 2,
});

const TokenHoldersContainer = styled(Box)({
  marginTop: 5,
  maxHeight: 200,
  overflowY: "auto",
  width: "100%",
});

export const Summary = (): JSX.Element => {
  const { dispatch, state } = useContext(CreatorContext);
  const { activeStep } = state;

  const goToVoting = () => {
    dispatch({ type: ActionTypes.UPDATE_STEP, step: 1 });
    dispatch({ type: ActionTypes.UPDATE_GOVERNANCE_STEP, step: 0 });
  };

  const goToSettings = () => {
    dispatch({ type: ActionTypes.UPDATE_STEP, step: 2 });
    dispatch({ type: ActionTypes.UPDATE_GOVERNANCE_STEP, step: 0 });
  };

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      next: {
        handler: () => {
          dispatch({ type: ActionTypes.UPDATE_STEP, step: activeStep + 1 });
        },
        text: "LAUNCH",
      },
      back: {
        handler: () =>
          dispatch({ type: ActionTypes.UPDATE_STEP, step: activeStep - 1 }),
        text: "BACK",
      },
    });
  }, [activeStep, dispatch]);

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        style={{ height: "fit-content" }}
      >
        <Grid item xs={12}>
          <Typography variant="h3" color="textSecondary">
            Review information
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTypography variant="body1" color="textSecondary">
            Review your settings to ensure you’ve made the correct choices.
          </CustomTypography>
        </Grid>

        <SecondContainer container direction="row">
          <Grid item xs={12}>
            <TitleSpacing color="secondary" variant="subtitle1">
              {state.data.orgSettings.symbol}
            </TitleSpacing>
          </Grid>
          <Grid item xs={12}>
            <TitleSpacing color="textSecondary" variant="h3">
              {state.data.orgSettings.name}
            </TitleSpacing>
          </Grid>
          <Grid item xs={12}>
            <TitleSpacing color="textSecondary" variant="body1">
              {state.data.orgSettings.description}
            </TitleSpacing>
          </Grid>
        </SecondContainer>

        <SecondContainer container direction="row">
          <Grid item xs={6}>
            <ContainerSpacing color="textSecondary" variant="subtitle1">
              TOKEN SETTINGS
            </ContainerSpacing>
          </Grid>
          <Grid item xs={6}>
            <ContainerSpacingButton
              color="secondary"
              variant="subtitle1"
              align="right"
              onClick={goToSettings}
            >
              EDIT
            </ContainerSpacingButton>
          </Grid>

          <Grid item xs={12}>
            <AdminContainer container direction="row" alignItems="center">
              <Grid item xs={3}>
                <Typography variant="subtitle1" color="textSecondary">
                  Administrator
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <AdminAddress
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.memberSettings.administrator}
                </AdminAddress>
              </Grid>
            </AdminContainer>
          </Grid>
        </SecondContainer>

        <TokenHoldersContainer>
          {state.data.memberSettings.tokenHolders.map(
            (holder: TokenHolder, i: number) => {
              return (
                <TokenHoldersRow
                  key={`holder-${i}`}
                  {...holder}
                  symbol={state.data.orgSettings.symbol}
                />
              );
            }
          )}
        </TokenHoldersContainer>

        <SecondContainer container direction="row">
          <Grid item xs={12}>
            <ContainerButton
              color="secondary"
              variant="subtitle1"
              align="right"
              onClick={goToVoting}
            >
              EDIT
            </ContainerButton>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Voting Period Duration
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.votingDays}d{" "}
                  {state.data.votingSettings.votingHours}h{" "}
                  {state.data.votingSettings.votingMinutes}m
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Stake required to propose
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.proposeStakePercentage} * Proposal
                  size + {state.data.votingSettings.proposeStakeRequired} (
                  {state.data.orgSettings.symbol})
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Stake returned if rejected
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.frozenScaleValue}% of locked{" "}
                  {state.data.orgSettings.symbol}
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Transfer maximum XTZ amount
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.maxXtzAmount} XTZ
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Transfer minimum XTZ amount
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.minXtzAmount} XTZ
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Quorum treshold
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.quorumTreshold}{" "}
                  {state.data.orgSettings.symbol}
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Maximum proposal size
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.maxProposalSize}
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>
        </SecondContainer>
      </Grid>
    </>
  );
};
