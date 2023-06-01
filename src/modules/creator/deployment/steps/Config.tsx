import {
  Grid,
  styled,
  TextareaAutosize,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,
  withTheme
} from "@material-ui/core"
import { Field, Form, Formik, FormikErrors, getIn } from "formik"
import React, { useContext, useEffect } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { DeploymentContext } from "../state/context"
import { ActionTypes, TokenContractSettings } from "../state/types"
import { TextField as FormikTextField } from "formik-material-ui"
import { SmallButton } from "modules/common/SmallButton"
import { TitleBlock } from "modules/common/TitleBlock"
import { FieldChange, handleChange, handleNegativeInput } from "modules/creator/utils"

const ButtonContainer = styled(Grid)({
  marginTop: 40
})

const CustomTextarea = styled(withTheme(TextareaAutosize))(props => ({
  "minHeight": 152,
  "boxSizing": "border-box",
  "width": "100%",
  "marginTop": 14,
  "fontWeight": 400,
  "padding": "21px 20px",
  "fontFamily": "Roboto Mono",
  "border": "none",
  "fontSize": 16,
  "color": props.theme.palette.text.secondary,
  "background": "#2F3438",
  "borderRadius": 8,
  "paddingRight": 40,
  "wordBreak": "break-word",
  "&:focus-visible": {
    outline: "none"
  },
  "resize": "none"
}))

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
  },
  disabled: {}
})(FormikTextField)

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  height: 54,
  boxSizing: "border-box",
  marginTop: 14,
  background: "#2F3438",
  borderRadius: 8,
  alignItems: "center",
  display: "flex",
  padding: "13px 23px"
}))

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red"
})

const TextareaContainer = styled(Grid)({
  display: "flex",
  position: "relative"
})

const validateForm = (values: TokenContractSettings) => {
  const errors: FormikErrors<TokenContractSettings> = {}

  if (!values.name) {
    errors.name = "Required"
  }

  if (!values.description) {
    errors.description = "Required"
  }

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

const TokenSettingsForm = ({ submitForm, values, errors, touched, setFieldValue, setFieldTouched }: any) => {
  const { dispatch } = useContext(DeploymentContext)
  const match = useRouteMatch()
  const history = useHistory()

  useEffect(() => {
    if (values) {
      dispatch({
        type: ActionTypes.UPDATE_NAVIGATION_BAR,
        next: {
          handler: () => {
            submitForm(values)
          },
          text: "Continue"
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
            Contract name{" "}
          </Typography>
          <CustomInputContainer>
            <Field id="outlined-basic" placeholder="Contract name" name="name" component={CustomFormikTextField} />
          </CustomInputContainer>
          {errors.name && touched.name ? <ErrorText>{errors.name}</ErrorText> : null}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" color="textSecondary">
            {" "}
            Description{" "}
          </Typography>

          <TextareaContainer item xs={12}>
            <Field name="description">
              {() => (
                <CustomTextarea
                  maxLength={1500}
                  aria-label="empty textarea"
                  placeholder="Description"
                  value={getIn(values, "description")}
                  onChange={(newValue: any) => {
                    setFieldValue("description", newValue.target.value)
                  }}
                />
              )}
            </Field>
          </TextareaContainer>
          {errors.description && touched.description ? <ErrorText>{errors.description}</ErrorText> : null}
        </Grid>
        <Grid item container direction="row" spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Supply{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                id="outlined-basic"
                type="number"
                placeholder="Supply"
                name="totalSupply"
                component={CustomFormikTextField}
                onKeyDown={(e: FieldChange) => handleNegativeInput(e)}
              />
            </CustomInputContainer>
            {errors.totalSupply && touched.totalSupply ? <ErrorText>{errors.totalSupply}</ErrorText> : null}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Decimals{" "}
            </Typography>
            <CustomInputContainer>
              <Field
                id="outlined-basic"
                type="number"
                placeholder="Decimals"
                name="decimals"
                component={CustomFormikTextField}
                onKeyDown={(e: FieldChange) => handleChange(e)}
              />
            </CustomInputContainer>
            {errors.decimals && touched.decimals ? <ErrorText>{errors.decimals}</ErrorText> : null}
          </Grid>
        </Grid>

        <Grid item container direction="row" spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Symbol{" "}
            </Typography>
            <CustomInputContainer>
              <Field id="outlined-basic" placeholder="Symbol" name="symbol" component={CustomFormikTextField} />
            </CustomInputContainer>
            {errors.symbol && touched.symbol ? <ErrorText>{errors.symbol}</ErrorText> : null}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="textSecondary">
              {" "}
              Icon{" "}
            </Typography>
            <CustomInputContainer>
              <Field id="outlined-basic" placeholder="Icon" name="icon" component={CustomFormikTextField} />
            </CustomInputContainer>
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
          <TitleBlock title="Configure token contract" description={""}></TitleBlock>
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
