/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Grid, IconButton, styled, Typography, useMediaQuery, useTheme, withStyles } from "@material-ui/core"
import { Field, FieldArray, Form, Formik, FormikErrors } from "formik"
import React, { useContext, useEffect } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import { DeploymentContext } from "../state/context"
import { ActionTypes, Holder, TokenContractSettings, TokenDistributionSettings } from "../state/types"
import { TextField as FormikTextField } from "formik-material-ui"
import { RemoveCircleOutline } from "@material-ui/icons"
import BigNumber from "bignumber.js"
import { numberWithCommas } from "../state/utils"
import { useTezos } from "services/beacon/hooks/useTezos"
import { FieldChange, handleNegativeInput } from "modules/creator/utils"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { validateContractAddress, validateAddress } from "@taquito/utils"

const RemoveButton = styled(RemoveCircleOutline)({
  marginTop: 0,
  fontSize: 18
})

const AmountText = styled(Typography)({
  fontWeight: 400
})

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
})(FormikTextField)

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  "height": 54,
  "boxSizing": "border-box",
  "marginTop": 14,
  "background": "#2F3438",
  "borderRadius": 8,
  "alignItems": "center",
  "display": "flex",
  "padding": "13px 23px",
  "width": "85%",
  "fontWeight": 300,
  "& input::placeholder": {
    fontWeight: 300
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}))

const CustomAmountContainer = styled(Grid)(({ theme }) => ({
  "height": 54,
  "boxSizing": "border-box",
  "marginTop": 14,
  "background": "#2F3438",
  "borderRadius": 8,
  "alignItems": "center",
  "display": "flex",
  "padding": "13px 23px",
  "width": "45%",
  "& input::placeholder": {
    fontWeight: 300
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}))

const AddButtonContainer = styled(Grid)(({ theme }) => ({
  "height": 54,
  "boxSizing": "border-box",
  "marginTop": 14,
  "alignItems": "center",
  "display": "flex",
  "padding": "0px 0px",
  "width": "15%",
  "& input::placeholder": {
    fontWeight: 300
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}))

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
  marginTop: 4
})

const isInvalidKtOrTzAddress = (address: string) =>
  validateContractAddress(address) !== 3 && validateAddress(address) !== 3

const hasDuplicates = (options: Holder[]) => {
  const trimOptions = options.map(option => option.walletAddress.trim())
  return new Set(trimOptions).size !== trimOptions.length
}

const validateForm = (values: TokenDistributionSettings) => {
  const errors: FormikErrors<TokenDistributionSettings> = {}

  values.holders.forEach((holder: Holder, index: number) => {
    if (values.holders[index].walletAddress && !values.holders[index].amount) {
      errors.holders = "Required"
    }
    if (!values.holders[index].walletAddress && values.holders[index].amount) {
      errors.holders = "Required"
    }
    if (values.holders.length > 0 && hasDuplicates(values.holders)) {
      errors.holders = "Duplicate wallets are not allowed"
    }
    if (values.totalAmount && values.totalAmount.minus(new BigNumber(getTotal(values.holders))) < new BigNumber(0)) {
      errors.totalAmount = "Available balance has to be greater that the total supply"
    }
    if (values.totalAmount && values.totalAmount.gt(new BigNumber(getTotal(values.holders)))) {
      errors.totalAmount = "Total Supply not fully allocated"
    }
    if (isInvalidKtOrTzAddress(values.holders[index].walletAddress)) {
      errors.holders = "Invalid address"
    }
  })

  return errors
}

const TokenSettingsForm = ({ submitForm, values, errors, touched }: any) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const newValue: Holder = { walletAddress: "", amount: null }

  const { dispatch } = useContext(DeploymentContext)
  const match = useRouteMatch()
  const history = useHistory()

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
          handler: () => history.push(`config`)
        }
      })
    }
  }, [dispatch, errors, history, match.path, match.url, submitForm, values])

  return (
    <>
      <Grid container direction="column">
        <FieldArray
          name="holders"
          render={arrayHelpers => (
            <div>
              {values.holders && values.holders.length > 0
                ? values.holders.map((holder: any, index: number) => (
                    <div
                      key={index}
                      style={
                        isMobile
                          ? { gap: 16, alignItems: "center" }
                          : { display: "flex", gap: 16, alignItems: "center" }
                      }
                    >
                      {isMobile ? <Typography color="textSecondary">Wallet address</Typography> : null}

                      <CustomInputContainer>
                        <Field
                          type="text"
                          name={`holders.[${index}].walletAddress`}
                          placeholder={`Wallet address`}
                          component={CustomFormikTextField}
                        />
                      </CustomInputContainer>

                      {isMobile ? (
                        <Typography color="textSecondary" style={{ marginTop: 8 }}>
                          Amount
                        </Typography>
                      ) : null}

                      <CustomAmountContainer>
                        <Field
                          type="number"
                          name={`holders.[${index}].amount`}
                          placeholder={`0`}
                          component={CustomFormikTextField}
                          onKeyDown={(e: FieldChange) => handleNegativeInput(e)}
                          InputProps={{
                            endAdornment:
                              index !== 0 ? (
                                <RemoveButton
                                  color="error"
                                  onClick={() => {
                                    if (index !== 0) {
                                      arrayHelpers.remove(index)
                                    }
                                  }}
                                />
                              ) : (
                                <RemoveButton color="error" style={{ visibility: "hidden" }} />
                              )
                          }}
                        />
                      </CustomAmountContainer>
                      <AddButtonContainer>
                        {index === values.holders.length - 1 ? (
                          <Grid
                            direction="row"
                            container
                            justifyContent={isMobile ? "flex-start" : "flex-end"}
                            alignItems={"center"}
                            style={{ gap: 8 }}
                          >
                            <IconButton
                              style={{ cursor: "pointer", padding: 0 }}
                              onClick={() => arrayHelpers.insert(values.holders.length, newValue)}
                            >
                              <AddCircleIcon
                                style={{ cursor: "pointer", fontSize: 18 }}
                                htmlColor={theme.palette.secondary.main}
                              />
                            </IconButton>
                            <Typography
                              variant={"body1"}
                              style={{ cursor: "pointer" }}
                              onClick={() => arrayHelpers.insert(values.holders.length, newValue)}
                              color={"secondary"}
                            >
                              Add
                            </Typography>
                          </Grid>
                        ) : null}
                      </AddButtonContainer>
                    </div>
                  ))
                : null}
              {errors.holders && touched.holders ? <ErrorText>{errors.holders}</ErrorText> : null}
            </div>
          )}
        />
      </Grid>
    </>
  )
}

const getTotal = (holders: Holder[]) => {
  let total = 0
  holders.forEach(holder => (total += Number(holder.amount)))
  return total
}

export const ContractDistribution: React.FC = () => {
  const { state, dispatch, updateCache } = useContext(DeploymentContext)
  const { tokenDistribution, tokenSettings } = state.data
  const history = useHistory()
  const { account } = useTezos()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  tokenDistribution.totalAmount = new BigNumber(Number(tokenSettings.totalSupply))

  const saveStepInfo = (
    values: TokenDistributionSettings,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    const newValues: TokenDistributionSettings = { ...values }

    if (newValues.holders.length === 1 && newValues.holders[0].walletAddress === "") {
      newValues.holders[0].walletAddress = account
      newValues.holders[0].amount = newValues.totalAmount.toNumber()
    }

    const newState = {
      ...state.data,
      tokenDistribution: newValues
    }
    updateCache(newState)
    setSubmitting(true)
    dispatch({ type: ActionTypes.UPDATE_TOKEN_DISTRIBUTION, distribution: newValues })
    history.push(`summary`)
  }

  return (
    <Grid container direction="column">
      <Grid>
        <Typography style={{ marginBottom: 32 }} variant="h5" color="textSecondary">
          Initial Token Distribution
        </Typography>
      </Grid>
      <Formik
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={false}
        validate={validateForm}
        onSubmit={saveStepInfo}
        initialValues={tokenDistribution}
      >
        {({ submitForm, isSubmitting, setFieldValue, values, errors, touched, setFieldTouched }) => {
          return (
            <Form style={{ width: "100%" }}>
              <Grid container>
                <Grid xs={12} item container direction="column" style={{ gap: "12px" }}>
                  <Grid container item direction="row" style={{ gap: 10 }}>
                    <AmountText variant="subtitle1" color="textSecondary">
                      Total supply:{" "}
                    </AmountText>
                    <Typography color="secondary" style={{ fontWeight: 300 }}>
                      {" "}
                      {numberWithCommas(values.totalAmount)}{" "}
                    </Typography>
                  </Grid>
                  <Grid container item direction="row" style={{ gap: 10 }}>
                    <AmountText variant="subtitle1" color="textSecondary">
                      Available:
                    </AmountText>
                    <Typography style={{ fontWeight: 300 }} color="secondary">
                      {" "}
                      {numberWithCommas(
                        values.totalAmount && values.totalAmount.minus(new BigNumber(getTotal(values.holders)))
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                {errors.totalAmount && touched.totalAmount ? (
                  <ErrorText style={{ marginTop: 6 }}>{errors.totalAmount}</ErrorText>
                ) : null}

                <Grid
                  container
                  direction={!isMobile ? "row" : "row"}
                  alignItems={!isMobile ? "flex-start" : "center"}
                  style={!isMobile ? { marginTop: 35 } : { visibility: "hidden" }}
                >
                  <Grid item xs={isMobile ? 12 : 7}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Wallet Address
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color="textSecondary">
                      Amount
                    </Typography>
                  </Grid>
                </Grid>
                <TokenSettingsForm
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  values={values}
                  setFieldTouched={setFieldTouched}
                />
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </Grid>
  )
}
