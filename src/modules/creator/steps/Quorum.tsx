import { Grid, styled, Typography, Box, Tooltip } from "@material-ui/core"
import { TextField } from "formik-material-ui"
import React, { useContext, useEffect } from "react"
import { Field, Form, Formik, FormikErrors } from "formik"
import { useHistory } from "react-router"
import { useRouteMatch } from "react-router-dom"

import { CreatorContext, ActionTypes, QuorumSettings } from "modules/creator/state"
import { InfoRounded } from "@material-ui/icons"
import { TitleBlock } from "modules/common/TitleBlock"
import { FieldChange, handleChange } from "../utils"

const ErrorText = styled(Typography)({
  display: "flex",
  minWidth: "100%",
  fontSize: 14,
  color: "red",
  height: 42
})

const SpacingContainer = styled(Grid)(({ theme }) => ({
  marginTop: 25,
  [theme.breakpoints.down("sm")]: {
    gap: 16
  }
}))

const AdditionContainer = styled(Grid)(({ theme }) => ({
  marginTop: 14,
  height: 54,
  background: "#2F3438",
  borderRadius: 8,
  maxWidth: 150,
  ["@media (max-width:1167px)"]: {
    marginRight: 0,
    maxWidth: "100%"
  }
}))

const GridItemCenter = styled(Grid)({
  textAlign: "center",
  justifyContent: "space-around",
  ["@media (max-width:1167px)"]: {
    justifyContent: "flex-end"
  }
})

const GridItemCenterBottom = styled(Grid)({
  textAlign: "center",
  justifyContent: "flex-end"
})

const ItemContainer = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: "12px 25px",
  ["@media (max-width:1167px)"]: {
    paddingLeft: 25,
    paddingRight: 25
  }
}))

const ValueText = styled(Typography)({
  fontSize: 14,
  opacity: 0.8,
  ["@media (max-width:1167px)"]: {
    marginRight: 20
  }
})

const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16
}))

const InfoIconInputQuorum = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16,
  marginTop: 2
}))

const ParentContainer = styled(Grid)({
  marginTop: 14,
  maxWidth: "70%",
  ["@media (max-width:1167px)"]: {
    maxWidth: "100%"
  }
})

const validateForm = (values: QuorumSettings) => {
  const errors: FormikErrors<QuorumSettings> = {}

  Object.keys(values).forEach(key => {
    if ((values[key as keyof QuorumSettings] as number | string) === "") {
      errors[key as keyof QuorumSettings] = "Required"
    }

    if (Number(values[key as keyof QuorumSettings]) < 0) {
      errors[key as keyof QuorumSettings] = "Cannot be negative"
    }
  })

  if (values.minQuorumAmount <= 0) {
    errors.minQuorumAmount = "Min Quorum amount must be greater than 0"
  }

  if (values.maxQuorumAmount >= 100) {
    errors.maxQuorumAmount = "Max Quorum amount must be lower than 100"
  }

  if (values.minQuorumAmount > values.maxQuorumAmount) {
    errors.maxQuorumAmount = "Max Quorum amount must be greater than Min. Quorum amount"
  }

  if (values.quorumThreshold >= values.maxQuorumAmount || values.quorumThreshold <= values.minQuorumAmount) {
    errors.quorumThreshold = "Quorum Threshold must be between Min and Max Quorum amounts"
  }

  if (values.quorumChange > values.quorumMaxChange) {
    errors.quorumChange = "Cannot be greater than Max Quorum Change"
  }

  return errors
}

//TODO: Remove any from this component
const QuorumForm = ({ submitForm, values, errors, touched, setFieldValue, setFieldTouched }: any) => {
  const {
    dispatch,
    state: {
      data: { orgSettings }
    }
  } = useContext(CreatorContext)
  const match = useRouteMatch()
  const history = useHistory()

  // const controlMaxFieldLimit = (field: string, value: any) => {
  //   const itemValue = value.target.value.split(".")
  //   if ((itemValue[0] && itemValue[0].length > 18) || (itemValue[1] && itemValue[1].length > 8)) {
  //     return value.preventDefault()
  //   }
  //   setFieldValue(field, value.target.value)
  // }

  useEffect(() => {
    if (values) {
      dispatch({
        type: ActionTypes.UPDATE_NAVIGATION_BAR,
        next: {
          text: "Continue",
          handler: () => {
            submitForm(values)
          }
        },
        back: {
          text: "Back",
          handler: () => history.push(`voting`)
        }
      })
    }
  }, [dispatch, errors, history, match.path, match.url, submitForm, values])

  return (
    <>
      <SpacingContainer direction="row" container alignItems="center" justifyContent="space-between">
        <Grid container item direction="column" xs={12} md={6}>
          <Typography variant="subtitle1" color="textSecondary" style={{ fontWeight: 400 }}>
            Initial Quorum Threshold
          </Typography>
          <Grid container direction="row" alignItems="center" style={{ marginTop: 14 }}>
            <AdditionContainer item xs={12} sm={6}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={5}>
                  <Field
                    style={{ textAlign: "end" }}
                    name="quorumThreshold"
                    type="number"
                    onKeyDown={(e: FieldChange) => handleChange(e)}
                    placeholder="00"
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    component={TextField}
                    InputProps={{
                      endAdornment: <ValueText color="textSecondary">%</ValueText>
                    }}
                    onClick={() => setFieldTouched("quorumThreshold")}
                    // onChange={(e: any) => controlMaxFieldLimit("quorumThreshold", e)}
                  />
                </GridItemCenter>

                <GridItemCenterBottom item xs={7} container direction="row">
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
              </ItemContainer>
            </AdditionContainer>
            {errors.quorumThreshold && touched.quorumThreshold ? <ErrorText>{errors.quorumThreshold}</ErrorText> : null}
          </Grid>
        </Grid>

        <Grid container item direction="column" xs={12} md={6}>
          <Typography variant="subtitle1" color="textSecondary" style={{ fontWeight: 400 }}>
            Initial Quorum Change
          </Typography>
          <Grid container direction="row" alignItems="center" style={{ marginTop: 14 }}>
            <AdditionContainer item xs={12} sm={6}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={5}>
                  <Field
                    style={{ textAlign: "end" }}
                    name="quorumChange"
                    type="number"
                    onKeyDown={(e: FieldChange) => handleChange(e)}
                    placeholder="00"
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    component={TextField}
                    InputProps={{
                      endAdornment: <ValueText color="textSecondary">%</ValueText>
                    }}
                    onClick={() => setFieldTouched("quorumChange")}
                    // onChange={(e: any) => controlMaxFieldLimit("quorumChange", e)}
                  />
                </GridItemCenter>

                <GridItemCenterBottom item xs={7} container direction="row">
                  <Tooltip placement="bottom" title="Participation adjustment value">
                    <InfoIconInput />
                  </Tooltip>
                </GridItemCenterBottom>
              </ItemContainer>
            </AdditionContainer>
            {errors.quorumChange && touched.quorumChange ? <ErrorText>{errors.quorumChange}</ErrorText> : null}
          </Grid>
        </Grid>
      </SpacingContainer>

      <SpacingContainer direction="row" container alignItems="center" justifyContent="space-between">
        <Grid container item direction="column" xs={12} sm={6}>
          <Typography variant="subtitle1" color="textSecondary" style={{ fontWeight: 400 }}>
            Min. Quorum Threshold
          </Typography>
          <Grid container direction="row" alignItems="center" style={{ marginTop: 14 }}>
            <AdditionContainer item xs={12} sm={6}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={5}>
                  <Field
                    style={{ textAlign: "end" }}
                    name="minQuorumAmount"
                    type="number"
                    onKeyDown={(e: FieldChange) => handleChange(e)}
                    placeholder="00"
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    component={TextField}
                    InputProps={{
                      endAdornment: <ValueText color="textSecondary">%</ValueText>
                    }}
                    onClick={() => setFieldTouched("minQuorumAmount")}
                    // onChange={(e: any) => controlMaxFieldLimit("minQuorumAmount", e)}
                  ></Field>
                </GridItemCenter>

                <GridItemCenterBottom item xs={7} container direction="row">
                  <Tooltip
                    placement="bottom"
                    title="Minimum value the quorum can change to after participation adjustment"
                  >
                    <InfoIconInput />
                  </Tooltip>
                </GridItemCenterBottom>
              </ItemContainer>
            </AdditionContainer>
            {errors.minQuorumAmount && touched.minQuorumAmount ? <ErrorText>{errors.minQuorumAmount}</ErrorText> : null}
          </Grid>
        </Grid>

        <Grid container item direction="column" xs={12} sm={6}>
          <Typography variant="subtitle1" color="textSecondary" style={{ fontWeight: 400 }}>
            Max. Quorum Change
          </Typography>
          <Grid container direction="row" alignItems="center" style={{ marginTop: 14 }}>
            <AdditionContainer item xs={12} sm={6}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={5}>
                  <Field
                    style={{ textAlign: "end" }}
                    name="quorumMaxChange"
                    type="number"
                    onKeyDown={(e: FieldChange) => handleChange(e)}
                    placeholder="00"
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    component={TextField}
                    InputProps={{
                      endAdornment: <ValueText color="textSecondary">%</ValueText>
                    }}
                    onClick={() => setFieldTouched("quorumMaxChange")}
                    // onChange={(e: any) => controlMaxFieldLimit("quorumMaxChange", e)}
                  />
                </GridItemCenter>

                <GridItemCenterBottom item xs={7} container direction="row">
                  <Tooltip placement="bottom" title="Maximum participation adjustment value">
                    <InfoIconInput />
                  </Tooltip>
                </GridItemCenterBottom>
              </ItemContainer>
            </AdditionContainer>
            {errors.quorumMaxChange && touched.quorumMaxChange ? <ErrorText>{errors.quorumMaxChange}</ErrorText> : null}
          </Grid>
        </Grid>
      </SpacingContainer>

      <SpacingContainer direction="row" container alignItems="center" justifyContent="space-between">
        <Grid container item direction="column" xs={12} sm={6}>
          <Typography variant="subtitle1" color="textSecondary" style={{ fontWeight: 400 }}>
            Max. Quorum Threshold
          </Typography>
          <Grid container direction="row" alignItems="center" style={{ marginTop: 14 }}>
            <AdditionContainer item xs={12} sm={6}>
              <ItemContainer container direction="row" alignItems="center" justifyContent="center">
                <GridItemCenter item xs={5}>
                  <Field
                    style={{ textAlign: "end" }}
                    name="maxQuorumAmount"
                    type="number"
                    onKeyDown={(e: FieldChange) => handleChange(e)}
                    placeholder="00"
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    component={TextField}
                    InputProps={{
                      endAdornment: <ValueText color="textSecondary">%</ValueText>
                    }}
                    onClick={() => setFieldTouched("maxQuorumAmount")}
                    // onChange={(e: any) => controlMaxFieldLimit("maxQuorumAmount", e)}
                  ></Field>
                </GridItemCenter>

                <GridItemCenterBottom item xs={7} container direction="row">
                  <Tooltip
                    placement="bottom"
                    title="Maximum value the quorum can change to after participation adjustment"
                  >
                    <InfoIconInputQuorum />
                  </Tooltip>
                </GridItemCenterBottom>
              </ItemContainer>
            </AdditionContainer>
            {errors.maxQuorumAmount && touched.maxQuorumAmount ? <ErrorText>{errors.maxQuorumAmount}</ErrorText> : null}
          </Grid>
        </Grid>
      </SpacingContainer>
    </>
  )
}

//TODO: Remove any from this component
export const Quorum: React.FC = () => {
  const { dispatch, state, updateCache } = useContext(CreatorContext)
  const { quorumSettings } = state.data
  const history = useHistory()

  const saveStepInfo = (values: QuorumSettings, { setSubmitting }: { setSubmitting: (b: boolean) => void }) => {
    const newState = {
      ...state.data,
      quorumSettings: values
    }
    updateCache(newState)
    setSubmitting(true)
    dispatch({ type: ActionTypes.UPDATE_QUORUM_SETTINGS, quorum: values })
    history.push(`summary`)
  }

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
        tooltipText={"Quorum"}
        tooltip={true}
        tooltipLink={"how-to-configure-your-dao-in-homebase/configure-proposal-and-voting"}
      ></TitleBlock>

      <Formik
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={false}
        validate={values => validateForm(values)}
        onSubmit={saveStepInfo}
        initialValues={quorumSettings}
      >
        {({ submitForm, isSubmitting, setFieldValue, values, errors, touched, setFieldTouched }) => {
          return (
            <Form style={{ width: "100%" }}>
              <QuorumForm
                submitForm={submitForm}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                values={values}
                setFieldTouched={setFieldTouched}
              />
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}
