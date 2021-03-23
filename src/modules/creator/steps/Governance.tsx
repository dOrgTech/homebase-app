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

const LastInput = styled(Grid)({
  marginTop: 14,
  paddingBottom: 37,
});

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
}: any) => {
  const {
    dispatch,
    state: {
      governanceStep,
      activeStep,
      data: { orgSettings, template },
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
      {console.log(JSON.stringify(errors))}
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
                {orgSettings.symbol}
              </Typography>
              <Tooltip
                title={`Amount of ${orgSettings.symbol} required to make a proposal`}
              >
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {(errors.proposeStakeRequired || errors.proposeStakePercentage) ? (
          <ErrorText>{errors.proposeStakeRequired || errors.proposeStakePercentage}</ErrorText>
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

      {template === "treasury" && (
        <>
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
        </>
      )}
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
                inputProps={{ min: 0 }}
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
                {orgSettings.symbol}
              </Typography>
              <Tooltip
                title={`Amount of ${orgSettings.symbol} required to be locked through voting for a proposal to be passed/rejected`}
              >
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.quorumTreshold && touched.quorumTreshold ? (
            <ErrorText>{errors.quorumTreshold}</ErrorText>
          ) : null}
        </AdditionContainer>
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Maximum Proposal Size
        </Typography>
      </SpacingContainer>

      <LastInput container direction="row" alignItems="center">
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="maxProposalSize"
                type="number"
                placeholder="00"
                component={TextField}
                inputProps={{ min: 0 }}
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
                {orgSettings.symbol}
              </Typography>
              <Tooltip title="Maximum proposal size">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.maxProposalSize && touched.maxProposalSize ? (
            <ErrorText>{errors.maxProposalSize}</ErrorText>
          ) : null}
        </AdditionContainer>
      </LastInput>
    </>
  );
};

//@TODO: Remove any from this component
export const Governance: React.FC = () => {
  const { dispatch, state, updateCache } = useContext(CreatorContext);
  const { votingSettings } = state.data;
  const history = useHistory();

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
    history.push(`token`);
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
          handleGovernanceFormErrors(values, state.data.template)
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
