import { Box, Grid, styled, Typography } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ActionTypes, CreatorContext } from "modules/creator/state";

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

const ContainerButton = styled(Typography)(({ theme }) => ({
  paddingBottom: 8,
  marginTop: 24,
  borderBottom: `1px solid ${theme.palette.primary.light}`,
  cursor: "pointer",
}));

const AdminContainer = styled(Grid)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  marginTop: 16,
  padding: "16px 18px",
}));

const AdminAddress = styled(Typography)({
  wordBreak: "break-all",
});

const UnderlinedGrid = styled(Grid)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.primary.light}`,
  padding: 2,
}));

export const Summary = (): JSX.Element => {
  const { dispatch, state } = useContext(CreatorContext);
  const history = useHistory();
  const match = useRouteMatch();

  const goToVoting = () => {
    history.push(`voting`);
  };

  const goToQuorum = () => {
    history.push(`quorum`);
  };

  const goToSettings = () => {
    history.push(`dao`);
  };

  useEffect(() => {
    dispatch({
      type: ActionTypes.UPDATE_NAVIGATION_BAR,
      next: {
        handler: () => {
          history.push(`review`);
        },
        text: "LAUNCH",
      },
      back: {
        handler: () => history.push(`quorum`),
        text: "BACK",
      },
    });
  }, [dispatch, history, match.path, match.url]);

  return (
    <Box maxWidth={650}>
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
              DAO SETTINGS
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
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle1" color="textSecondary">
                  Administrator
                </Typography>
              </Grid>
              <Grid item xs={6} sm={9}>
                <AdminAddress
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.orgSettings.administrator}
                </AdminAddress>
              </Grid>
            </AdminContainer>
          </Grid>

          <Grid item xs={12}>
            <AdminContainer container direction="row" alignItems="center">
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle1" color="textSecondary">
                  Guardian
                </Typography>
              </Grid>
              <Grid item xs={6} sm={9}>
                <AdminAddress
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.orgSettings.guardian}
                </AdminAddress>
              </Grid>
            </AdminContainer>
          </Grid>
        </SecondContainer>

        <Grid item xs={12}>
          <UnderlinedGrid item container direction="row" alignItems="center">
            <Grid item xs={6} sm={5}>
              <Typography variant="body2" color="textSecondary">
                Governance Token Address
              </Typography>
            </Grid>
            <Grid item xs={6} sm={7}>
              <AdminAddress
                variant="subtitle1"
                color="textSecondary"
                align="right"
              >
                {state.data.orgSettings.governanceToken.address}
              </AdminAddress>
            </Grid>
          </UnderlinedGrid>
        </Grid>

        <Grid item xs={12}>
          <UnderlinedGrid item container direction="row" alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2" color="textSecondary">
                Governance Token ID
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                align="right"
              >
                {state.data.orgSettings.governanceToken.tokenId}
              </Typography>
            </Grid>
          </UnderlinedGrid>
        </Grid>

        <SecondContainer container direction="row">
          <Grid item xs={6}>
            <ContainerSpacing color="textSecondary" variant="subtitle1">
              PROPOSAL & VOTING SETTINGS
            </ContainerSpacing>
          </Grid>
          <Grid item xs={6}>
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
                  Flush Delay Duration
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.proposalFlushDays}d{" "}
                  {state.data.votingSettings.proposalFlushHours}h{" "}
                  {state.data.votingSettings.proposalFlushMinutes}m
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          <Grid item xs={12}>
            <UnderlinedGrid item container direction="row" alignItems="center">
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Proposal time to expire
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  align="right"
                >
                  {state.data.votingSettings.proposalExpiryDays}d{" "}
                  {state.data.votingSettings.proposalExpiryHours}h{" "}
                  {state.data.votingSettings.proposalExpiryMinutes}m
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
                  {state.data.votingSettings.proposeStakeRequired} locked tokens
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
                  {state.data.votingSettings.frozenScaleValue}% of locked tokens
                </Typography>
              </Grid>
            </UnderlinedGrid>
          </Grid>

          {state.data.template === "treasury" && (
            <Grid item xs={12}>
              <UnderlinedGrid
                item
                container
                direction="row"
                alignItems="center"
              >
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
          )}

          {state.data.template === "treasury" && (
            <Grid item xs={12}>
              <UnderlinedGrid
                item
                container
                direction="row"
                alignItems="center"
              >
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
          )}

          <SecondContainer container direction="row">
            <Grid item xs={6}>
              <ContainerSpacing color="textSecondary" variant="subtitle1">
                QUORUM SETTINGS
              </ContainerSpacing>
            </Grid>
            <Grid item xs={6}>
              <ContainerButton
                color="secondary"
                variant="subtitle1"
                align="right"
                onClick={goToQuorum}
              >
                EDIT
              </ContainerButton>
            </Grid>
            <Grid item xs={12}>
              <UnderlinedGrid
                item
                container
                direction="row"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Quorum threshold
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="right"
                  >
                    {state.data.quorumSettings.quorumThreshold}%
                  </Typography>
                </Grid>
              </UnderlinedGrid>
            </Grid>

            <Grid item xs={12}>
              <UnderlinedGrid
                item
                container
                direction="row"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Quorum Change
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="right"
                  >
                    {state.data.quorumSettings.quorumChange}%
                  </Typography>
                </Grid>
              </UnderlinedGrid>
            </Grid>

            <Grid item xs={12}>
              <UnderlinedGrid
                item
                container
                direction="row"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Quorum Max Change
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="right"
                  >
                    {state.data.quorumSettings.quorumMaxChange}%
                  </Typography>
                </Grid>
              </UnderlinedGrid>
            </Grid>

            <Grid item xs={12}>
              <UnderlinedGrid
                item
                container
                direction="row"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Quorum Min. Amount
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="right"
                  >
                    {state.data.quorumSettings.minQuorumAmount}%
                  </Typography>
                </Grid>
              </UnderlinedGrid>
            </Grid>

            <Grid item xs={12}>
              <UnderlinedGrid
                item
                container
                direction="row"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Quorum Max. Amount
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="right"
                  >
                    {state.data.quorumSettings.maxQuorumAmount}%
                  </Typography>
                </Grid>
              </UnderlinedGrid>
            </Grid>

          </SecondContainer>
        </SecondContainer>
      </Grid>
    </Box>
  );
};
