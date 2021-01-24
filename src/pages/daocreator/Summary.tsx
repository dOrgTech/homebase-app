import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { TokenHolders } from "../../store/dao-info/types";
import { TokenHoldersRow } from "../daoexplorer/components/TokenHoldersRow";

interface Props {
  setActiveStep: any;
  setGovernanceStep: any;
  setProgress: any;
}

const CustomUrlButton = styled(withTheme(Paper))((props) => ({
  border: "none",
  background: "inherit",
  width: 69,
  height: 31,
  boxSizing: "border-box",
  borderRadius: 21,
  cursor: "pointer",
  boxShadow: "none",
  textAlign: "center",
  marginLeft: "12px",
  padding: 5,
  color: props.theme.palette.secondary.main,
  fontFamily: "system-ui",
}));

const CustomTypography = styled(Typography)({
  marginTop: 10,
});

const SecondContainer = styled(Grid)({
  marginTop: 25,
});

const CustomColumnContainer = styled(Grid)({
  borderLeft: "1px solid #3D3D3D",
  marginTop: 25,
});

const CustomSettingsContainer = styled(Grid)({
  border: "1px solid #3D3D3D",
  marginTop: 25,
  padding: 25,
});

const CustomGridItem = styled(Grid)({
  paddingLeft: 27,
  marginBottom: 12,
});

const CustomItalic = styled(Typography)({
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: 14,
  paddingBottom: 12,
  borderBottom: "1px solid #3D3D3D",
  color: "#fff",
  opacity: 0.5,
});

const CustomItalicAdmin = styled(Typography)({
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: 14,
  marginTop: 13,
});

const CustomItalicAdminText = styled(Typography)({
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: 14,
  marginTop: 13,
  marginRight: 4,
  color: "#fff",
  opacity: 0.5,
});

const CustomToken = styled(Typography)({
  color: "#fff",
  textAlign: "end",
});

const AddressContainer = styled(Grid)({
  maxHeight: 212,
  overflowY: "scroll",
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

export const Summary: React.FC<Props> = (props) => {
  const { setActiveStep, setGovernanceStep, setProgress } = props;

  const storageDaoInformation = useSelector<
    AppState,
    AppState["saveDaoInformationReducer"]
  >((state) => state.saveDaoInformationReducer);

  setProgress(75);

  const goToVoting = () => {
    setGovernanceStep(0);
    setActiveStep(1);
  };

  const goToSettings = () => {
    // setGovernanceStep(1);
    setActiveStep(2);
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
