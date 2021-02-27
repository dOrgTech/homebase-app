import { Grid, styled, Typography, withStyles, Box } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import { TextField as FormikTextField } from "formik-material-ui";
import { useHistory, useRouteMatch } from "react-router";

import {
  CreatorContext,
  ActionTypes,
  TokenHolder,
} from "modules/creator/state";
import { MemberSettings } from "services/contracts/baseDAO/types";

const CustomTypography = styled(Typography)({
  paddingBottom: 10,
  borderBottom: "1px solid #3D3D3D",
  marginTop: 10,
  marginBottom: 39,
});

const SecondContainer = styled(Grid)({
  marginTop: 25,
});

const CustomInputContainer = styled(Grid)({
  border: "1px solid #3D3D3D",
  height: 62,
  marginTop: 14,
  padding: "18px 21px",
  boxSizing: "border-box",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
  },
});

const CustomBalanceContainer = styled(Grid)(({ theme }) => ({
  border: "1px solid #3D3D3D",
  height: 62,
  marginTop: 14,
  borderLeft: "none",
  padding: "18px 21px",
  boxSizing: "border-box",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
  },

  [theme.breakpoints.down("sm")]: {
    padding: "18px 8px",
  },
}));

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
  color: "#fff",
});

const RemoveButton = styled("button")({
  background: "inherit",
  border: "none",
  height: "100%",
  outline: "none",
  marginTop: 8,
  textAlign: "center",
  width: "100%",
  cursor: "pointer",
  textDecoration: "underline",
  color: "#fff",
});

const TokenHoldersGrid = styled(Grid)({
  maxHeight: 269,
  overflowY: "auto",
});

const Total = ({ values }: { values: MemberSettings }) => {
  const totalTokens = values.tokenHolders.reduce(
    (a: number, b: TokenHolder) => a + b.balance,
    0
  );
  return <div>{isNaN(totalTokens) ? "0" : totalTokens}</div>;
};

const validate = () =>
  // values: MemberSettings
  {
    // const handleLedgerValidation = (field: any) => {
    //   if (field === "tokenHolders") {
    //     return !!values["tokenHolders"].length;
    //   }
    //   return !values[field as keyof MemberSettings];
    // };
    // handleErrorMessages(values, handleLedgerValidation);
  };

const TokenSettingsForm = ({
  values,
  submitForm,
  touched,
  errors,
}: { values: MemberSettings } & any) => {
  const { dispatch } = useContext(CreatorContext);

  const history = useHistory();
  const match = useRouteMatch();

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
          handler: () => history.push(`voting`),
        },
      });
    }
  }, [dispatch, errors, history, match.path, match.url, submitForm, values]);

  //@TODO: Refactor token holder and balance inputs to use same logic
  return (
    <>
      <TokenHoldersGrid container direction="row">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={8}>
              <Typography variant="subtitle1" color="textSecondary">
                Token holders
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" color="textSecondary">
                {" "}
                Balance{" "}
              </Typography>
            </Grid>
          </Grid>

          <FieldArray
            name="tokenHolders"
            render={(arrayHelpers) => {
              const someEmpty = values.tokenHolders.some(
                (t: { address: string; balance: number }) =>
                  t.address === "" || !(t.balance > 0)
              );
              return (
                <>
                  {values.tokenHolders.map((_: string, index: number) => (
                    <Grid key={index} container alignItems="center">
                      <CustomInputContainer item xs={8}>
                        <Field
                          type="text"
                          component={CustomFormikTextField}
                          placeholder="tz1PXn...."
                          name={`tokenHolders.${index}.address`}
                        />
                      </CustomInputContainer>
                      <CustomBalanceContainer
                        container
                        item
                        xs={3}
                        alignItems="center"
                      >
                        <Grid item>
                          <Field
                            type="number"
                            component={CustomFormikTextField}
                            placeholder="0.00"
                            name={`tokenHolders.${index}.balance`}
                          />
                        </Grid>
                      </CustomBalanceContainer>
                      {values.tokenHolders.length > 1 && (
                        <Grid item xs={1}>
                          <RemoveButton
                            className="button"
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            {" "}
                            x
                          </RemoveButton>
                        </Grid>
                      )}
                    </Grid>
                  ))}
                  {!someEmpty ? (
                    <Grid container>
                      <Grid item xs={8} />
                      <Grid item xs={3}>
                        <AddButon
                          className="button"
                          type="button"
                          onClick={() =>
                            arrayHelpers.insert(values.tokenHolders.length, {
                              token_holder: "",
                              balance: 0,
                            })
                          }
                        >
                          {" "}
                          Add new row
                        </AddButon>
                      </Grid>
                    </Grid>
                  ) : null}
                </>
              );
            }}
          />
        </Grid>
      </TokenHoldersGrid>

      <Grid container direction="row">
        <Grid item xs={8}>
          <CustomTotalContainer variant="subtitle1" color="textSecondary">
            {" "}
            Total{" "}
          </CustomTotalContainer>
        </Grid>
        <Grid item xs={4}>
          <CustomValueContainer color="textSecondary">
            <Total values={values} />
          </CustomValueContainer>
        </Grid>
      </Grid>

      <SecondContainer item container direction="row" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            {" "}
            Administrator{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomInputContainer>
            <Field
              name="administrator"
              type="text"
              placeholder="tz1PXn...."
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

export const TokenSettings = (): JSX.Element => {
  const { dispatch, state, updateCache } = useContext(CreatorContext);
  const { memberSettings } = state.data;
  const history = useHistory();

  const saveStepInfo = (
    values: MemberSettings,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    updateCache({
      ...state.data,
      memberSettings: values,
    });
    setSubmitting(true);
    dispatch({ type: ActionTypes.UPDATE_MEMBERS_SETTINGS, members: values });
    history.push(`summary`);
  };

  return (
    <Box maxWidth={650}>
      <Grid
        container
        direction="row"
        justify="space-between"
        style={{ height: "fit-content" }}
      >
        <Grid item xs={12}>
          <Typography variant="h3" color="textSecondary">
            Distribution Settings
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1" color="textSecondary">
            These settings will define the name, symbol, and initial
            distribution of your token.
          </CustomTypography>
        </Grid>
      </Grid>
      <Formik
        enableReinitialize={true}
        validate={validate}
        onSubmit={saveStepInfo}
        initialValues={memberSettings}
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
    </Box>
  );
};
