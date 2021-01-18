import {
  Grid,
  styled,
  Typography,
  withStyles,
  InputAdornment,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useMemo, useState } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store";
import { saveDaoInformation } from "../../store/dao-info/action";
import { Field, FieldArray, Form, Formik } from "formik";
import { TextField as FormikTextField } from "formik-material-ui";
import { TokenHolders } from "../../store/dao-info/types";

interface Values {
  max_agent: number | undefined;
  administrator: string | undefined;
  token_holders: Array<TokenHolders>;
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
  fontSize: 10,
  color: "red",
  marginTop: 10,
});

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
  padding: "11px 21px",
  boxSizing: "border-box",
});

const CustomValueContainer = styled(Typography)({
  padding: "11px 21px",
  boxSizing: "border-box",
  fontWeight: 700,
});

const AddButon = styled("button")({
  background: "inherit",
  border: "none",
  outline: "none",
  marginTop: 8,
  textAlign: "end",
  width: "100%",
  cursor: "pointer",
  textDecoration: "underline",
});

const TokenHoldersGrid = styled(Grid)({
  height: 269,
  overflowX: "scroll",
});

const TokenSettingsForm = ({
  values,
  defineSubmit,
  submitForm,
  setFieldValue,
  touched,
  errors,
}: any) => {
  useMemo(() => {
    defineSubmit(() => submitForm);
  }, [values]);

  const getTotal = () => {
    let total = 0;
    values.token_holders.forEach((holder: any) => {
      total += holder.balance;
      return;
    });
    return total;
  };
  return (
    <>
      <TokenHoldersGrid container direction="row">
        <Grid item xs={9}>
          <Typography variant="subtitle1"> Token holder </Typography>

          <FieldArray
            name="token_holders"
            render={(arrayHelpers) => (
              <>
                {values.token_holders && values.token_holders.length > 0
                  ? values.token_holders.map((holder: any, index: any) => (
                      <div key={index}>
                        {/* <Typography variant="subtitle1"> Token holder </Typography> */}
                        <CustomInputContainer>
                          <Field
                            type="text"
                            component={CustomFormikTextField}
                            placeholder="0xf8s8d...."
                            name={`token_holders.${index}.token_holder`}
                          />
                          {errors.token_holders &&
                          errors.token_holders[index] &&
                          touched.token_holders[index] ? (
                            <ErrorText>{errors.token_holders[index]}</ErrorText>
                          ) : null}
                        </CustomInputContainer>
                      </div>
                    ))
                  : null}
              </>
            )}
          />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="subtitle1"> Balance </Typography>

          <FieldArray
            name="token_holders"
            render={(arrayHelpers) => (
              <>
                {values.token_holders && values.token_holders.length > 0
                  ? values.token_holders.map((holder: any, index: any) => (
                      <div key={index}>
                        <CustomBalanceContainer>
                          <Field
                            type="number"
                            component={CustomFormikTextField}
                            placeholder="0.00"
                            name={`token_holders.${index}.balance`}
                          />
                        </CustomBalanceContainer>
                        {index + 1 === values.token_holders.length ? (
                          <AddButon
                            className="button"
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(index + 1, {
                                token_holder: "",
                                balance: 0,
                              })
                            }
                          >
                            {" "}
                            Add new row
                          </AddButon>
                        ) : null}
                      </div>
                    ))
                  : null}
              </>
            )}
          />
        </Grid>
      </TokenHoldersGrid>

      <Grid container direction="row">
        <Grid item xs={9}>
          <CustomTotalContainer variant="subtitle1">
            {" "}
            Total{" "}
          </CustomTotalContainer>
        </Grid>
        <Grid item xs={3}>
          <CustomValueContainer>{getTotal()}</CustomValueContainer>
        </Grid>
      </Grid>

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
    setSubmitting(true);
    dispatch(saveDaoInformation(values));
    setActiveStep(1);
    setGovernanceStep(2);
  };

  const validate = (values: Values) => {
    const errors: any = {};

    if (!values.administrator) {
      errors.administrator = "Required";
    }

    if (!values.max_agent) {
      errors.max_agent = "Required";
    }

    if (values.token_holders && values.token_holders.length > 0) {
      values.token_holders.map((holder: any, index: any) => {
        if (!holder.token_holder || !holder.balance) {
          errors.token_holders = [];
          return (errors.token_holders[index] = "All fields are required");
        }
      });
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
          <Typography variant="h2">Distribution Settings</Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1">
            These settings will define the name, symbol, and initial
            distribution of your token.
          </CustomTypography>
        </Grid>
      </Grid>
      <Formik
        enableReinitialize={true}
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
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
