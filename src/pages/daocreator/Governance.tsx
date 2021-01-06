import {
  Grid,
  Link,
  Paper,
  styled,
  Typography,
  Slider,
  withStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Input from "@material-ui/core/Input";
import { Field, Form, Formik, FormikProps } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { TextField } from "formik-material-ui";
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
}

const CustomTypography = styled(Typography)({
  paddingBottom: 10,
  borderBottom: "1px solid #E4E4E4",
  marginTop: 10,
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

const CustomInput = styled(Input)({
  fontSize: 21,
  color: "rgba(0, 0, 0, 0.5)",
  fontWeight: 300,
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

const GovernanceForm = ({
  submitForm,
  values,
  defineSubmit,
  stake,
  setSupport,
  support,
  setStake,
}: any) => {
  useEffect(() => {
    defineSubmit(submitForm);
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
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>hours</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
      </Grid>

      <SecondContainer container direction="row">
        <Typography variant="subtitle1">Voting Period Duration</Typography>
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
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>days</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>hours</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
        <CustomInputContainer item xs={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={6}>
              <CustomInput type="number" placeholder="00" />
            </GridItemCenter>
            <GridItemCenter item xs={6}>
              <Typography>minutes</Typography>
            </GridItemCenter>
          </ItemContainer>
        </CustomInputContainer>
      </Grid>

      {/* <SecondContainer container direction="row" alignItems="center">
      <Switch
        name="checkedA"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
      <Typography variant="subtitle1">
        Requires an
        <CustomLink href="#" onClick={preventDefault}>
          {" "}
          Agora
        </CustomLink>{" "}
        Link to submit a proposal
      </Typography>
    </SecondContainer> */}

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1">Minimum Stake </Typography>
        <Title variant="subtitle2">(% of proposal value)</Title>
      </SpacingContainer>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <StyledSlider
            value={stake}
            onChange={(value: any, newValue: any) => setStake(newValue)}
          />
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">{stake}%</Value>
          </CustomSliderValue>
        </Grid>
      </Grid>

      <Grid direction="row" container alignItems="center">
        <Typography variant="subtitle1">
          Stake returned when rejected
        </Typography>
      </Grid>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <StyledSlider
            value={support}
            onChange={(value: any, newValue: any) => setSupport(newValue)}
          />
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">{support}%</Value>
          </CustomSliderValue>
        </Grid>
      </Grid>

      <Grid direction="row" container alignItems="center">
        <Typography variant="subtitle1">Minimum Support</Typography>
      </Grid>

      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item xs={11}>
          <StyledSlider
            value={support}
            onChange={(value: any, newValue: any) => setSupport(newValue)}
          />
        </Grid>
        <Grid item xs={1}>
          <CustomSliderValue>
            <Value variant="subtitle1">{support}%</Value>
          </CustomSliderValue>
        </Grid>
      </Grid>
    </>
  );
};

export const Governance: React.FC<{ defineSubmit: any }> = ({
  defineSubmit,
}) => {
  const [stake, setStake] = useState(0);
  const [support, setSupport] = useState(0);

  const storageDaoInformation = useSelector<
    AppState,
    AppState["saveDaoInformationReducer"]
  >((state) => state.saveDaoInformationReducer);

  const dispatch = useDispatch();

  const h = (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    dispatch(saveDaoInformation(values));
    console.log(values);
  };

  const validate = (values: Values) => {
    const errors: any = {};

    return errors;
  };
  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12}>
          <Typography variant="h1">Proposals & Voting</Typography>
          {console.log(storageDaoInformation)}
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
        onSubmit={h}
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
                stake={stake}
                support={support}
                setStake={setStake}
                setSupport={setSupport}
                submitForm={submitForm}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                values={values}
                handleBlur={handleBlur}
                validateOnChange={validateOnChange}
                setFieldTouched={setFieldTouched}
                handleChange={handleChange}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
