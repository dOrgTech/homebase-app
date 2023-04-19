/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useEffect } from "react"
import { Grid, IconButton, styled, Typography, useMediaQuery, useTheme, withStyles } from "@material-ui/core"
import { Field, FieldArray, Form, Formik, FormikErrors } from "formik"
import { useHistory, useRouteMatch } from "react-router-dom"
import { DeploymentContext } from "../state/context"
import { ActionTypes, Holder, TokenDistributionSettings } from "../state/types"
import { TextField as FormikTextField } from "formik-material-ui"
import { AddCircleOutline, RemoveCircle } from "@material-ui/icons"
import BigNumber from "bignumber.js"
import { formatUnits, parseUnits } from "services/contracts/utils"
import { numberWithCommas } from "../state/utils"
import { useNotification } from "modules/common/hooks/useNotification"
import { TitleBlock } from "modules/common/TitleBlock"
import { FieldChange, handleChange } from "modules/creator/utils"

const SupplyContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.dark,
  padding: "30px 40px",
  borderRadius: 8
}))

const RemoveButton = styled(RemoveCircle)({
  marginTop: 0,
  cursor: "pointer"
})

const AmountText = styled(Typography)({
  fontWeight: 200
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
  height: 54,
  boxSizing: "border-box",
  marginTop: 14,
  background: "#2F3438",
  borderRadius: 8,
  alignItems: "center",
  display: "flex",
  padding: "13px 23px",
  width: "100%"
}))

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red"
})

const validateForm = (values: TokenDistributionSettings) => {
  const errors: FormikErrors<TokenDistributionSettings> = {}

  values.holders.forEach((holder: Holder, index: number) => {
    if (!values.holders[index].walletAddress || values.holders[index].amount === null) {
      errors.holders = "Required"
    }
  })

  return errors
}

const TokenSettingsForm = ({ submitForm, values, errors, touched, setFieldValue, setFieldTouched }: any) => {
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
                          ? { display: "inline-block", gap: 16, alignItems: "center" }
                          : { display: "flex", gap: 16, alignItems: "center" }
                      }
                    >
                      <CustomInputContainer>
                        <Field
                          type="text"
                          name={`holders.[${index}].walletAddress`}
                          placeholder={`Wallet address`}
                          component={CustomFormikTextField}
                        />
                      </CustomInputContainer>

                      <CustomInputContainer>
                        <Field
                          type="number"
                          onKeyDown={(e: FieldChange) => handleChange(e)}
                          inputProps={{ min: 0 }}
                          name={`holders.[${index}].amount`}
                          placeholder={`Amount`}
                          component={CustomFormikTextField}
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
                              ),
                            disableUnderline: true
                          }}
                        />
                      </CustomInputContainer>
                    </div>
                  ))
                : null}
              {errors.holders && touched.holders ? <ErrorText>{errors.holders}</ErrorText> : null}

              <div>
                <Grid container alignItems={"center"} style={{ gap: 10 }}>
                  <IconButton
                    size="small"
                    style={{ cursor: "pointer" }}
                    onClick={() => arrayHelpers.insert(values.holders.length, newValue)}
                  >
                    <AddCircleOutline htmlColor={theme.palette.secondary.main} />
                  </IconButton>
                  <Typography
                    variant={"body2"}
                    style={{ cursor: "pointer" }}
                    onClick={() => arrayHelpers.insert(values.holders.length, newValue)}
                    color={"secondary"}
                  >
                    Add Member
                  </Typography>
                </Grid>
              </div>
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
  const openNotification = useNotification()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const totalAmount = new BigNumber(Number(tokenSettings.totalSupply))

  const saveStepInfo = (
    values: TokenDistributionSettings,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    if (totalAmount.minus(new BigNumber(getTotal(values.holders))) < new BigNumber(0)) {
      openNotification({
        message: "Available balance has to be greater that the total supply",
        variant: "error",
        autoHideDuration: 2000
      })
      return
    }
    const newValues: TokenDistributionSettings = { ...values }
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
    <>
      <Grid container direction="column">
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
                <Grid>
                  <TitleBlock title="Initial token distribution" description={""}></TitleBlock>
                </Grid>

                <SupplyContainer item container direction="column" style={{ gap: "12px" }}>
                  <Grid container item direction="row" style={{ gap: 10 }}>
                    <AmountText color="textSecondary">Total supply: </AmountText>
                    <Typography color="secondary"> {numberWithCommas(totalAmount)} </Typography>
                  </Grid>
                  <Grid container item direction="row" style={{ gap: 10 }}>
                    <AmountText color="textSecondary">Available:</AmountText>
                    <Typography color="secondary">
                      {" "}
                      {numberWithCommas(totalAmount.minus(new BigNumber(getTotal(values.holders))))}
                    </Typography>
                  </Grid>
                </SupplyContainer>

                <Grid
                  container
                  direction={isMobile ? "column" : "row"}
                  alignItems={isMobile ? "flex-start" : "center"}
                  style={{ marginTop: 35 }}
                >
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Wallet address</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Amount</Typography>
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
              </Form>
            )
          }}
        </Formik>
      </Grid>
    </>
  )
}
