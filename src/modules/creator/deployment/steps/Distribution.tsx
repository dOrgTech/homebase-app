/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Grid, IconButton, styled, Typography, useMediaQuery, useTheme, withStyles, withTheme } from "@material-ui/core"
import { Field, FieldArray, Form, Formik, FormikErrors, getIn } from "formik"
import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import { DeploymentContext } from "../state/context"
import { ActionTypes, Holder, TokenContractSettings, TokenDistributionSettings } from "../state/types"
import { TextField as FormikTextField } from "formik-material-ui"
import { SmallButton } from "modules/common/SmallButton"
import { AddCircleOutline, RemoveCircle } from "@material-ui/icons"
import BigNumber from "bignumber.js"
import { parseUnits } from "services/contracts/utils"
import { numberWithCommas } from "../state/utils"

const Title = styled(Typography)({
  fontSize: 24,
  marginBottom: 20
})

const RemoveButton = styled(RemoveCircle)({
  marginTop: 13
})

const FormContainer = styled(Grid)(({ theme }) => ({
  paddingLeft: "20%",
  paddingRight: "20%",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "2%",
    paddingRight: "2%"
  }
}))

const AmountText = styled(Typography)({
  fontWeight: 200
})

const ButtonContainer = styled(Grid)({
  marginTop: 40
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
  const history = useHistory()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const newValue: Holder = { walletAddress: "", amount: null }

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
                          name={`holders.[${index}].amount`}
                          placeholder={`Amount`}
                          component={CustomFormikTextField}
                        />
                      </CustomInputContainer>

                      {index !== 0 ? (
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
                      )}
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
      <Grid container direction="row" justifyContent="flex-end">
        <SmallButton color="secondary" variant="contained" style={{ fontSize: "14px" }} onClick={submitForm}>
          Continue
        </SmallButton>
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

  const totalAmount = parseUnits(new BigNumber(Number(tokenSettings.totalSupply)), Number(tokenSettings.decimals))

  const saveStepInfo = (
    values: TokenDistributionSettings,
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    const newValues: TokenDistributionSettings = { ...values }
    const newState = {
      ...state.data,
      tokenDistribution: newValues
    }
    console.log(newState)
    updateCache(newState)
    setSubmitting(true)
    dispatch({ type: ActionTypes.UPDATE_TOKEN_DISTRIBUTION, distribution: newValues })
    history.push(`token-summary`)
  }

  return (
    <>
      <FormContainer container direction="column">
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
                  <Title color="textSecondary">Initial token distribution</Title>
                </Grid>

                <Grid item container direction="column" style={{ gap: "12px" }}>
                  <Grid item direction="row">
                    <AmountText color="textSecondary">Total supply: {numberWithCommas(totalAmount)} </AmountText>
                  </Grid>
                  <Grid item direction="row">
                    <AmountText color="textSecondary">
                      Available: {numberWithCommas(totalAmount.minus(new BigNumber(getTotal(values.holders))))}
                    </AmountText>
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
      </FormContainer>
    </>
  )
}
