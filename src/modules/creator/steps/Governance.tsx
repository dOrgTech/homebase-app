import {
  Grid,
  Paper,
  styled,
  Typography,
  Slider,
  withStyles,
  withTheme,
  Box,
  Tooltip,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import React, { useContext, useEffect } from "react";
import { Field, Form, Formik, getIn } from "formik";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

import { CreatorContext, ActionTypes } from "modules/creator/state";
import { handleGovernanceFormErrors } from "modules/creator/utils";
import { VotingSettings } from "services/contracts/baseDAO/types";
import { InfoOutlined } from "@material-ui/icons";
import { useTotalSupply } from "modules/common/hooks/useTotalSupply";

const CustomTypography = styled(Typography)(({ theme }) => ({
  paddingBottom: 10,
  borderBottom: `1px solid ${theme.palette.primary.light}`,
  marginTop: 10,
  marginBottom: 33,
}));

const ErrorText = styled(Typography)({
  display: "block",
  fontSize: 14,
  color: "red",
});

const SecondContainer = styled(Grid)({
  marginTop: 10,
});

const SpacingContainer = styled(Grid)({
  marginTop: 25,
});

const StakeContainer = styled(Grid)({
  display: "block",
});

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  height: 62,
  marginTop: 14,
  "&:nth-child(2)": {
    borderLeft: "none",
    borderRight: "none",
    [theme.breakpoints.down("sm")]: {
      borderLeft: `1px solid ${theme.palette.primary.light}`,
      borderRight: `1px solid ${theme.palette.primary.light}`,
    },
  },
}));

const AdditionContainer = styled(Grid)(({ theme }) => ({
  marginTop: 14,
  border: `1px solid ${theme.palette.primary.light}`,
  height: 62,
}));

const GridItemCenter = styled(Grid)({
  textAlign: "center",
});

const ItemContainer = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: 12,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${theme.palette.secondary.light}`,
  },
}));

const ValueText = styled(Typography)({
  fontSize: 14,
});

const StyledSlider = withStyles({
  root: {
    textAlign: "center",
    width: "100%",
  },
  valueLabel: {
    textAlign: "center",
  },
  thumb: {
    height: 20,
    width: 20,
    top: "24.5%",
    backgroundColor: "#fff",
    border: "3px solid #fff",
  },
  track: {
    backgroundColor: "#4BCF93",
    borderRadius: "4px",
    height: 2,
  },
})(Slider);

const CustomSliderValue = styled(withTheme(Paper))((props) => ({
  boxShadow: "none",
  height: 62,
  border: `1px solid ${props.theme.palette.primary.light}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 0,
  background: props.theme.palette.primary.main,
}));

const Value = styled(Typography)({
  textAlign: "center",
  padding: "15%",
});

const styles = {
  voting: {
    marginTop: 6,
  },
};

const GridNoPadding = styled(Grid)({
  padding: "0px !important",
});

const InfoIconInput = styled(InfoOutlined)({
  cursor: "default",
});

//@TODO: Remove any from this component
const GovernanceForm = ({
  submitForm,
  values,
  setFieldValue,
  errors,
  touched,
  totalSupply,
}: any) => {
  const {
    dispatch,
    state: {
      governanceStep,
      activeStep,
      data: { orgSettings },
    },
  } = useContext(CreatorContext);
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (values) {
      dispatch({
        type: ActionTypes.UPDATE_NAVIGATION_BAR,
        next: {
          text: "CONTINUE",
          handler: () => {
            submitForm(values);
          },
        },
        back: {
          text: "BACK",
          handler: () => history.push(`dao`),
        },
      });
    }
  }, [
    activeStep,
    dispatch,
    errors,
    governanceStep,
    history,
    match.path,
    match.url,
    submitForm,
    values,
  ]);

  return (
    <>
      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Voting Period Duration
        </Typography>
      </SecondContainer>

      <Grid container direction="row" wrap="wrap">
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="votingDays"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">days</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.votingDays && touched.votingDays ? (
            <ErrorText>{errors.votingDays}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="votingHours"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">hours</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.votingHours && touched.votingHours ? (
            <ErrorText>{errors.votingHours}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="votingMinutes"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
      </Grid>

      {errors.votingMinutes && touched.votingMinutes ? (
        <ErrorText>{errors.votingMinutes}</ErrorText>
      ) : null}

      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Proposal Flush Delay Duration
        </Typography>
      </SecondContainer>

      <Grid container direction="row" wrap="wrap">
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalFlushDays"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">days</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposalFlushDays && touched.proposalFlushDays ? (
            <ErrorText>{errors.proposalFlushDays}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalFlushHours"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">hours</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposalFlushHours && touched.proposalFlushHours ? (
            <ErrorText>{errors.proposalFlushHours}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalFlushMinutes"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
      </Grid>

      {errors.proposalFlushMinutes && touched.proposalFlushMinutes ? (
        <ErrorText>{errors.proposalFlushMinutes}</ErrorText>
      ) : null}

      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Proposal time to expire
        </Typography>
      </SecondContainer>

      <Grid container direction="row" wrap="wrap">
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalExpiryDays"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">days</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposalExpiryDays && touched.proposalExpiryDays ? (
            <ErrorText>{errors.proposalExpiryDays}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalExpiryHours"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">hours</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposalExpiryHours && touched.proposalExpiryHours ? (
            <ErrorText>{errors.proposalExpiryHours}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalExpiryMinutes"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
      </Grid>

      {errors.proposalExpiryMinutes && touched.proposalExpiryMinutes ? (
        <ErrorText>{errors.proposalExpiryMinutes}</ErrorText>
      ) : null}

      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Required Stake to Propose
        </Typography>
      </SecondContainer>

      <StakeContainer container direction="row" alignItems="center">
        <AdditionContainer item xs={11} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposeStakeRequired"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, defaultValue: 0 }}
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={6}
              container
              direction="row"
              justify="space-around"
            >
              <Typography color="textSecondary">
                {orgSettings.governanceToken.tokenMetadata?.symbol || ""}
              </Typography>
              <Tooltip
                title={`Amount of $${
                  orgSettings.governanceToken.tokenMetadata?.symbol || ""
                } required to make a proposal. Total supply: ${totalSupply}`}
              >
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {errors.proposeStakeRequired || errors.proposeStakePercentage ? (
          <ErrorText>
            {errors.proposeStakeRequired || errors.proposeStakePercentage}
          </ErrorText>
        ) : null}
      </StakeContainer>

      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Returned Stake After Proposal Rejection
        </Typography>

        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={1}
          style={{ marginTop: 14 }}
        >
          <GridNoPadding item xs={8} sm={9}>
            <Field name="frozenScaleValue">
              {() => (
                <StyledSlider
                  value={getIn(values, "frozenScaleValue")}
                  onChange={(value: any, newValue: any) =>
                    setFieldValue("frozenScaleValue", newValue || 0)
                  }
                />
              )}
            </Field>
          </GridNoPadding>
          <GridNoPadding item xs={4} sm={3}>
            <CustomSliderValue>
              <Value variant="subtitle1" color="textSecondary">
                {getIn(values, "frozenScaleValue")}%
              </Value>
            </CustomSliderValue>
          </GridNoPadding>
        </Grid>
      </SecondContainer>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Transfer Amounts
        </Typography>
      </SpacingContainer>
      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={5}>
              <Field
                name="minXtzAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={7}
              container
              direction="row"
              justify="space-around"
            >
              <ValueText color="textSecondary">Min. XTZ</ValueText>
              <Tooltip title="Minimum amount of XTZ that can be transferred">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.minXtzAmount && touched.minXtzAmount ? (
            <ErrorText>{errors.minXtzAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={5}>
              <Field
                name="maxXtzAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={7}
              container
              direction="row"
              justify="space-around"
            >
              <ValueText color="textSecondary">Max. XTZ </ValueText>
              <Tooltip title="Maximum amount of XTZ that can be transferred">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.maxXtzAmount && touched.maxXtzAmount ? (
            <ErrorText>{errors.maxXtzAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
      </Grid>
      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Quorum Threshold
        </Typography>
      </SpacingContainer>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="quorumTreshold"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
              />
            </GridItemCenter>
            <GridItemCenter
              item
              xs={6}
              container
              direction="row"
              justify="space-around"
            >
              <Tooltip
                title={`Amount of ${
                  orgSettings.governanceToken.tokenMetadata?.symbol || ""
                } required to be locked through voting for a proposal to be passed/rejected. Total supply: ${totalSupply}`}
              >
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {errors.quorumTreshold && touched.quorumTreshold ? (
          <ErrorText>{errors.quorumTreshold}</ErrorText>
        ) : null}
      </Grid>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={5}>
              <Field
                name="minQuorumAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={7}
              container
              direction="row"
              justify="space-around"
            >
              <ValueText color="textSecondary">Min</ValueText>
              <Tooltip title="Quorum min amount">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.minQuorumAmount && touched.minQuorumAmount ? (
            <ErrorText>{errors.minQuorumAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={5}>
              <Field
                name="maxQuorumAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={7}
              container
              direction="row"
              justify="space-around"
            >
              <ValueText color="textSecondary">Max</ValueText>
              <Tooltip title="Quorum max amount">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.maxQuorumAmount && touched.maxQuorumAmount ? (
            <ErrorText>{errors.maxQuorumAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Quorum Change
        </Typography>
      </SpacingContainer>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="quorumChange"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
              />
            </GridItemCenter>
            <GridItemCenter
              item
              xs={6}
              container
              direction="row"
              justify="space-around"
            >
              <Tooltip title="Quorum change">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {errors.quorumChange && touched.quorumChange ? (
          <ErrorText>{errors.quorumChange}</ErrorText>
        ) : null}
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Quorum Max Change
        </Typography>
      </SpacingContainer>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="quorumMaxChange"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
              />
            </GridItemCenter>
            <GridItemCenter
              item
              xs={6}
              container
              direction="row"
              justify="space-around"
            >
              <Tooltip title="Max Quorum Change">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {errors.quorumMaxChange && touched.quorumMaxChange ? (
          <ErrorText>{errors.quorumMaxChange}</ErrorText>
        ) : null}
      </Grid>
    </>
  );
};

//TODO: Remove any from this component
export const Governance: React.FC = () => {
  const { dispatch, state, updateCache } = useContext(CreatorContext);
  const { votingSettings } = state.data;
  const history = useHistory();
  const { totalSupply } = useTotalSupply();

  const saveStepInfo = (
    values: VotingSettings,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    const newState = {
      ...state.data,
      votingSettings: values,
    };
    updateCache(newState);
    setSubmitting(true);
    dispatch({ type: ActionTypes.UPDATE_VOTING_SETTINGS, voting: values });
    history.push(`summary`);
  };

  return (
    <Box maxWidth={620}>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12}>
          <Typography variant="h3" color="textSecondary">
            Proposals & Voting
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1" color="textSecondary">
            These settings will define the duration, support and approval
            required for proposals.
          </CustomTypography>
        </Grid>
      </Grid>

      <Formik
        enableReinitialize
        validate={(values: VotingSettings) =>
          handleGovernanceFormErrors(
            values,
            state.data.template,
            Number(totalSupply)
          )
        }
        onSubmit={saveStepInfo}
        initialValues={votingSettings}
      >
        {({
          submitForm,
          isSubmitting,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          return (
            <Form style={{ width: "100%" }}>
              <GovernanceForm
                validate={(values: VotingSettings) =>
                  handleGovernanceFormErrors(values, state.data.template)
                }
                totalSupply={totalSupply}
                submitForm={submitForm}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                values={values}
              />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
