import { Grid, styled, Typography, Box, Tooltip } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import React, { useContext, useEffect } from "react";
import { Field, Form, Formik, FormikErrors } from "formik";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

import { CreatorContext, ActionTypes } from "modules/creator/state";
import { QuorumSettings } from "services/contracts/baseDAO/types";
import { InfoOutlined } from "@material-ui/icons";

const CustomTypography = styled(Typography)(({ theme }) => ({
  paddingBottom: 10,
  borderBottom: `1px solid ${theme.palette.primary.light}`,
  marginTop: 10,
  marginBottom: 33,
}));

const ErrorText = styled(Typography)({
  display: "block",
  fontSize: 14,
  color: "red",
});

const SpacingContainer = styled(Grid)({
  marginTop: 25,
});

const AdditionContainer = styled(Grid)(({ theme }) => ({
  marginTop: 14,
  border: `1px solid ${theme.palette.primary.light}`,
  height: 62,
}));

const GridItemCenter = styled(Grid)({
  textAlign: "center",
});

const ItemContainer = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: 12,
  "&:hover": {
    background: "rgba(129, 254, 183, 0.03)",
    borderLeft: `2px solid ${theme.palette.secondary.light}`,
  },
}));

const ValueText = styled(Typography)({
  fontSize: 14,
});

const InfoIconInput = styled(InfoOutlined)({
  cursor: "default",
});

const validateForm = (values: QuorumSettings) => {
  const errors: FormikErrors<QuorumSettings> = {};

  Object.keys(values).forEach((key) => {
    if ((values[key as keyof QuorumSettings] as number | string) === "") {
      errors[key as keyof QuorumSettings] = "Required";
    }

    if (Number(values[key as keyof QuorumSettings]) < 0) {
      errors[key as keyof QuorumSettings] = "Cannot be negative";
    }
  });

  if (values.minQuorumAmount <= 0) {
    errors.minQuorumAmount = "Must be greater than 0";
  }

  if (values.maxQuorumAmount >= 100) {
    errors.maxQuorumAmount = "Must be lower than 100";
  }

  if (values.minQuorumAmount > values.maxQuorumAmount) {
    errors.maxQuorumAmount = "Must be greater than Min. Quorum amount";
  }

  if (
    values.quorumThreshold > values.maxQuorumAmount ||
    values.quorumThreshold < values.minQuorumAmount
  ) {
    errors.quorumThreshold = "Must be between Min and Max Quorum amounts";
  }

  if (values.quorumChange > values.quorumMaxChange) {
    errors.quorumChange = "Cannot be greater than Max Quorum Change";
  }

  return errors;
};

//TODO: Remove any from this component
const QuorumForm = ({ submitForm, values, errors, touched }: any) => {
  const {
    dispatch,
    state: {
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
          handler: () => history.push(`voting`),
        },
      });
    }
  }, [dispatch, errors, history, match.path, match.url, submitForm, values]);

  return (
    <>
      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Quorum Threshold
        </Typography>
      </SpacingContainer>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={3}>
              <Field
                name="quorumThreshold"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
              />
            </GridItemCenter>
            <GridItemCenter item xs={1}>
              <ValueText color="textSecondary">%</ValueText>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={6}
              container
              direction="row"
              justify="space-around"
            >
              <Tooltip
                placement="bottom"
                title={`Initial % of ${
                  orgSettings.governanceToken.tokenMetadata?.symbol || ""
                }'s supply required as votes to pass/reject a proposal. Total supply: ${
                  orgSettings.governanceToken.tokenMetadata?.supply
                }`}
              >
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {errors.quorumThreshold && touched.quorumThreshold ? (
          <ErrorText>{errors.quorumThreshold}</ErrorText>
        ) : null}
      </Grid>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={3}>
              <Field
                name="minQuorumAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={7}
              container
              direction="row"
              justify="space-around"
            >
              <ValueText color="textSecondary">% Min</ValueText>
              <Tooltip placement="bottom" title="Minimum value the quorum can change to after participation adjustment">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.minQuorumAmount && touched.minQuorumAmount ? (
            <ErrorText>{errors.minQuorumAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={3}>
              <Field
                name="maxQuorumAmount"
                type="number"
                placeholder="00"
                component={TextField}
              ></Field>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={7}
              container
              direction="row"
              justify="space-around"
            >
              <ValueText color="textSecondary">% Max</ValueText>
              <Tooltip placement="bottom" title="Maximum value the quorum can change to after participation adjustment">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
          {errors.maxQuorumAmount && touched.maxQuorumAmount ? (
            <ErrorText>{errors.maxQuorumAmount}</ErrorText>
          ) : null}
        </AdditionContainer>
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Quorum Change
        </Typography>
      </SpacingContainer>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={3}>
              <Field
                name="quorumChange"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
              />
            </GridItemCenter>
            <GridItemCenter item xs={1}>
              <ValueText color="textSecondary">%</ValueText>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={6}
              container
              direction="row"
              justify="space-around"
            >
              <Tooltip placement="bottom" title="Participation adjustment value">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {errors.quorumChange && touched.quorumChange ? (
          <ErrorText>{errors.quorumChange}</ErrorText>
        ) : null}
      </Grid>

      <SpacingContainer direction="row" container alignItems="center">
        <Typography variant="subtitle1" color="textSecondary">
          Quorum Max Change
        </Typography>
      </SpacingContainer>

      <Grid
        container
        direction="row"
        alignItems="center"
        style={{ marginTop: 14 }}
      >
        <AdditionContainer item xs={12} sm={4}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justify="center"
          >
            <GridItemCenter item xs={3}>
              <Field
                name="quorumMaxChange"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
              />
            </GridItemCenter>
            <GridItemCenter item xs={1}>
              <ValueText color="textSecondary">%</ValueText>
            </GridItemCenter>
            <GridItemCenter
              item
              xs={6}
              container
              direction="row"
              justify="space-around"
            >
              <Tooltip placement="bottom" title="Maximum participation adjustment value">
                <InfoIconInput color="secondary" />
              </Tooltip>
            </GridItemCenter>
          </ItemContainer>
        </AdditionContainer>
        {errors.quorumMaxChange && touched.quorumMaxChange ? (
          <ErrorText>{errors.quorumMaxChange}</ErrorText>
        ) : null}
      </Grid>
    </>
  );
};

//TODO: Remove any from this component
export const Quorum: React.FC = () => {
  const { dispatch, state, updateCache } = useContext(CreatorContext);
  const { quorumSettings } = state.data;
  const history = useHistory();

  const saveStepInfo = (
    values: QuorumSettings,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    const newState = {
      ...state.data,
      quorumSettings: values,
    };
    updateCache(newState);
    setSubmitting(true);
    dispatch({ type: ActionTypes.UPDATE_QUORUM_SETTINGS, quorum: values });
    history.push(`summary`);
  };

  return (
    <Box maxWidth={620}>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12}>
          <Typography variant="h3" color="textSecondary">
            Quorum
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <CustomTypography variant="subtitle1" color="textSecondary">
            Each period, a new quorum threshold is calculated based on the
            previous&#39;s period participation. It is set as a percentage of
            the governance token&#39;s total supply
          </CustomTypography>
        </Grid>
      </Grid>

      <Formik
        enableReinitialize
        validate={(values) => validateForm(values)}
        onSubmit={saveStepInfo}
        initialValues={quorumSettings}
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
              <QuorumForm
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
