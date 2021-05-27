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
} from "@material-ui/core";
import { validateContractAddress, validateAddress } from "@taquito/utils";
import React, { useContext, useEffect } from "react";
import { useHistory, withRouter } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Field, Form, Formik, FormikErrors, getIn } from "formik";
import { TextField as FormikTextField } from "formik-material-ui";

import { CreatorContext, ActionTypes } from "modules/creator/state";
import { OrgSettings } from "services/contracts/baseDAO/types";
import { InfoOutlined } from "@material-ui/icons";
import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata";

const CustomTypography = styled(Typography)(({ theme }) => ({
  paddingBottom: 21,
  borderBottom: `1px solid ${theme.palette.primary.light}`,
  marginTop: 10,
}));

const SecondContainer = styled(Grid)({
  marginTop: 25,
});

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.light}`,
  height: 62,
  marginTop: 14,
  padding: "18px 21px",
  boxSizing: "border-box",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${theme.palette.secondary.light}`,
  },
}));

const InfoIcon = styled(InfoOutlined)({
  position: "absolute",
  right: 25,
  top: "50%",
});

const InfoIconInput = styled(InfoOutlined)({
  cursor: "default",
});

const TextareaContainer = styled(Grid)({
  display: "flex",
  position: "relative",
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

const MetadataContainer = styled(Grid)({
  margin: "-4px 0 16px 0",
});

const CustomTextarea = styled(withTheme(TextareaAutosize))((props) => ({
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
    borderLeft: `2px solid ${props.theme.palette.secondary.light}`,
  },
}));

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
});

const DaoSettingsForm = withRouter(
  ({ submitForm, values, setFieldValue, errors, touched }: any) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { data: tokenMetadata, isLoading: loading } = useTokenMetadata(
      values?.governanceToken?.address,
      values?.governanceToken?.tokenId
    );

    useEffect(() => {
      if (tokenMetadata) {
        setFieldValue("governanceToken.tokenMetadata", tokenMetadata);
      }
    }, [setFieldValue, tokenMetadata]);

    const { dispatch } = useContext(CreatorContext);
    const match = useRouteMatch();
    const history = useHistory();

    useEffect(() => {
      if (values) {
        dispatch({
          type: ActionTypes.UPDATE_NAVIGATION_BAR,
          next: {
            handler: () => {
              submitForm(values);
            },
            text: "CONTINUE",
          },
          back: {
            handler: () => history.push(`templates`),
            text: "BACK",
          },
        });
      }
    }, [dispatch, errors, history, match.path, match.url, submitForm, values]);

    return (
      <>
        <SecondContainer container item direction="row" spacing={2} wrap="wrap">
          <Grid item xs={isMobile ? 12 : 9}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Token Address{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                id="outlined-basic"
                placeholder="KT1...."
                name="governanceToken.address"
                component={CustomFormikTextField}
              />
            </CustomInputContainer>
            {errors.governanceToken?.address &&
            touched.governanceToken?.address ? (
              <ErrorText>{errors.governanceToken?.address}</ErrorText>
            ) : null}
          </Grid>
          <Grid item xs={isMobile ? 12 : 3}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Token ID{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                id="outlined-basic"
                placeholder="0"
                name="governanceToken.tokenId"
                component={CustomFormikTextField}
              />
            </CustomInputContainer>
            {errors.governanceToken?.tokenId &&
            touched.governanceToken?.tokenId ? (
              <ErrorText>{errors.governanceToken?.tokenId}</ErrorText>
            ) : null}
          </Grid>
          {tokenMetadata && !loading && (
            <MetadataContainer item xs={12}>
              <Typography variant="subtitle2" color="secondary">
                {tokenMetadata.name} ({tokenMetadata.symbol})
              </Typography>
            </MetadataContainer>
          )}
          <Grid item xs={isMobile ? 12 : 9}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              DAO Name{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                name="name"
                inputProps={{ maxLength: 18 }}
                type="text"
                placeholder="My Group’s Token"
                component={CustomFormikTextField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Tooltip placement="bottom" title="DAO Name info">
                        <InfoIconInput color="secondary" />
                      </Tooltip>
                    </InputAdornment>
                  ),
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
                inputProps={{
                  style: { textTransform: "uppercase" },
                  maxLength: 6,
                }}
                placeholder="MYTOK"
                component={CustomFormikTextField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Tooltip placement="bottom" title="Token symbol info">
                        <InfoIconInput color="secondary" />
                      </Tooltip>
                    </InputAdornment>
                  ),
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
            <Tooltip placement="bottom" title="Description info">
              <InfoIcon color="secondary" />
            </Tooltip>
          </TextareaContainer>
          {errors.description && touched.description ? (
            <ErrorText>{errors.description}</ErrorText>
          ) : null}
        </SecondContainer>
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Tooltip placement="bottom" title="DAO Name info">
                        <InfoIconInput color="secondary" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              ></Field>
            </CustomInputContainer>
            {errors.administrator && touched.administrator ? (
              <ErrorText>{errors.administrator}</ErrorText>
            ) : null}
          </Grid>
        </SecondContainer>
        <SecondContainer item container direction="row" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Guardian{" "}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomInputContainer>
              <Field
                name="guardian"
                type="text"
                placeholder="tz1PXn...."
                component={CustomFormikTextField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Tooltip placement="bottom" title="DAO Name info">
                        <InfoIconInput color="secondary" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              ></Field>
            </CustomInputContainer>
            {errors.guardian && touched.guardian ? (
              <ErrorText>{errors.guardian}</ErrorText>
            ) : null}
          </Grid>
        </SecondContainer>
      </>
    );
  }
);

const isInvalidKtOrTzAddress = (address: string) =>
  validateContractAddress(address) !== 3 && validateAddress(address) !== 3;

const validateForm = (values: OrgSettings) => {
  const errors: FormikErrors<OrgSettings> = {};

  if (!values.name) {
    errors.name = "Required";
  }

  if (!values.symbol) {
    errors.symbol = "Required";
  }

  if (!values.description) {
    errors.description = "Required";
  }

  if (!values.administrator) {
    errors.administrator = "Required";
  }

  if (values.administrator && isInvalidKtOrTzAddress(values.administrator)) {
    errors.administrator = "Invalid address";
  }

  if (!values.guardian) {
    errors.guardian = "Required";
  }

  if (values.guardian && isInvalidKtOrTzAddress(values.guardian)) {
    errors.guardian = "Invalid address";
  }

  if (!values.governanceToken.address) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Required",
    };
  }

  if (
    values.governanceToken.address &&
    validateContractAddress(values.governanceToken.address) !== 3
  ) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Invalid address",
    };
  }

  if (!values.governanceToken.tokenId) {
    errors.governanceToken = {
      ...errors.governanceToken,
      tokenId: "Required",
    };
  }

  return errors;
};

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
      orgSettings: values,
    };
    updateCache(newState);
    setSubmitting(true);
    dispatch({ type: ActionTypes.UPDATE_ORGANIZATION_SETTINGS, org: values });
    history.push(`voting`);
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
        validate={validateForm}
        onSubmit={saveStepInfo}
        initialValues={orgSettings}
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
