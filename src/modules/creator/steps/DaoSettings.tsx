import {
  Grid,
  styled,
  Typography,
  withStyles,
  TextareaAutosize,
  withTheme,
  Box,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Tooltip,
  Switch,
} from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Field, Form, Formik, getIn } from "formik";
import { TextField as FormikTextField } from "formik-material-ui";

import { CreatorContext, ActionTypes } from "modules/creator/state";
import { handleOrgFormErrors } from "modules/creator/utils";
import { OrgSettings } from "services/contracts/baseDAO/types";
import { InfoOutlined } from "@material-ui/icons";
import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata";

const CustomTypography = styled(Typography)(({ theme }) => ({
  paddingBottom: 21,
  borderBottom: `1px solid ${theme.palette.primary.light}`,
  marginTop: 10
}));

const SecondContainer = styled(Grid)({
  marginTop: 25
});

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  height: 62,
  marginTop: 14,
  padding: "18px 21px",
  boxSizing: "border-box",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${theme.palette.secondary.light}`
  }
}));

const CustomInputContainerInput = styled(CustomInputContainer)({
  padding: "0px 21px"
});

const InfoIcon = styled(InfoOutlined)({
  position: "absolute",
  right: 25,
  top: "50%"
});

const InfoIconInput = styled(InfoOutlined)({
  cursor: "default"
});

const TextareaContainer = styled(Grid)({
  display: "flex",
  position: "relative"
});

const CustomFormikTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial"
    },
    "& .MuiInputBase-input": {
      textAlign: "initial"
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "none !important"
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important"
    }
  }
})(FormikTextField);

const CustomTextarea = styled(withTheme(TextareaAutosize))(props => ({
  minHeight: 152,
  boxSizing: "border-box",
  width: "100%",
  border: `1px solid ${props.theme.palette.primary.light}`,
  marginTop: 14,
  fontWeight: 300,
  padding: "21px 20px",
  fontFamily: "system-ui",
  fontSize: 16,
  background: props.theme.palette.primary.main,
  color: props.theme.palette.text.secondary,
  paddingRight: 40,
  wordBreak: "break-word",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`
  }
}));

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red"
});

const CustomInput = styled("input")(({ theme }) => ({
  background: "inherit",
  border: "none",
  fontSize: 16,
  fontWeight: 400,
  lineHeight: "146.3%",
  letterSpacing: "-0.01em",
  color: "#fff",
  outline: "none",
  height: "100%",
  fontFamily: theme.typography.fontFamily,
  width: "100%",
  "&:hover": {
    border: "none",
    outline: "none",
    background: "rgba(129, 254, 183, 0.001)"
  },
  "&:active": {
    border: "none",
    outline: "none",
    background: "rgba(129, 254, 183, 0.001)"
  },
  "&:focus": {
    border: "none",
    outline: "none",
    background: "rgba(129, 254, 183, 0.001)"
  }
}));

const DaoSettingsForm = withRouter(
  ({ submitForm, values, setFieldValue, errors, touched }: any) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [checked, setChecked] = useState(false);
    const [address, setAddress] = useState("");
    const { data } = useTokenMetadata(address);

    const {
      dispatch,
      state: { governanceStep }
    } = useContext(CreatorContext);
    const match = useRouteMatch();
    const history = useHistory();

    const handleAddress = useCallback(() => {
      if (data) {
        setFieldValue("name", data.name);
        setFieldValue("symbol", data?.symbol);
      }
    }, [data, setFieldValue]);

    const handleChecked = useCallback(() => {
      values.name = "";
      values.symbol = "";
    }, [values]);

    useEffect(() => {
      setAddress(address);
      if (address === "" || data === undefined) {
        handleChecked();
      }

      if(address !== "" && data !== undefined) {
        handleAddress();
      } 
    }, [address, data, handleAddress, handleChecked]);

    useEffect(() => {
      if (values) {
        dispatch({
          type: ActionTypes.UPDATE_NAVIGATION_BAR,
          next: {
            handler: () => {
              submitForm(values);
            },
            text: "CONTINUE"
          },
          back: {
            handler: () => history.push(`templates`),
            text: "BACK"
          }
        });
      }
    }, [
      dispatch,
      errors,
      governanceStep,
      history,
      match.path,
      match.url,
      submitForm,
      values
    ]);

    return (
      <>
        <SecondContainer container item direction="row" spacing={2} wrap="wrap">
          <Grid item xs={12} container direction="row" alignItems="center">
            <Switch
              checked={checked}
              onChange={() => {
                setChecked(!checked)
                return handleChecked()}}
              name="checkedB"
            />
            <Typography color="textSecondary">
              Create DAO from existing token.
            </Typography>
          </Grid>
          {checked ? (
            <Grid item xs={isMobile ? 12 : 9}>
              <Typography variant="subtitle1" color="textSecondary">
                {" "}
                Token Address{" "}
              </Typography>
              <CustomInputContainerInput>
                <CustomInput
                  id="outlined-basic"
                  placeholder="tz1aaYo...."
                  onBlur={(e: any) => {
                    setAddress(e.target.value)}}
                />
              </CustomInputContainerInput>
              {data === undefined && address !== "" ? (
              <ErrorText>{"No data found"}</ErrorText>
            ) : null}
            </Grid>
          ) : null}
          <Grid item xs={isMobile ? 12 : 9}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              DAO Name{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                name="name"
                disabled={checked}
                inputProps={{ maxLength: 18 }}
                type="text"
                placeholder="My Group’s Token"
                component={CustomFormikTextField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="DAO Name info">
                        <InfoIconInput color="secondary" />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              ></Field>
            </CustomInputContainer>
            {errors.name && touched.name ? (
              <ErrorText>{errors.name}</ErrorText>
            ) : null}
          </Grid>

          <Grid item xs={isMobile ? 12 : 3}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Token Symbol{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                name="symbol"
                type="text"
                disabled={checked}
                inputProps={{
                  style: { textTransform: "uppercase" },
                  maxLength: 6
                }}
                placeholder="MYTOK"
                component={CustomFormikTextField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="Token symbol info">
                        <InfoIconInput color="secondary" />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              ></Field>
            </CustomInputContainer>
            {errors.symbol && touched.symbol ? (
              <ErrorText>{errors.symbol}</ErrorText>
            ) : null}
          </Grid>
        </SecondContainer>
        <SecondContainer container direction="row" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Description
            </Typography>
          </Grid>
          <TextareaContainer item xs={12}>
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
            <Tooltip title="Description info">
              <InfoIcon color="secondary" />
            </Tooltip>
          </TextareaContainer>
          {errors.description && touched.description ? (
            <ErrorText>{errors.description}</ErrorText>
          ) : null}
        </SecondContainer>
      </>
    );
  }
);

export const DaoSettings = (): JSX.Element => {
  const { state, dispatch, updateCache } = useContext(CreatorContext);
  const { orgSettings } = state.data;
  const history = useHistory();

  const saveStepInfo = (
    values: OrgSettings,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    const newState = {
      ...state.data,
      orgSettings: values
    };
    updateCache(newState);
    setSubmitting(true);
    dispatch({ type: ActionTypes.UPDATE_ORGANIZATION_SETTINGS, org: values });
    history.push(`token`);
  };

  return (
    <Box maxWidth="620px">
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
        validate={(values: OrgSettings) => handleOrgFormErrors(values)}
        onSubmit={saveStepInfo}
        initialValues={orgSettings}
      >
        {({
          submitForm,
          isSubmitting,
          setFieldValue,
          values,
          errors,
          touched
        }) => {
          return (
            <Form style={{ width: "100%" }}>
              <DaoSettingsForm
                validate={(values: OrgSettings) => handleOrgFormErrors(values)}
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
