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
import {
  Grid,
  styled,
  Typography,
  withStyles,
  TextareaAutosize,
  withTheme,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Tooltip
} from "@material-ui/core"

import { ErrorText } from "modules/creator/token/ui"
import { OrgSettings } from "modules/creator/state/types"
import { isInvalidEvmAddress, validateEvmTokenAddress } from "../utils"
import { InfoIcon } from "modules/explorer/components/styled/InfoIcon"

interface EvmDaoBasicsProps {
  // Add props as needed
}

const validateForm = (values: OrgSettings) => {
  const errors: FormikErrors<OrgSettings> = {}

  if (!values.name) {
    errors.name = "Required"
  }

  if (!values.symbol) {
    errors.symbol = "Required"
  }

  if (!values.description) {
    errors.description = "Required"
  }

  if (!values.guardian) {
    errors.guardian = "Required"
  }

  if (values.guardian && isInvalidEvmAddress(values.guardian)) {
    errors.guardian = "Invalid address"
  }

  if (!values.governanceToken.address) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Required"
    }
  }

  if (values.governanceToken.address && validateEvmTokenAddress(values.governanceToken.address)) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Invalid address"
    }
  }

  if (!values.governanceToken.tokenId) {
    errors.governanceToken = {
      ...errors.governanceToken,
      tokenId: "Required"
    }
  }

  if (!values.governanceToken.tokenMetadata) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Could not find token"
    }
  }

  if (values.governanceToken.tokenMetadata?.standard === "fa1.2") {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "FA1.2 Tokens Not Supported"
    }
  }

  return errors
}

export const EvmDaoBasics: React.FC<EvmDaoBasicsProps> = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const saveStepInfo = (values: OrgSettings, { setSubmitting }: { setSubmitting: (b: boolean) => void }) => {
    const newValues: OrgSettings = { ...values }
    // const newState = {
    //   ...state?.data,
    //   orgSettings: newValues
    // }

    setSubmitting(true)
    // dispatch({ type: ActionTypes.UPDATE_ORGANIZATION_SETTINGS, org: newValues })
    // history.push(`voting`)
  }

  const tokenMetadata = {
    name: "Test",
    symbol: "TEST"
  }
  const loading = false

  const orgSettings: OrgSettings = {
    name: "",
    symbol: "",
    description: "",
    administrator: "",
    guardian: "",
    governanceToken: { address: "", tokenId: "" }
  }

  return (
    <Box>
      <TitleBlock
        title="DAO Basics"
        description={
          <DescriptionText variant="subtitle1">
            These settings will define the name, symbol, and initial distribution of your token. You will need a
            pre-existing ERC20 token to use as governance token. To deploy your own governance token you can go{" "}
            <Link target="_blank" href="/creator/deployment/config" color="secondary">
              here
            </Link>{" "}
            and then come back.
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
                      Token Address{" "}
                    </Typography>
                    <CustomInputContainer>
                      <Field
                        id="outlined-basic"
                        placeholder="KT1...."
                        name="governanceToken.address"
                        component={CustomFormikTextField}
                        onClick={() => setFieldTouched("governanceToken.address")}
                        inputProps={{
                          maxLength: 36
                        }}
                      />
                    </CustomInputContainer>
                    {errors.governanceToken?.address && touched.governanceToken?.address ? (
                      <ErrorText>{errors.governanceToken?.address}</ErrorText>
                    ) : null}
                  </Grid>
                  <Grid item xs={isMobile ? 12 : 3}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {" "}
                      Token ID{" "}
                    </Typography>
                    <CustomInputContainer>
                      <Field
                        id="outlined-basic"
                        placeholder="0"
                        name="governanceToken.tokenId"
                        component={CustomFormikTextField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <Tooltip
                                placement="bottom"
                                title="Homebase will only track your governance token at a certain ID index, which is a parameter specified upon deploying the token contract. Fungible tokens usually have the ID of 0 (zero)."
                              >
                                <InfoIconInput />
                              </Tooltip>
                            </InputAdornment>
                          )
                        }}
                      />
                    </CustomInputContainer>
                    {errors.governanceToken?.tokenId && touched.governanceToken?.tokenId ? (
                      <ErrorText>{errors.governanceToken?.tokenId}</ErrorText>
                    ) : null}
                  </Grid>
                  {tokenMetadata && !loading && (
                    <MetadataContainer item xs={12}>
                      <Typography variant="subtitle2" color="secondary">
                        {tokenMetadata.name} ({tokenMetadata.symbol})
                      </Typography>
                    </MetadataContainer>
                  )}
                </SecondContainer>
                <SecondContainer item container direction="row" alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {" "}
                      Guardian Address{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInputContainer>
                      <Field
                        name="guardian"
                        type="text"
                        placeholder="tz1PXn...."
                        component={CustomFormikTextField}
                        onClick={() => setFieldTouched("guardian")}
                        inputProps={{
                          maxLength: 36
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <Tooltip
                                placement="bottom"
                                title="Address that can drop/cancel any proposals, Should be a contract like multisig or another DAO"
                              >
                                <InfoIconInput color="secondary" />
                              </Tooltip>
                            </InputAdornment>
                          )
                        }}
                      ></Field>
                    </CustomInputContainer>
                    {errors.guardian && touched.guardian ? <ErrorText>{errors.guardian}</ErrorText> : null}
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
