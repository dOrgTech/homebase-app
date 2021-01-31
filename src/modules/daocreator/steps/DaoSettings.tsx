import {
  Grid,
  styled,
  Typography,
  withStyles,
  TextareaAutosize,
  withTheme,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Field, Form, Formik, getIn } from "formik";
import {
  TextField as FormikTextField,
  Switch as FormikSwitch,
} from "formik-material-ui";

import { saveOrgSettings } from "../../../store/dao-info/action";
import { AppState } from "../../../store";
import { CreatorContext } from "../state/context";
import { ActionTypes } from "../state/types";
import { OrgSettings } from "../../../contracts/store/dependency/types";
import { handleErrorMessages } from "../utils";

const CustomTypography = styled(Typography)({
  paddingBottom: 21,
  borderBottom: "1px solid #3D3D3D",
  marginTop: 10,
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

const CustomTextarea = styled(withTheme(TextareaAutosize))((props) => ({
  height: "153px !important",
  width: "100%",
  border: "1px solid #3D3D3D",
  marginTop: 14,
  fontWeight: 300,
  padding: "21px 20px",
  fontFamily: "system-ui",
  fontSize: 16,
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: "2px solid #81FEB7",
  },
}));

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
});

//@TODO: Remove any from this component
const DaoSettingsForm = ({
  submitForm,
  values,
  setFieldValue,
  errors,
  touched,
}: any) => {
  const dispatch = useContext(CreatorContext).dispatch;

  useEffect(() => {
    if (values) {
      dispatch({
        type: ActionTypes.UPDATE_HANDLER,
        handler: (values: any) => submitForm(values),
      });
    }
  }, [dispatch, submitForm, values]);

  return (
    <>
      <SecondContainer container item direction="row" spacing={2}>
        <Grid item xs={9}>
          <Typography variant="subtitle1" color="textSecondary">
            {" "}
            Token name{" "}
          </Typography>
          <CustomInputContainer>
            <Field
              name="name"
              type="text"
              placeholder="My Group’s Token"
              component={CustomFormikTextField}
            ></Field>
          </CustomInputContainer>
          {errors.name && touched.name ? (
            <ErrorText>{errors.name}</ErrorText>
          ) : null}
        </Grid>

        <Grid item xs={3}>
          <Typography variant="subtitle1" color="textSecondary">
            {" "}
            Token symbol{" "}
          </Typography>
          <CustomInputContainer>
            <Field
              name="symbol"
              type="text"
              placeholder="MYTOK"
              component={CustomFormikTextField}
            ></Field>
          </CustomInputContainer>
          {errors.symbol && touched.symbol ? (
            <ErrorText>{errors.symbol}</ErrorText>
          ) : null}
        </Grid>
      </SecondContainer>
      <SecondContainer container direction="row" alignItems="center">
        <Field
          name="lock_disabled"
          component={FormikSwitch}
          type="checkbox"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />

        <Typography variant="subtitle1" color="textSecondary">
          Disable locking until after first voting period.
        </Typography>
      </SecondContainer>

      <SecondContainer container direction="row" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            Description
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Field name="description">
            {() => (
              <CustomTextarea
                maxLength={1500}
                aria-label="empty textarea"
                placeholder="This is what we’re about..."
                value={getIn(values, "description")}
                onChange={(newValue: any) => {
                  setFieldValue("description", newValue.target.value);
                }}
              />
            )}
          </Field>
        </Grid>
        {errors.description && touched.description ? (
          <ErrorText>{errors.description}</ErrorText>
        ) : null}
      </SecondContainer>
    </>
  );
};
export const DaoSettings = (): JSX.Element => {
  const creatorState = useContext(CreatorContext);
  const updateState = creatorState.dispatch;

  const storageDaoInformation = useSelector<
    AppState,
    AppState["saveDaoInformationReducer"]
  >((state) => state.saveDaoInformationReducer);

  const dispatch = useDispatch();

  const saveStepInfo = (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    dispatch(saveOrgSettings(values));
    updateState({ type: ActionTypes.UPDATE_STEP, step: 2 });
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
          <Typography variant="h3" color="textSecondary">
            DAO Settings
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
        enableReinitialize
        validate={(values: OrgSettings) => handleErrorMessages(values)}
        onSubmit={saveStepInfo}
        initialValues={storageDaoInformation.orgSettings}
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
              <DaoSettingsForm
                validate={(values: OrgSettings) => handleErrorMessages(values)}
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
