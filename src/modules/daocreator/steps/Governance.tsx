import {
  Grid,
  Paper,
  styled,
  Typography,
  Slider,
  withStyles,
  withTheme,
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import React, { useContext, useEffect } from "react";
import { Field, Form, Formik, getIn } from "formik";

import { CreatorContext } from "../state/context";
import { ActionTypes, VotingSettings } from "../state/types";
import { handleErrorMessages } from "../utils";

const CustomTypography = styled(Typography)({
  paddingBottom: 10,
  borderBottom: "1px solid #3D3D3D",
  marginTop: 10,
  marginBottom: 33,
});

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
});

const SecondContainer = styled(Grid)({
  marginTop: 10,
});

const SpacingContainer = styled(Grid)({
  marginTop: 25,
});

const CustomInputContainer = styled(Grid)({
  border: "1px solid #3D3D3D",
  height: 62,
  marginTop: 14,
  "&:first-child": {
    borderRight: "none",
  },
  "&:last-child": {
    borderLeft: "none",
  },
});

const AdditionContainer = styled(Grid)({
  border: "1px solid #3D3D3D",
  height: 62,
  marginTop: 14,
});

const GridItemCenter = styled(Grid)({
  textAlign: "center",
});

const ItemContainer = styled(Grid)({
  height: "100%",
  padding: 12,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
  },
});

const Title = styled(Typography)({
  marginLeft: 10,
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
  border: "1px solid #3D3D3D",
  borderRadius: 0,
  background: props.theme.palette.primary.main,
}));

const Value = styled(Typography)({
  textAlign: "center",
  padding: "15%",
});

const LastElement = styled(Grid)({
  marginBottom: 37,
});

const styles = {
  voting: {
    marginTop: 6,
  },
};

const GridNoPadding = styled(Grid)({
  padding: "0px !important",
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
    state: { governanceStep, activeStep },
  } = useContext(CreatorContext);

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
          handler: () =>
            dispatch({
              type: ActionTypes.UPDATE_GOVERNANCE_STEP,
              step: governanceStep - 1,
            }),
        },
      });
    }
  }, [activeStep, dispatch, errors, governanceStep, submitForm, values]);

  return (
    <>
      <SecondContainer container direction="row">
        <Typography variant="subtitle1" color="textSecondary">
          Proposal Period Duration
        </Typography>
      </SecondContainer>

      <Grid container direction="row">
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                color="textSecondary"
                name="proposalDays"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">days</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposalDays && touched.proposalDays ? (
            <ErrorText>{errors.proposalDays}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalHours"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">hours</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposalHours && touched.proposalHours ? (
            <ErrorText>{errors.proposalHours}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="proposalMinutes"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposalMinutes && touched.proposalMinutes ? (
            <ErrorText>{errors.proposalMinutes}</ErrorText>
          ) : null}
        </CustomInputContainer>
      </Grid>

      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Voting Period Duration
        </Typography>
      </SecondContainer>

      <Grid container direction="row">
        <CustomInputContainer item xs={4}>
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
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">days</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.votingDays && touched.votingDays ? (
            <ErrorText>{errors.votingDays}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
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
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">hours</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.votingHours && touched.votingHours ? (
            <ErrorText>{errors.votingHours}</ErrorText>
          ) : null}
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
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
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.votingMinutes && touched.votingMinutes ? (
            <ErrorText>{errors.votingMinutes}</ErrorText>
          ) : null}
        </CustomInputContainer>
      </Grid>

      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Required Stake to Propose
        </Typography>
      </SecondContainer>

      <Grid container direction="row" alignItems="center">
        <AdditionContainer item xs={3}>
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
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">MYGT</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposeStakeRequired && touched.proposeStakeRequired ? (
            <ErrorText>{errors.proposeStakeRequired}</ErrorText>
          ) : null}
        </AdditionContainer>
        <Grid item xs={1}>
          <Grid item container justify="center">
            <Typography variant="subtitle1" color="textSecondary">
              +
            </Typography>
          </Grid>
        </Grid>
        <AdditionContainer item xs={2}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={9}>
              <Field
                name="proposeStakePercentage"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={2}>
              <Typography color="textSecondary">%</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposeStakePercentage && touched.proposeStakePercentage ? (
            <ErrorText>{errors.proposeStakePercentage}</ErrorText>
          ) : null}
        </AdditionContainer>
        <Grid item xs={3}>
          <Grid item container>
            <Title variant="subtitle1" color="textSecondary">
              of Proposal Value
            </Title>
          </Grid>
        </Grid>
      </Grid>

      <SecondContainer container direction="row">
        <Typography
          style={styles.voting}
          variant="subtitle1"
          color="textSecondary"
        >
          Required Stake to Vote
        </Typography>
      </SecondContainer>

      <Grid container direction="row" alignItems="center">
        <AdditionContainer item xs={3}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="voteStakeRequired"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">MYGT</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.voteStakeRequired && touched.voteStakeRequired ? (
            <ErrorText>{errors.voteStakeRequired}</ErrorText>
          ) : null}
        </AdditionContainer>
        <Grid item xs={1}>
          <Grid item container justify="center">
            <Typography variant="subtitle1" color="textSecondary">
              +
            </Typography>
          </Grid>
        </Grid>
        <AdditionContainer item xs={2}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={9}>
              <Field
                name="voteStakePercentage"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={2}>
              <Typography color="textSecondary">%</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.voteStakePercentage && touched.voteStakePercentage ? (
            <ErrorText>{errors.voteStakePercentage}</ErrorText>
          ) : null}
        </AdditionContainer>
        <Grid item xs={3}>
          <Grid item container>
            <Title variant="subtitle1" color="textSecondary">
              of Proposal Value
            </Title>
          </Grid>
        </Grid>
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Minimum Stake{" "}
        </Typography>
        <Title variant="subtitle2" color="textSecondary">
          (% of proposal value)
        </Title>
      </SpacingContainer>

      <LastElement container direction="row" alignItems="center" spacing={1}>
        <GridNoPadding item xs={10}>
          <Field name="minStake">
            {() => (
              <StyledSlider
                value={getIn(values, "minStake")}
                onChange={(value: any, newValue: any) =>
                  setFieldValue("minStake", newValue)
                }
              />
            )}
          </Field>
        </GridNoPadding>
        <GridNoPadding item xs={2}>
          <CustomSliderValue>
            <Value variant="subtitle1" color="textSecondary">
              {getIn(values, "minStake")}%
            </Value>
          </CustomSliderValue>
        </GridNoPadding>
      </LastElement>
    </>
  );
};

//@TODO: Remove any from this component
export const Governance: React.FC = () => {
  const { dispatch, state } = useContext(CreatorContext);
  const { activeStep } = state;
  const { votingSettings } = state.data;

  const saveStepInfo = (values: VotingSettings, { setSubmitting }: any) => {
    console.log("saving");
    setSubmitting(true);
    dispatch({ type: ActionTypes.UPDATE_VOTING_SETTINGS, voting: values });
    dispatch({ type: ActionTypes.UPDATE_STEP, step: activeStep + 1 });
  };

  return (
    <>
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
        validate={(values: VotingSettings) => handleErrorMessages(values)}
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
          console.log(errors)
          return (
            <Form style={{ width: "100%" }}>
              <GovernanceForm
                validate={(values: VotingSettings) =>
                  handleErrorMessages(values)
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
    </>
  );
};
