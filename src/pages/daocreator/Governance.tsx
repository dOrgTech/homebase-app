import {
  Grid,
  Paper,
  styled,
  Typography,
  Slider,
  withStyles,
  withTheme,
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
  propose_stake_mygt: number | undefined;
  propose_stake_percentage: number | undefined;
  vote_stake_mygt: number | undefined;
  vote_stake_percentage: number | undefined;
}

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

const GridNoPadding = styled(Grid)({
  padding: "0px !important",
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
                name="proposal_days"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">days</Typography>
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
              <Typography color="textSecondary">hours</Typography>
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
              <Typography color="textSecondary">minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.proposal_minutes && touched.proposal_minutes ? (
            <ErrorText>{errors.proposal_minutes}</ErrorText>
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
                name="voting_days"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">days</Typography>
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
              <Typography color="textSecondary">hours</Typography>
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
              <Typography color="textSecondary">minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.voting_minutes && touched.voting_minutes ? (
            <ErrorText>{errors.voting_minutes}</ErrorText>
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
                name="propose_stake_mygt"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">MYGT</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.propose_stake_mygt && touched.propose_stake_mygt ? (
            <ErrorText>{errors.propose_stake_mygt}</ErrorText>
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
                name="propose_stake_percentage"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={2}>
              <Typography color="textSecondary">%</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.propose_stake_percentage &&
          touched.propose_stake_percentage ? (
            <ErrorText>{errors.propose_stake_percentage}</ErrorText>
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
                name="vote_stake_mygt"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography color="textSecondary">MYGT</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.vote_stake_mygt && touched.vote_stake_mygt ? (
            <ErrorText>{errors.vote_stake_mygt}</ErrorText>
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
                name="vote_stake_percentage"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>{" "}
            </GridItemCenter>
            <GridItemCenter item xs={2}>
              <Typography color="textSecondary">%</Typography>
            </GridItemCenter>
          </ItemContainer>
          {errors.vote_stake_percentage && touched.vote_stake_percentage ? (
            <ErrorText>{errors.vote_stake_percentage}</ErrorText>
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

      <Grid container direction="row" alignItems="center" spacing={1}>
        <GridNoPadding item xs={10}>
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
        </GridNoPadding>
        <GridNoPadding item xs={2}>
          <CustomSliderValue>
            <Value variant="subtitle1" color="textSecondary">
              {getIn(values, "min_stake")}%
            </Value>
          </CustomSliderValue>
        </GridNoPadding>
      </Grid>
    </>
  );
};

export const Governance: React.FC<{
  defineSubmit: any;
  setActiveStep: any;
  setGovernanceStep: any;
  setProgress: any;
}> = ({ defineSubmit, setActiveStep, setGovernanceStep, setProgress }) => {
  const storageDaoInformation = useSelector<
    AppState,
    AppState["saveDaoInformationReducer"]
  >((state) => state.saveDaoInformationReducer);

  const dispatch = useDispatch();

  setProgress(25);

  const saveStepInfo = (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    dispatch(saveDaoInformation(values));
    setActiveStep(1);
    setGovernanceStep(1);
  };

  const validate = (values: Values) => {
    const errors: any = {};

    if (values.proposal_days === undefined || !String(values.proposal_days)) {
      errors.proposal_days = "Required";
    }
    if (
      values.proposal_minutes === undefined ||
      !String(values.proposal_minutes)
    ) {
      errors.proposal_minutes = "Required";
    }
    if (values.proposal_hours === undefined || !String(values.proposal_hours)) {
      errors.proposal_hours = "Required";
    }
    if (values.voting_days === undefined || !String(values.voting_days)) {
      errors.voting_days = "Required";
    }
    if (values.voting_hours === undefined || !String(values.voting_hours)) {
      errors.voting_hours = "Required";
    }
    if (values.voting_minutes === undefined || !String(values.voting_minutes)) {
      errors.voting_minutes = "Required";
    }
    if (
      values.propose_stake_mygt === undefined ||
      !String(values.propose_stake_mygt)
    ) {
      errors.propose_stake_mygt = "Required";
    }
    if (
      values.propose_stake_percentage === undefined ||
      !String(values.propose_stake_percentage)
    ) {
      errors.propose_stake_percentage = "Required";
    }
    if (
      values.vote_stake_mygt === undefined ||
      !String(values.vote_stake_mygt)
    ) {
      errors.vote_stake_mygt = "Required";
    }
    if (
      values.vote_stake_percentage === undefined ||
      !String(values.vote_stake_percentage)
    ) {
      errors.vote_stake_percentage = "Required";
    }

    return errors;
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
