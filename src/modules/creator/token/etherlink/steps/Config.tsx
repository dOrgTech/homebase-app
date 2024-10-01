import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Field, Form, Formik, FormikErrors, getIn } from "formik"
import React, { useContext, useEffect } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { DeploymentContext } from "../state/context"
import { ActionTypes, TokenContractSettings } from "../state/types"
import { FieldChange, handleChange, handleNegativeInput } from "modules/creator/utils"
import {
  Title,
  CustomTextarea,
  CustomFormikTextField,
  CustomInputContainer,
  ErrorText,
  TextareaContainer
} from "../../ui"

const validateForm = (values: TokenContractSettings) => {
  const errors: FormikErrors<TokenContractSettings> = {}

  if (!values.name) {
    errors.name = "Required"
  }

  // if (!values.description) {
  //   errors.description = "Required"
  // }

  if (!values.totalSupply || values.totalSupply === null) {
    errors.totalSupply = "Required"
  }

  if (!values.decimals || values.decimals === null) {
    errors.decimals = "Required"
  }

  if (!values.symbol) {
    errors.symbol = "Required"
  }

  return errors
}

const TokenSettingsForm = ({ submitForm, values, errors, touched, setFieldValue }: any) => {
  const { dispatch } = useContext(DeploymentContext)
  const match = useRouteMatch()
  const history = useHistory()
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (values) {
      dispatch({
        type: ActionTypes.UPDATE_NAVIGATION_BAR,
        next: {
          handler: () => {
            submitForm(values)
          },
          text: "Continue"
        },
        back: {
          text: "Back",
          handler: () => history.push("/creator/ownership")
        }
      })
    }
  }, [dispatch, errors, history, match.path, match.url, submitForm, values])

  return (
    <>
      <Grid item xs={12} container direction="row" style={{ gap: 32 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            {" "}
            Contract Name{" "}
          </Typography>
          <CustomInputContainer>
            <Field id="outlined-basic" placeholder="Contract Name" name="name" component={CustomFormikTextField} />
          </CustomInputContainer>
          {errors.name && touched.name ? <ErrorText>{errors.name}</ErrorText> : null}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            {" "}
            Description{" "}
          </Typography>

          {/* <TextareaContainer item xs={12}>
            <Field name="description">
              {() => (
                <CustomTextarea
                  maxLength={1500}
                  aria-label="empty textarea"
                  placeholder="Type a description"
                  value={getIn(values, "description")}
                  onChange={(newValue: any) => {
                    setFieldValue("description", newValue.target.value)
                  }}
                />
              )}
            </Field>
          </TextareaContainer>
          {errors.description && touched.description ? <ErrorText>{errors.description}</ErrorText> : null} */}
        </Grid>
        <Grid item container direction="row" spacing={2}>
          <Grid item xs={isMobileSmall ? 12 : 6}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Supply{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                id="outlined-basic"
                type="number"
                placeholder="0"
                name="totalSupply"
                component={CustomFormikTextField}
                onKeyDown={(e: FieldChange) => handleNegativeInput(e)}
              />
            </CustomInputContainer>
            {errors.totalSupply && touched.totalSupply ? <ErrorText>{errors.totalSupply}</ErrorText> : null}
          </Grid>
          <Grid item xs={isMobileSmall ? 12 : 3}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Decimals{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                id="outlined-basic"
                type="number"
                placeholder="0"
                name="decimals"
                component={CustomFormikTextField}
                onKeyDown={(e: FieldChange) => handleChange(e)}
              />
            </CustomInputContainer>
            {errors.decimals && touched.decimals ? <ErrorText>{errors.decimals}</ErrorText> : null}
          </Grid>
        </Grid>

        <Grid item container direction="row" spacing={2}>
          {/* <Grid item xs={isMobileSmall ? 12 : 6}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Icon{" "}
            </Typography>
            <CustomInputContainer>
              <Field id="outlined-basic" placeholder="URL" name="icon" component={CustomFormikTextField} />
            </CustomInputContainer>
          </Grid> */}
          <Grid item xs={isMobileSmall ? 12 : 3}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Symbol{" "}
            </Typography>
            <CustomInputContainer>
              <Field id="outlined-basic" placeholder="TEZ" name="symbol" component={CustomFormikTextField} />
            </CustomInputContainer>
            {errors.symbol && touched.symbol ? <ErrorText>{errors.symbol}</ErrorText> : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export const ConfigContract: React.FC = () => {
  const { state, dispatch, updateCache } = useContext(DeploymentContext)
  const { tokenSettings } = state.data
  const history = useHistory()

  const saveStepInfo = (values: TokenContractSettings, { setSubmitting }: { setSubmitting: (b: boolean) => void }) => {
    const newValues: TokenContractSettings = { ...values }
    const newState = {
      ...state.data,
      tokenSettings: newValues
    }
    updateCache(newState)
    setSubmitting(true)
    dispatch({ type: ActionTypes.UPDATE_TOKEN_SETTINGS, contractInfo: newValues })
    history.push(`distribution`)
  }

  return (
    <>
      <Grid container direction="column">
        <Grid>
          <Title style={{ marginBottom: 32 }} color="textSecondary">
            Configure Etherlink Token Contract
          </Title>
        </Grid>

        <Formik
          enableReinitialize={true}
          validateOnChange={true}
          validateOnBlur={false}
          validate={validateForm}
          onSubmit={saveStepInfo}
          initialValues={tokenSettings}
        >
          {({ submitForm, isSubmitting, setFieldValue, values, errors, touched, setFieldTouched }) => {
            return (
              <Form style={{ width: "100%" }}>
                <TokenSettingsForm
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
      </Grid>
    </>
  )
}
