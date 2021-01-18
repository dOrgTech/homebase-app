import {
  Grid,
  Paper,
  styled,
  Typography,
  Slider,
  withStyles,
} from "@material-ui/core";
import React, { useMemo } from "react";
import Input from "@material-ui/core/Input";
import { Field, Form, Formik, getIn } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { TextField, Switch as FormikSwitch } from "formik-material-ui";
import { saveDaoInformation } from "../../store/dao-info/action";

interface Values {
  proposal_days: number | undefined;
  proposal_hours: number | undefined;
  proposal_minutes: number | undefined;
  voting_days: number | undefined;
  voting_hours: number | undefined;
  voting_minutes: number | undefined;
  min_stake: number | undefined;
  min_support: number | undefined;
  stake_returned: number | undefined;
  min_stake_percentage: boolean;
  stake_returned_percentage: boolean;
}

const CustomTypography = styled(Typography)({
  paddingBottom: 10,
  borderBottom: "1px solid #E4E4E4",
  marginTop: 10,
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
  border: "1px solid #E4E4E4",
  height: 62,
  marginTop: 14,
  "&:first-child": {
    borderRight: "none",
  },
  "&:last-child": {
    borderLeft: "none",
  },
});

const GridItemCenter = styled(Grid)({
  textAlign: "center",
});

const ItemContainer = styled(Grid)({
  height: "100%",
  padding: 12,
});

const Title = styled(Typography)({
  marginLeft: 10,
});

const StyledSlider = withStyles({
  root: {
    textAlign: "center",
    width: "95%",
  },
  valueLabel: {
    textAlign: "center",
  },
  thumb: {
    height: 28,
    width: 28,
    top: "15.5%",
    backgroundColor: "#000000",
    border: "2px solid #000000",
  },
  track: {
    backgroundColor: "#3866F9",
    borderRadius: "4px",
    height: 2,
  },
})(Slider);

const CustomSliderValue = styled(Paper)({
  boxShadow: "none",
  height: 62,
  border: "1px solid #000000",
  borderRadius: 0,
});

const Value = styled(Typography)({
  textAlign: "center",
  padding: "30%",
});

const styles = {
  voting: {
    marginTop: 6,
  },
};

const SwitchContainer = styled("div")({
  position: "absolute",
  right: "5%",
  textAlign: "center",
});

const GovernanceForm = ({
  submitForm,
  values,
  defineSubmit,
  setFieldValue,
  errors,
  touched,
}: any) => {
  useMemo(() => {
    defineSubmit(() => submitForm);
  }, [values]);

  return (
    <>
      <SecondContainer container direction="row">
        <Typography variant="subtitle1">Proposal Period Duration</Typography>
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
                name="proposal_days"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>days</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposal_days && touched.proposal_days ? (
            <ErrorText>{errors.proposal_days}</ErrorText>
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
                name="proposal_hours"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>hours</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposal_hours && touched.proposal_hours ? (
            <ErrorText>{errors.proposal_hours}</ErrorText>
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
                name="proposal_minutes"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposal_minutes && touched.proposal_minutes ? (
            <ErrorText>{errors.proposal_minutes}</ErrorText>
          ) : null}
        </CustomInputContainer>
      </Grid>

      <SecondContainer container direction="row">
        <Typography style={styles.voting} variant="subtitle1">
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
                name="voting_days"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>days</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.voting_days && touched.voting_days ? (
            <ErrorText>{errors.voting_days}</ErrorText>
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
                name="voting_hours"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>hours</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.voting_hours && touched.voting_hours ? (
            <ErrorText>{errors.voting_hours}</ErrorText>
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
                name="voting_minutes"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.voting_minutes && touched.voting_minutes ? (
            <ErrorText>{errors.voting_minutes}</ErrorText>
          ) : null}
        </CustomInputContainer>
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1">Minimum Stake </Typography>
        <Title variant="subtitle2">(% of proposal value)</Title>
      </SpacingContainer>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <Field name="min_stake">
            {({ field, form: { touched, errors }, meta }: any) => (
              <StyledSlider
                value={getIn(values, "min_stake")}
                onChange={(value: any, newValue: any) =>
                  setFieldValue("min_stake", newValue)
                }
              />
            )}
          </Field>
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">
              {getIn(values, "min_stake")}
              {values.min_stake_percentage ? "%" : null}
            </Value>
          </CustomSliderValue>
        </Grid>
        <SwitchContainer>
          <Typography>{values.min_stake_percentage ? "0.0%" : "0"}</Typography>
          <Field
            name="min_stake_percentage"
            component={FormikSwitch}
            type="checkbox"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </SwitchContainer>
      </Grid>

      <Grid direction="row" container alignItems="center">
        <Typography variant="subtitle1">
          Stake returned when rejected
        </Typography>
      </Grid>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <Field name="stake_returned">
            {({ form: { touched, errors }, meta }: any) => (
              <StyledSlider
                value={getIn(values, "stake_returned")}
                onChange={(value: any, newValue: any) =>
                  setFieldValue("stake_returned", newValue)
                }
              />
            )}
          </Field>
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">
              {getIn(values, "stake_returned")}
              {values.stake_returned_percentage ? "%" : null}
            </Value>
          </CustomSliderValue>
        </Grid>
        <SwitchContainer>
          <Typography>
            {values.stake_returned_percentage ? "0.0%" : "0"}
          </Typography>
          <Field
            name="stake_returned_percentage"
            component={FormikSwitch}
            type="checkbox"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </SwitchContainer>
      </Grid>

      <Grid direction="row" container alignItems="center">
        <Typography variant="subtitle1">Minimum Support</Typography>
      </Grid>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <Field name="min_support">
            {({ field, form: { touched, errors }, meta }: any) => (
              <StyledSlider
                value={getIn(values, "min_support")}
                onChange={(value: any, newValue: any) =>
                  setFieldValue("min_support", newValue)
                }
              />
            )}
          </Field>
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">{getIn(values, "min_support")}%</Value>
          </CustomSliderValue>
        </Grid>
      </Grid>
    </>
  );
};

export const Governance: React.FC<{
  defineSubmit: any;
  setActiveStep: any;
  setGovernanceStep: any;
}> = ({ defineSubmit, setActiveStep, setGovernanceStep }) => {
  const storageDaoInformation = useSelector<
    AppState,
    AppState["saveDaoInformationReducer"]
  >((state) => state.saveDaoInformationReducer);

  const dispatch = useDispatch();

  const saveStepInfo = (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    dispatch(saveDaoInformation(values));
    setActiveStep(1);
    setGovernanceStep(1);
  };

  const validate = (values: Values) => {
    const errors: any = {};

    if (!values.proposal_days) {
      errors.proposal_days = "Required";
    }
    if (!values.proposal_minutes) {
      errors.proposal_minutes = "Required";
    }
    if (!values.proposal_hours) {
      errors.proposal_hours = "Required";
    }
    if (!values.voting_days) {
      errors.voting_days = "Required";
    }
    if (!values.voting_hours) {
      errors.voting_hours = "Required";
    }
    if (!values.voting_minutes) {
      errors.voting_minutes = "Required";
    }

    return errors;
  };

  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12}>
          <Typography variant="h2">Proposals & Voting</Typography>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1">
            These settings will define the duration, support and approval
            required for proposals.
          </CustomTypography>
        </Grid>
      </Grid>

      <Formik
        enableReinitialize
        validate={validate}
        onSubmit={saveStepInfo}
        initialValues={storageDaoInformation}
      >
        {({
          submitForm,
          isSubmitting,
          setFieldValue,
          values,
          errors,
          touched,
          handleBlur,
          validateOnChange,
          setFieldTouched,
          handleChange,
        }) => {
          return (
            <Form style={{ width: "100%" }}>
              <GovernanceForm
                defineSubmit={defineSubmit}
                validate={validate}
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
