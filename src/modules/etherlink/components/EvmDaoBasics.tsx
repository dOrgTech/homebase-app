import { Field, Form, FormikErrors, getIn } from "formik"
import { Formik } from "formik"
import { Box } from "@mui/material"
import { TitleBlock } from "modules/common/TitleBlock"
import {
  DescriptionText,
  SecondContainer,
  CustomInputContainer,
  CustomFormikTextField,
  InfoIconInput,
  TextareaContainer,
  MetadataContainer,
  CustomTextarea
} from "components/ui/DaoCreator"
import React from "react"
import { Link } from "@material-ui/core"
import { Grid, Typography, useMediaQuery, useTheme, InputAdornment, Tooltip } from "@material-ui/core"

import { ErrorText } from "modules/creator/token/ui"
import { validateEvmTokenAddress } from "../utils"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"

interface EvmDaoBasicsProps {
  // Add props as needed
}

type EvmDaoSettings = {
  name: string
  symbol: string
  description: string
  administrator: string
  guardian: string
  governanceToken: {
    address?: string
    symbol: string
    tokenSymbol: string
    tokenDecimals: number
  }
}

const validateForm = (values: EvmDaoSettings) => {
  const errors: FormikErrors<EvmDaoSettings> = {}

  if (!values.name) {
    errors.name = "Required"
  }

  if (!values.symbol) {
    errors.symbol = "Required"
  }

  if (!values.description) {
    errors.description = "Required"
  }

  if (!values.governanceToken.address) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Required"
    }
  }

  if (
    values.governanceToken.symbol &&
    (values.governanceToken.symbol.length > 4 || values.governanceToken.symbol.length < 2)
  ) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Invalid Symbol"
    }
  }

  if (!values.governanceToken.tokenDecimals) {
    errors.governanceToken = {
      ...errors.governanceToken,
      tokenDecimals: "Required"
    }
  }

  return errors
}

export const EvmDaoBasics: React.FC<EvmDaoBasicsProps> = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const saveStepInfo = (values: EvmDaoSettings, { setSubmitting }: { setSubmitting: (b: boolean) => void }) => {
    const newValues: EvmDaoSettings = { ...values }
    // const newState = {
    //   ...state?.data,
    //   orgSettings: newValues
    // }

    setSubmitting(true)
    // dispatch({ type: ActionTypes.UPDATE_ORGANIZATION_SETTINGS, org: newValues })
    // history.push(`voting`)
  }

  const orgSettings: EvmDaoSettings = {
    name: "",
    symbol: "",
    description: "",
    administrator: "",
    guardian: "",
    governanceToken: { address: "", symbol: "", tokenDecimals: 0, tokenSymbol: "" }
  }

  return (
    <Box>
      <TitleBlock
        title="DAO Basics"
        description={
          <DescriptionText variant="subtitle1">
            These settings will define the name, symbol, and initial distribution of your DAO along with the ERC20
            token.
          </DescriptionText>
        }
      ></TitleBlock>

      <Formik
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={true}
        validate={validateForm}
        onSubmit={saveStepInfo}
        initialValues={orgSettings}
      >
        {({ submitForm, isSubmitting, setFieldValue, values, errors, touched, setFieldTouched }) => {
          return (
            <Form style={{ width: "100%" }}>
              <>
                <SecondContainer container item direction="row" spacing={2} wrap="wrap">
                  <Grid item xs={isMobile ? 12 : 12}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {" "}
                      DAO Name{" "}
                    </Typography>
                    <CustomInputContainer>
                      <Field
                        name="name"
                        inputProps={{ maxLength: 18 }}
                        type="text"
                        placeholder="DAO Name"
                        component={CustomFormikTextField}
                      ></Field>
                    </CustomInputContainer>
                    {errors.name && touched.name ? <ErrorText>{errors.name}</ErrorText> : null}
                  </Grid>
                  <Grid item xs={isMobile ? 12 : 9}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {" "}
                      Ticker Symbol{" "}
                    </Typography>
                    <CustomInputContainer>
                      <Field
                        id="outlined-basic"
                        placeholder="ETH"
                        name="governanceToken.symbol"
                        component={CustomFormikTextField}
                        onClick={() => setFieldTouched("governanceToken.symbol")}
                        inputProps={{
                          maxLength: 36
                        }}
                      />
                    </CustomInputContainer>
                    {errors.governanceToken?.symbol && touched.governanceToken?.symbol ? (
                      <ErrorText>{errors.governanceToken?.symbol}</ErrorText>
                    ) : null}
                  </Grid>
                  <Grid item xs={isMobile ? 12 : 3}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {" "}
                      Token Decimals{" "}
                    </Typography>
                    <CustomInputContainer>
                      <Field
                        id="outlined-basic"
                        placeholder="0"
                        name="governanceToken.tokenDecimals"
                        component={CustomFormikTextField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <Tooltip
                                placement="bottom"
                                title="Token Decimals for the ERC20 token deployed with this DAO"
                              >
                                <InfoIconInput />
                              </Tooltip>
                            </InputAdornment>
                          )
                        }}
                      />
                    </CustomInputContainer>
                    {errors.governanceToken?.tokenDecimals && touched.governanceToken?.tokenDecimals ? (
                      <ErrorText>{errors.governanceToken?.tokenDecimals}</ErrorText>
                    ) : null}
                  </Grid>
                </SecondContainer>
                <SecondContainer container direction="row" alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                      DAO Description
                    </Typography>
                  </Grid>
                  <TextareaContainer item xs={12}>
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
                    <Tooltip placement="bottom" title="Description info">
                      <InfoIcon />
                    </Tooltip>
                  </TextareaContainer>
                  {errors.description && touched.description ? <ErrorText>{errors.description}</ErrorText> : null}
                </SecondContainer>
              </>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}
