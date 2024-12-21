import { Form, FormikErrors } from "formik"
import { Formik } from "formik"
import { Box } from "@mui/material"
import { TitleBlock } from "modules/common/TitleBlock"
import {
  DescriptionText,
  SecondContainer,
  CustomInputContainer,
  InfoIconInput,
  TextareaContainer,
  MetadataContainer,
  CustomTextarea
} from "components/ui/DaoCreator"
import React from "react"
import { Link, TextField, withStyles } from "@material-ui/core"
import { Grid, Typography, useMediaQuery, useTheme, InputAdornment, Tooltip } from "@material-ui/core"

import { ErrorText } from "modules/creator/token/ui"
import { validateEvmTokenAddress } from "../utils"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"
import useEvmDaoCreateStore from "services/contracts/etherlinkDAO/hooks/useEvmDaoCreateStore"

const CustomFormikTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial"
    },
    "& .MuiInputBase-input": {
      textAlign: "initial"
    },
    "& .MuiInputBase-root": {
      textWeight: 300
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
})(TextField)

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
  const { data: daoData, setFieldValue, getIn } = useEvmDaoCreateStore()

  console.log({ daoData })

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
        {({ errors, touched }) => {
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
                      <CustomFormikTextField
                        name="name"
                        type="text"
                        placeholder="DAO Name"
                        // value={daoData?.name}
                        defaultValue={daoData?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          console.log("Setting DAO Name to", e.target.value)
                          setFieldValue("name", e.target.value)
                        }}
                      />
                    </CustomInputContainer>
                    {errors.name && touched.name ? <ErrorText>{errors.name}</ErrorText> : null}
                  </Grid>
                  <Grid item xs={isMobile ? 12 : 9}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {" "}
                      Ticker Symbol{" "}
                    </Typography>
                    <CustomInputContainer>
                      <CustomFormikTextField
                        name="governanceToken.symbol"
                        type="text"
                        placeholder="ETH"
                        defaultValue={daoData?.governanceToken.symbol}
                        inputProps={{ maxLength: 36 }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          console.log("Setting DAO Symbol to", e.target.value)
                          setFieldValue("governanceToken.symbol", e.target.value)
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
                      <CustomFormikTextField
                        name="governanceToken.tokenDecimals"
                        type="text"
                        placeholder="0"
                        defaultValue={daoData?.governanceToken.tokenDecimals}
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          console.log("Setting DAO Token Decimals to", e.target.value)
                          setFieldValue("governanceToken.tokenDecimals", e.target.value)
                        }}
                      />
                    </CustomInputContainer>
                    {errors.governanceToken?.tokenDecimals && touched.governanceToken?.tokenDecimals ? (
                      <ErrorText>{errors.governanceToken?.tokenDecimals}</ErrorText>
                    ) : null}
                  </Grid>
                </SecondContainer>
                <SecondContainer container direction="row" alignItems="center">
                  <Grid item xs={12} container alignItems="center">
                    <Typography variant="subtitle1" color="textSecondary" style={{ marginRight: 8 }}>
                      DAO Description
                      <Tooltip placement="bottom" title="Description info">
                        <InfoIcon />
                      </Tooltip>
                    </Typography>
                  </Grid>
                  <TextareaContainer item xs={12}>
                    <CustomTextarea
                      maxLength={1500}
                      style={{ width: "100%" }}
                      aria-label="empty textarea"
                      placeholder="Type a description"
                      defaultValue={getIn("description")}
                      onChange={(newValue: any) => {
                        setFieldValue("description", newValue.target.value)
                      }}
                    />
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
