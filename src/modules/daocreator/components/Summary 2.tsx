import { Grid, styled, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { AppState } from "../../../store";
import { TokenHolders } from "../../../store/dao-info/types";
import { TokenHoldersRow } from "../../daoexplorer/components/TokenHoldersRow";
import { CreatorContext } from "../state/context";
import { ActionTypes } from "../state/types";

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

export const Summary = (): JSX.Element => {
  const { dispatch: creatorDispatch } = useContext(CreatorContext);
  const storageDaoInformation = useSelector<
    AppState,
    AppState["saveDaoInformationReducer"]
  >((state) => state.saveDaoInformationReducer);

  const goToVoting = () => {
    creatorDispatch({ type: ActionTypes.UPDATE_STEP, step: 1 });
    creatorDispatch({ type: ActionTypes.UPDATE_GOVERNANCE_STEP, step: 0 });
  };

  const goToSettings = () => {
    creatorDispatch({ type: ActionTypes.UPDATE_STEP, step: 2 });
    creatorDispatch({ type: ActionTypes.UPDATE_GOVERNANCE_STEP, step: 1 });
  };

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
              {storageDaoInformation.token_symbol}
            </TitleSpacing>
          </Grid>
          <Grid item xs={12}>
            <TitleSpacing color="textSecondary" variant="h3">
              {storageDaoInformation.token_name}
            </TitleSpacing>
          </Grid>
          <Grid item xs={12}>
            <TitleSpacing color="textSecondary" variant="body1">
              {storageDaoInformation.description}
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
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Administrator
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <AdminAddress
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {storageDaoInformation.administrator}
                </AdminAddress>
              </Grid>
            </AdminContainer>
          </Grid>
          {storageDaoInformation.token_holders.map(
            (holder: TokenHolders, i: number) => {
              return <TokenHoldersRow key={`holder-${i}`} {...holder} />;
            }
          )}
        </SecondContainer>

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
                  Transfers locked?
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {storageDaoInformation.lock_disabled ? "YES" : "NO"}
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Minimum Stake
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {storageDaoInformation.min_stake}%
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Proposal Period Duration
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {storageDaoInformation.voting_days}d{" "}
                  {storageDaoInformation.proposal_hours}h{" "}
                  {storageDaoInformation.proposal_minutes}m
                </Typography>
              </Grid>
            </UnderlinedGrid>
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
                  {storageDaoInformation.voting_days}d{" "}
                  {storageDaoInformation.voting_hours}h{" "}
                  {storageDaoInformation.voting_minutes}m
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>
        </SecondContainer>
      </Grid>
    </>
  );
};
