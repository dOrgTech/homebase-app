import { Grid, styled, Typography, Box, Tooltip } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import React, { useContext, useEffect } from "react";
import { Field, Form, Formik, FormikErrors } from "formik";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

import {
  CreatorContext,
  ActionTypes,
  QuorumSettings,
} from "modules/creator/state";
import { InfoRounded } from "@material-ui/icons";
import { TitleBlock } from "modules/common/TitleBlock";

const ErrorText = styled(Typography)({
  display: "flex",
  minWidth: "100%",
  fontSize: 14,
  color: "red",
});

const SpacingContainer = styled(Grid)({
  marginTop: 25,
});

const AdditionContainer = styled(Grid)(({ theme }) => ({
  marginTop: 14,
  height: 54,
  background: "#2F3438",
  borderRadius: 8,
  maxWidth: 150,
  ["@media (max-width:1167px)"]: {
    marginRight: 0,
    maxWidth: "100%",
  },
}));

const GridItemCenter = styled(Grid)({
  textAlign: "center",
  justifyContent: "space-around",
  ["@media (max-width:1167px)"]: {
    justifyContent: "flex-end",
  },
});

const GridItemCenterBottom = styled(Grid)({
  textAlign: "center",
  justifyContent: "flex-end",
});

const ItemContainer = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: "12px 25px",
  ["@media (max-width:1167px)"]: {
    paddingLeft: 25,
    paddingRight: 25,
  },
}));

const ValueText = styled(Typography)({
  fontSize: 14,
  opacity: 0.8,
  ["@media (max-width:1167px)"]: {
    marginRight: 20,
  },
});

const GridItemContainer = styled(Grid)(() => ({
  display: "flex",
  alignItems: "center",
}));

const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16,
}));

const InfoIconInputQuorum = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16,
  marginTop: 2,
}));

const ParentContainer = styled(Grid)({
  marginTop: 14,
  maxWidth: "70%",
  ["@media (max-width:1167px)"]: {
    maxWidth: "100%",
  },
});

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  border: "none",
  height: 54,
  marginTop: 14,
  background: "#2F3438",
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "end",
  padding: "12px 25px",
  minWidth: 150,
  maxWidth: 150,
  ["@media (max-width:1167px)"]: {
    maxWidth: "100%",
    minWidth: "100%",
    paddingLeft: 25,
    paddingRight: 25,
  },
}));

const InputContainer = styled(Grid)({
  paddingRight: 15,
  ["@media (max-width:1167px)"]: {
    paddingRight: 0,
  },
});

type QuorumChange = { key: string; preventDefault: () => void };

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
    errors.minQuorumAmount = "Min Quorum amount must be greater than 0";
  }

  if (values.maxQuorumAmount >= 100) {
    errors.maxQuorumAmount = "Max Quorum amount must be lower than 100";
  }

  if (values.minQuorumAmount > values.maxQuorumAmount) {
    errors.maxQuorumAmount =
      "Max Quorum amount must be greater than Min. Quorum amount";
  }

  if (
    values.quorumThreshold >= values.maxQuorumAmount ||
    values.quorumThreshold <= values.minQuorumAmount
  ) {
    errors.quorumThreshold =
      "Quorum Threshold must be between Min and Max Quorum amounts";
  }

  if (values.quorumChange > values.quorumMaxChange) {
    errors.quorumChange = "Cannot be greater than Max Quorum Change";
  }

  return errors;
};

const handleChange = (event: QuorumChange) => {
  return event.key === "." || event.key === "," ? event.preventDefault() : null;
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
          text: "Continue",
          handler: () => {
            submitForm(values);
          },
        },
        back: {
          text: "Back",
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

      <ParentContainer container direction="row" alignItems="center">
        <InputContainer item xs={12} sm={4}>
          <GridItemContainer>
            <CustomInputContainer item xs={12} container direction="row">
              <GridItemCenter item xs={5}>
                <Field
                  name="quorumThreshold"
                  type="number"
                  placeholder="00"
                  inputProps={{ min: 0, max: 100 }}
                  component={TextField}
                  InputProps={{
                    endAdornment: (
                      <ValueText color="textSecondary">%</ValueText>
                    ),
                  }}
                />
              </GridItemCenter>
              <GridItemCenterBottom
                item
                xs={7}
                container
                direction="row"
                justifyContent="flex-end"
              >
                <Tooltip
                  placement="bottom"
                  title={`Initial % of ${
                    orgSettings.governanceToken.tokenMetadata?.symbol || ""
                  }'s supply required as votes to pass/reject a proposal. Total supply: ${
                    orgSettings.governanceToken.tokenMetadata?.supply
                  }`}
                >
                  <InfoIconInput />
                </Tooltip>
              </GridItemCenterBottom>
            </CustomInputContainer>
          </GridItemContainer>
        </InputContainer>

        <InputContainer item xs={12} sm={4}>
          <GridItemContainer>
            <CustomInputContainer item xs={12} container direction="row">
              <GridItemCenter item xs={5}>
                <Field
                  name="minQuorumAmount"
                  type="number"
                  placeholder="00"
                  component={TextField}
                  InputProps={{
                    endAdornment: (
                      <ValueText color="textSecondary">%</ValueText>
                    ),
                  }}
                ></Field>
              </GridItemCenter>
              <GridItemCenter
                item
                xs={7}
                container
                direction="row"
                justifyContent="space-around"
              >
                <ValueText color="textSecondary"> Min</ValueText>
                <Tooltip
                  placement="bottom"
                  title="Minimum value the quorum can change to after participation adjustment"
                >
                  <InfoIconInputQuorum />
                </Tooltip>
              </GridItemCenter>
            </CustomInputContainer>
          </GridItemContainer>
        </InputContainer>
        <InputContainer item xs={12} sm={4}>
          <GridItemContainer>
            <CustomInputContainer item xs={12} container direction="row">
              <GridItemCenter item xs={5}>
                <Field
                  name="maxQuorumAmount"
                  type="number"
                  placeholder="00"
                  component={TextField}
                  InputProps={{
                    endAdornment: (
                      <ValueText color="textSecondary">%</ValueText>
                    ),
                  }}
                ></Field>
              </GridItemCenter>
              <GridItemCenter item xs={7} container direction="row">
                <ValueText color="textSecondary">Max</ValueText>
                <Tooltip
                  placement="bottom"
                  title="Maximum value the quorum can change to after participation adjustment"
                >
                  <InfoIconInputQuorum />
                </Tooltip>
              </GridItemCenter>
            </CustomInputContainer>
          </GridItemContainer>
        </InputContainer>
        {errors.quorumThreshold && touched.quorumThreshold ? (
          <ErrorText>{errors.quorumThreshold}</ErrorText>
        ) : null}
        {errors.minQuorumAmount && touched.minQuorumAmount ? (
          <ErrorText>{errors.minQuorumAmount}</ErrorText>
        ) : null}
        {errors.maxQuorumAmount && touched.maxQuorumAmount ? (
          <ErrorText>{errors.maxQuorumAmount}</ErrorText>
        ) : null}
      </ParentContainer>

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
        <AdditionContainer item xs={12} sm={3}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <GridItemCenter item xs={5}>
              <Field
                name="quorumChange"
                type="number"
                onKeyDown={(e: QuorumChange) => handleChange(e)}
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
                InputProps={{
                  endAdornment: <ValueText color="textSecondary">%</ValueText>,
                }}
              />
            </GridItemCenter>

            <GridItemCenterBottom item xs={7} container direction="row">
              <Tooltip
                placement="bottom"
                title="Participation adjustment value"
              >
                <InfoIconInput />
              </Tooltip>
            </GridItemCenterBottom>
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
        <AdditionContainer item xs={12} sm={3}>
          <ItemContainer
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <GridItemCenter item xs={5}>
              <Field
                name="quorumMaxChange"
                type="number"
                placeholder="00"
                inputProps={{ min: 0, max: 100 }}
                component={TextField}
                InputProps={{
                  endAdornment: <ValueText color="textSecondary">%</ValueText>,
                }}
              />
            </GridItemCenter>

            <GridItemCenterBottom
              item
              xs={7}
              container
              direction="row"
              justifyContent="space-around"
            >
              <Tooltip
                placement="bottom"
                title="Maximum participation adjustment value"
              >
                <InfoIconInput />
              </Tooltip>
            </GridItemCenterBottom>
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
    <Box>
      <TitleBlock
        title={"Quorum"}
        description={
          `Each period, a new quorum threshold is calculated based on the previous` +
          "\u0027" +
          "s period participation. It is set as a percentage of the governance token" +
          "\u0027" +
          "s total supply"
        }
        tooltip={true}
      ></TitleBlock>

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
