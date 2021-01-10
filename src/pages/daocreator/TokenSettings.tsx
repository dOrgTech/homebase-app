import {
  Grid,
  Paper,
  styled,
  Typography,
  withStyles,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import React, { useMemo, useState } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store";
import { saveDaoInformation } from "../../store/dao-info/action";
import { Field, Form, Formik } from "formik";
import { TextField as FormikTextField } from "formik-material-ui";

interface Values {
  max_agent: number | undefined;
  administrator: string | undefined;
}

const CustomTypography = styled(Typography)({
  paddingBottom: 21,
  borderBottom: "1px solid #E4E4E4",
  marginTop: 10,
});

const SecondContainer = styled(Grid)({
  marginTop: 25,
});

const CustomInputContainer = styled(Grid)({
  border: "1px solid #E4E4E4",
  height: 62,
  marginTop: 14,
  padding: "18px 21px",
  boxSizing: "border-box",
});

const CustomBalanceContainer = styled(Grid)({
  border: "1px solid #E4E4E4",
  height: 62,
  marginTop: 14,
  borderLeft: "none",
  padding: "18px 21px",
  boxSizing: "border-box",
});

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
});

const CustomTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial",
    },
    "& .MuiInputBase-input": {
      textAlign: "initial",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important",
    },
  },
})(TextField);

const CustomFormikTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial",
    },
    "& .MuiInputBase-input": {
      textAlign: "initial",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important",
    },
  },
})(FormikTextField);

const CustomTotalContainer = styled(Typography)({
  padding: "29px 21px",
  boxSizing: "border-box",
});

const CustomValueContainer = styled(Typography)({
  padding: "29px 21px",
  boxSizing: "border-box",
  fontWeight: 700,
});

const TokenSettingsForm = ({
  values,
  defineSubmit,
  submitForm,
  setFieldValue,
  setBalanceAccountTwo,
  setBalanceAccountOne,
  balanceAccountOne,
  balanceAccountTwo,
  getTotalBalance,
  touched,
  errors,
}: any) => {
  useMemo(() => {
    defineSubmit(() => submitForm);
  }, [values]);

  return (
    <>
      <SecondContainer item container direction="row">
        <Grid item xs={9}>
          <Typography variant="subtitle1"> Token holder </Typography>
          <CustomInputContainer>
            <CustomTextField type="text" placeholder="0xf8s8d...." />
          </CustomInputContainer>
          <CustomInputContainer>
            <CustomTextField type="text" placeholder="0xf8s8d...." />
          </CustomInputContainer>

          <CustomTotalContainer variant="subtitle1">
            {" "}
            Total{" "}
          </CustomTotalContainer>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1"> Balance </Typography>
          <CustomBalanceContainer>
            <CustomTextField
              type="number"
              placeholder="0.00"
              value={balanceAccountOne}
              onChange={(e: any) => setBalanceAccountOne(e.target.value)}
            />
          </CustomBalanceContainer>
          <CustomBalanceContainer>
            <CustomTextField
              type="number"
              placeholder="0.00"
              value={balanceAccountTwo}
              onChange={(e: any) => setBalanceAccountTwo(e.target.value)}
            />
          </CustomBalanceContainer>

          <CustomValueContainer variant="subtitle1">
            {" "}
            {getTotalBalance()}{" "}
          </CustomValueContainer>
        </Grid>
      </SecondContainer>

      <SecondContainer item container direction="row" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {" "}
            Maximum Agent Spend Per Cycle{" "}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <CustomInputContainer>
            <Field
              component={CustomFormikTextField}
              type="number"
              name="max_agent"
              placeholder="00"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">TKN</InputAdornment>
                ),
              }}
            />
          </CustomInputContainer>
          {errors.max_agent && touched.max_agent ? (
            <ErrorText>{errors.max_agent}</ErrorText>
          ) : null}
        </Grid>

        <Grid item xs={6}>
          <Grid container direction="row" justify="flex-end">
            <InfoOutlinedIcon></InfoOutlinedIcon>
          </Grid>
        </Grid>
      </SecondContainer>

      <SecondContainer item container direction="row" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="subtitle1"> Administrator </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomInputContainer>
            <Field
              name="administrator"
              type="text"
              placeholder="0xf8s8d...."
              component={CustomFormikTextField}
            ></Field>
          </CustomInputContainer>
          {errors.administrator && touched.administrator ? (
            <ErrorText>{errors.administrator}</ErrorText>
          ) : null}
        </Grid>
      </SecondContainer>
    </>
  );
};

export const TokenSettings: React.FC<{
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
    console.log(values);
    setSubmitting(true);
    dispatch(saveDaoInformation(values));
    setActiveStep(1);
    setGovernanceStep(2);
  };

  const [balanceAccountOne, setBalanceAccountOne] = useState(undefined);
  const [balanceAccountTwo, setBalanceAccountTwo] = useState(undefined);

  const getTotalBalance = () => {
    if (balanceAccountOne && !balanceAccountTwo) {
      return (Number(balanceAccountOne) + Number(0)).toFixed(2);
    } else if (!balanceAccountOne && balanceAccountTwo) {
      return (Number(balanceAccountTwo) + Number(0)).toFixed(2);
    } else if (balanceAccountOne && balanceAccountTwo) {
      return (Number(balanceAccountTwo) + Number(balanceAccountOne)).toFixed(2);
    } else {
      return "0.00";
    }
  };

  const validate = (values: Values) => {
    console.log(values);
    const errors: any = {};

    if (!values.administrator) {
      errors.administrator = "Required";
    }

    if (!values.max_agent) {
      errors.max_agent = "Required";
    }

    return errors;
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
          <Typography variant="h1">Distribution Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1">
            These settings will define the name, symbol, and initial
            distribution of your token.
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
        }) => {
          return (
            <Form style={{ width: "100%" }}>
              <TokenSettingsForm
                defineSubmit={defineSubmit}
                validate={validate}
                submitForm={submitForm}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                values={values}
                balanceAccountOne={balanceAccountOne}
                balanceAccountTwo={balanceAccountTwo}
                setBalanceAccountOne={setBalanceAccountOne}
                setBalanceAccountTwo={setBalanceAccountTwo}
                getTotalBalance={getTotalBalance}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
