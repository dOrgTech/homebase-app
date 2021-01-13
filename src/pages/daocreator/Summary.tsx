import { Grid, Paper, styled, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

interface Props {
  setActiveStep: any;
  setGovernanceStep: any;
}

const CustomUrlButton = styled(Paper)({
  border: "1px solid #3866F9",
  background: "#3866F9",
  width: 69,
  height: 31,
  boxSizing: "border-box",
  borderRadius: 21,
  cursor: "pointer",
  boxShadow: "none",
  textAlign: "center",
  marginLeft: "12px",
  padding: 5,
  color: "#fff",
  fontFamily: "system-ui",
});

const CustomTypography = styled(Typography)({
  paddingBottom: 21,
  borderBottom: "1px solid #E4E4E4",
  marginTop: 10,
});

const SecondContainer = styled(Grid)({
  marginTop: 25,
});

const CustomColumnContainer = styled(Grid)({
  borderLeft: "1px solid #e4e4e4",
  marginTop: 25,
});

const CustomSettingsContainer = styled(Grid)({
  border: "1px solid #e4e4e4",
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
  borderBottom: "1px solid #e4e4e4",
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
});

const CustomToken = styled(Typography)({
  color: "#000000",
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
          <Typography variant="h1">Review information</Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1">
            Review your settings to ensure you’ve made the correct choices.
          </CustomTypography>
        </Grid>

        <SecondContainer container direction="row">
          <Grid item xs={6}>
            <Grid container direction="row" alignItems="center">
              <Typography variant="subtitle1">Voting</Typography>
              <CustomUrlButton onClick={goToVoting}>Edit</CustomUrlButton>
            </Grid>
            <CustomColumnContainer container direction="column">
              <CustomGridItem item>
                <Typography variant="subtitle2">Transfers locked?</Typography>
                <Typography variant="subtitle1">
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
                <Typography variant="subtitle2">Minimum Stake</Typography>
                <Typography variant="subtitle1">
                  {storageDaoInformation.min_stake}
                  {storageDaoInformation.min_stake_percentage ? "%" : null}
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2">
                  Proposal Period Duration
                </Typography>
                <Typography variant="subtitle1">
                  {storageDaoInformation.proposal_days}d{" "}
                  {storageDaoInformation.proposal_hours}h{" "}
                  {storageDaoInformation.proposal_minutes}m
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2">
                  Voting Period Duration
                </Typography>
                <Typography variant="subtitle1">
                  {" "}
                  {storageDaoInformation.voting_days}d{" "}
                  {storageDaoInformation.voting_hours}h{" "}
                  {storageDaoInformation.voting_minutes}m
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2">Minimum Support</Typography>
                <Typography variant="subtitle1">
                  {storageDaoInformation.min_support}%
                </Typography>
              </CustomGridItem>

              <CustomGridItem item>
                <Typography variant="subtitle2">Maximum Spend</Typography>
                <Typography variant="subtitle1">
                  {storageDaoInformation.max_agent} MGT
                </Typography>
              </CustomGridItem>
            </CustomColumnContainer>
          </Grid>

          <Grid item xs={6}>
            <Grid container direction="row" alignItems="center">
              <Typography variant="subtitle1">Token Settings</Typography>
              <CustomUrlButton onClick={goToSettings}>Edit</CustomUrlButton>
            </Grid>
            <CustomSettingsContainer container direction="column">
              <Grid item xs={12}>
                <Typography variant="subtitle2">
                  {storageDaoInformation.token_symbol}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
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
                          <Typography variant="subtitle1">
                            {holder.token_holder.slice(0, 6)}...
                            {holder.token_holder.slice(
                              holder.token_holder.length - 4,
                              holder.token_holder.length
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <CustomToken variant="subtitle2">
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
              <CustomItalicAdminText>Administrator:</CustomItalicAdminText>
              <CustomItalicAdmin>
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
