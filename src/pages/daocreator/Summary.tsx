import { Grid, Paper, styled, Typography, withTheme } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

interface Props {
  setActiveStep: any;
  setGovernanceStep: any;
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
  paddingBottom: 21,
  borderBottom: "1px solid #3D3D3D",
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

export const Summary: React.FC<Props> = (props) => {
  const { setActiveStep, setGovernanceStep } = props;

  const storageDaoInformation = useSelector<
    AppState,
    AppState["saveDaoInformationReducer"]
  >((state) => state.saveDaoInformationReducer);

  const goToVoting = () => {
    setGovernanceStep(0);
    setActiveStep(1);
  };

  const goToSettings = () => {
    setGovernanceStep(1);
    setActiveStep(1);
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
          <CustomTypography variant="subtitle1" color="textSecondary">
            Review your settings to ensure you’ve made the correct choices.
          </CustomTypography>
        </Grid>

        <SecondContainer container direction="row">
          <Grid item xs={6}>
            <Grid container direction="row" alignItems="center">
              <Typography variant="subtitle1" color="textSecondary">
                Voting
              </Typography>
              <CustomUrlButton onClick={goToVoting}>EDIT</CustomUrlButton>
            </Grid>
            <CustomColumnContainer container direction="column">
              <CustomGridItem item>
                <Typography variant="subtitle2" color="textSecondary">
                  Transfers locked?
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {storageDaoInformation.lock_disabled ? "YES" : "NO"}
                </Typography>
              </CustomGridItem>

              {/* <CustomGridItem item>
                <Typography variant="subtitle2">
                  Requires Agora Link?
                </Typography>
                <Typography variant="subtitle1">NO</Typography>
              </CustomGridItem> */}

              <CustomGridItem item>
                <Typography variant="subtitle2" color="textSecondary">
                  Minimum Stake
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {storageDaoInformation.min_stake}
                  {storageDaoInformation.min_stake_percentage ? "%" : null}
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2" color="textSecondary">
                  Proposal Period Duration
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {storageDaoInformation.proposal_days}d{" "}
                  {storageDaoInformation.proposal_hours}h{" "}
                  {storageDaoInformation.proposal_minutes}m
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2" color="textSecondary">
                  Voting Period Duration
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {" "}
                  {storageDaoInformation.voting_days}d{" "}
                  {storageDaoInformation.voting_hours}h{" "}
                  {storageDaoInformation.voting_minutes}m
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2" color="textSecondary">
                  Minimum Support
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {storageDaoInformation.min_support}%
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2" color="textSecondary">
                  Maximum Spend
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {storageDaoInformation.max_agent} MGT
                </Typography>
              </CustomGridItem>
            </CustomColumnContainer>
          </Grid>

          <Grid item xs={6}>
            <Grid container direction="row" alignItems="center">
              <Typography variant="subtitle1" color="textSecondary">
                Token Settings
              </Typography>
              <CustomUrlButton onClick={goToSettings}>EDIT</CustomUrlButton>
            </Grid>
            <CustomSettingsContainer container direction="column">
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  {storageDaoInformation.token_symbol}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  {storageDaoInformation.token_name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomItalic>{storageDaoInformation.description}</CustomItalic>
              </Grid>
              <AddressContainer item xs={12}>
                {storageDaoInformation.token_holders.map(
                  (holder: any, index: any) => {
                    return (
                      <SecondContainer container direction="row" key={index}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1" color="textSecondary">
                            {holder.token_holder.slice(0, 6)}...
                            {holder.token_holder.slice(
                              holder.token_holder.length - 4,
                              holder.token_holder.length
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <CustomToken
                            variant="subtitle2"
                            color="textSecondary"
                          >
                            {holder.balance} MGT
                          </CustomToken>
                        </Grid>
                      </SecondContainer>
                    );
                  }
                )}
              </AddressContainer>
            </CustomSettingsContainer>
            <Grid item xs={12} container direction="row">
              <CustomItalicAdminText color="textSecondary">
                Administrator:
              </CustomItalicAdminText>
              <CustomItalicAdmin color="textSecondary">
                {storageDaoInformation.administrator.slice(0, 5)}...
                {storageDaoInformation.administrator.slice(
                  storageDaoInformation.administrator.length - 4,
                  storageDaoInformation.administrator.length
                )}
              </CustomItalicAdmin>
            </Grid>
          </Grid>
        </SecondContainer>
      </Grid>
    </>
  );
};
