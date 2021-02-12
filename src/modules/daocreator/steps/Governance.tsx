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
import { ActionTypes } from "../state/types";
import { handleGovernanceFormErrors } from "../utils";
import { VotingSettings } from "../../../services/contracts/baseDAO/types";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

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
              ></Field>
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

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
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
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">
                {orgSettings.symbol}
              </Typography>
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
            <GridItemCenter item>
              <Field
                name="proposeStakePercentage"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposeStakePercentage && touched.proposeStakePercentage ? (
            <ErrorText>{errors.proposeStakePercentage}</ErrorText>
          ) : null}
        </AdditionContainer>
        <Grid item xs={5}>
          <Grid item container>
            <Title variant="subtitle1" color="textSecondary">
              * Proposal size
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
          Returned Stake After Proposal Rejection
        </Typography>

        <Grid container direction="row" alignItems="center" spacing={1}>
          <GridNoPadding item xs={8}>
            <Field name="frozenScaleValue">
              {() => (
                <StyledSlider
                  value={getIn(values, "frozenScaleValue")}
                  onChange={(value: any, newValue: any) =>
                    setFieldValue("frozenScaleValue", newValue)
                  }
                />
              )}
            </Field>
          </GridNoPadding>
          <GridNoPadding item xs={4}>
            <CustomSliderValue>
              <Value variant="subtitle1" color="textSecondary">
                {getIn(values, "frozenScaleValue")}% of Frozen{" "}
                {orgSettings.symbol}
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
        <AdditionContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="minXtzAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">Min. XTZ</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.minXtzAmount && touched.minXtzAmount ? (
            <ErrorText>{errors.minXtzAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
        <AdditionContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <Field
                name="maxXtzAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">Max. XTZ </Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.maxXtzAmount && touched.maxXtzAmount ? (
            <ErrorText>{errors.maxXtzAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Quorum Treshold
        </Typography>
      </SpacingContainer>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={4}>
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
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">
                {orgSettings.symbol}
              </Typography>
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
        <AdditionContainer item xs={4}>
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
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">
                {orgSettings.symbol}
              </Typography>
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
  const match = useRouteMatch();

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
        validate={(values: VotingSettings) =>
          handleGovernanceFormErrors(values)
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
          console.log(errors);
          return (
            <Form style={{ width: "100%" }}>
              <GovernanceForm
                validate={(values: VotingSettings) =>
                  handleGovernanceFormErrors(values)
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
