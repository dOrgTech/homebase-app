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
  CustomTextarea
} from "components/ui/DaoCreator"
import React from "react"
import { TextField, withStyles } from "@material-ui/core"
import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Tooltip,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  makeStyles
} from "@material-ui/core"

import { ErrorText } from "modules/creator/token/ui"
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

const useRadioStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  icon: {
    "width": 24,
    "height": 24,
    "borderRadius": "50%",
    "backgroundColor": "#2F3438",
    "border": "2px solid #fff",

    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)"
    }
  },
  checkedIcon: {
    "&:before": {
      borderRadius: "50%",
      display: "block",
      width: 24,
      height: 24,
      background: "radial-gradient(#81FEB7,#81FEB7 27%,#2F3438 27%)",
      content: '""'
    }
  }
})

interface EvmDaoBasicsProps {
  // Add props as needed
}

type EvmDaoSettings = {
  name: string
  symbol: string
  description: string
  administrator: string
  guardian: string
  nonTransferable: boolean
  tokenDeploymentMechanism: "new" | "wrapped"
  underlyingTokenAddress?: string
  wrappedTokenSymbol?: string
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

  if (!values.description) {
    errors.description = "Required"
  }

  if (values.tokenDeploymentMechanism === "new") {
    if (!values.governanceToken.symbol) {
      errors.governanceToken = {
        ...errors.governanceToken,
        symbol: "Required"
      }
    }

    if (
      values.governanceToken.symbol &&
      (values.governanceToken.symbol.length > 7 || values.governanceToken.symbol.length < 2)
    ) {
      errors.governanceToken = {
        ...errors.governanceToken,
        symbol: "Invalid Symbol (2-7 characters)"
      }
    }

    if (!values.governanceToken.tokenDecimals || values.governanceToken.tokenDecimals < 1) {
      errors.governanceToken = {
        ...errors.governanceToken,
        tokenDecimals: "Required (minimum 1)"
      }
    }
  } else if (values.tokenDeploymentMechanism === "wrapped") {
    if (!values.underlyingTokenAddress) {
      errors.underlyingTokenAddress = "Required"
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(values.underlyingTokenAddress)) {
      errors.underlyingTokenAddress = "Invalid Ethereum address format"
    }

    if (!values.wrappedTokenSymbol) {
      errors.wrappedTokenSymbol = "Required"
    } else if (values.wrappedTokenSymbol.length > 7 || values.wrappedTokenSymbol.length < 2) {
      errors.wrappedTokenSymbol = "Invalid Symbol (2-7 characters)"
    }
  }

  return errors
}

export const EvmDaoBasics: React.FC<EvmDaoBasicsProps> = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { data: daoData, setFieldValue, getIn } = useEvmDaoCreateStore()
  const radioClasses = useRadioStyles()

  const saveStepInfo = (values: EvmDaoSettings, { setSubmitting }: { setSubmitting: (b: boolean) => void }) => {
    // const newValues: EvmDaoSettings = { ...values }

    setSubmitting(true)
  }

  const orgSettings: EvmDaoSettings = {
    name: daoData?.name || "",
    symbol: daoData?.symbol || "",
    description: daoData?.description || "",
    administrator: daoData?.administrator || "",
    guardian: daoData?.guardian || "",
    nonTransferable: daoData?.nonTransferable !== undefined ? daoData.nonTransferable : true,
    tokenDeploymentMechanism: daoData?.tokenDeploymentMechanism || "new",
    underlyingTokenAddress: daoData?.underlyingTokenAddress || "",
    wrappedTokenSymbol: daoData?.wrappedTokenSymbol || "",
    governanceToken: daoData?.governanceToken || { address: "", symbol: "", tokenDecimals: 0, tokenSymbol: "" }
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
        {({ errors, touched, values }) => {
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
                        defaultValue={daoData?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("name", e.target.value)
                        }}
                      />
                    </CustomInputContainer>
                    {errors.name && touched.name ? <ErrorText>{errors.name}</ErrorText> : null}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary" style={{ marginBottom: 16 }}>
                      Governance Token Type
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="token-deployment-mechanism"
                        name="tokenDeploymentMechanism"
                        value={values.tokenDeploymentMechanism}
                        onChange={e => {
                          setFieldValue("tokenDeploymentMechanism", e.target.value)
                          // Clear relevant fields when switching
                          if (e.target.value === "new") {
                            setFieldValue("underlyingTokenAddress", "")
                            setFieldValue("wrappedTokenSymbol", "")
                          } else {
                            setFieldValue("governanceToken.symbol", "")
                            setFieldValue("governanceToken.tokenDecimals", 0)
                          }
                        }}
                      >
                        <FormControlLabel
                          value="new"
                          control={
                            <Radio
                              className={radioClasses.root}
                              checked={values.tokenDeploymentMechanism === "new"}
                              disableRipple
                              checkedIcon={<span className={`${radioClasses.icon} ${radioClasses.checkedIcon}`} />}
                              icon={<span className={radioClasses.icon} />}
                            />
                          }
                          label={
                            <Box>
                              <Typography
                                style={{
                                  color:
                                    values.tokenDeploymentMechanism === "new" ? theme.palette.secondary.main : "#fff",
                                  fontWeight: values.tokenDeploymentMechanism === "new" ? 700 : 400
                                }}
                              >
                                Deploy new standard token
                              </Typography>
                              <Typography variant="caption" style={{ color: "#fff" }}>
                                Create a new ERC20 governance token
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="wrapped"
                          control={
                            <Radio
                              className={radioClasses.root}
                              checked={values.tokenDeploymentMechanism === "wrapped"}
                              disableRipple
                              checkedIcon={<span className={`${radioClasses.icon} ${radioClasses.checkedIcon}`} />}
                              icon={<span className={radioClasses.icon} />}
                            />
                          }
                          label={
                            <Box>
                              <Typography
                                style={{
                                  color:
                                    values.tokenDeploymentMechanism === "wrapped"
                                      ? theme.palette.secondary.main
                                      : "#fff",
                                  fontWeight: values.tokenDeploymentMechanism === "wrapped" ? 700 : 400
                                }}
                              >
                                Wrap existing ERC20 token
                              </Typography>
                              <Typography variant="caption" style={{ color: "#fff" }}>
                                Use an existing token for governance
                              </Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {values.tokenDeploymentMechanism === "new" ? (
                    <>
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
                            value={values.governanceToken?.symbol || ""}
                            inputProps={{ maxLength: 7 }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("governanceToken.symbol", e.target.value.toUpperCase())
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
                            type="number"
                            placeholder="18"
                            value={values.governanceToken?.tokenDecimals || ""}
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
                              setFieldValue("governanceToken.tokenDecimals", parseInt(e.target.value) || 0)
                            }}
                          />
                        </CustomInputContainer>
                        {errors.governanceToken?.tokenDecimals && touched.governanceToken?.tokenDecimals ? (
                          <ErrorText>{errors.governanceToken?.tokenDecimals}</ErrorText>
                        ) : null}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={isMobile ? 12 : 12}>
                        <Typography variant="subtitle1" color="textSecondary">
                          {" "}
                          Underlying Token Address{" "}
                        </Typography>
                        <CustomInputContainer>
                          <CustomFormikTextField
                            name="underlyingTokenAddress"
                            type="text"
                            placeholder="0x..."
                            value={values.underlyingTokenAddress || ""}
                            inputProps={{ maxLength: 42 }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("underlyingTokenAddress", e.target.value)
                            }}
                          />
                        </CustomInputContainer>
                        {errors.underlyingTokenAddress && touched.underlyingTokenAddress ? (
                          <ErrorText>{errors.underlyingTokenAddress}</ErrorText>
                        ) : null}
                      </Grid>
                      <Grid item xs={isMobile ? 12 : 12}>
                        <Typography variant="subtitle1" color="textSecondary">
                          {" "}
                          Wrapped Token Symbol{" "}
                        </Typography>
                        <CustomInputContainer>
                          <CustomFormikTextField
                            name="wrappedTokenSymbol"
                            type="text"
                            placeholder="wETH"
                            value={values.wrappedTokenSymbol || ""}
                            inputProps={{ maxLength: 7 }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("wrappedTokenSymbol", e.target.value.toUpperCase())
                            }}
                          />
                        </CustomInputContainer>
                        {errors.wrappedTokenSymbol && touched.wrappedTokenSymbol ? (
                          <ErrorText>{errors.wrappedTokenSymbol}</ErrorText>
                        ) : null}
                        <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: "block" }}>
                          The wrapped token name will be "Wrapped {values.wrappedTokenSymbol || "[SYMBOL]"}"
                        </Typography>
                        <Typography variant="caption" color="textSecondary" style={{ marginTop: 4, display: "block" }}>
                          Decimals will match the underlying token
                        </Typography>
                      </Grid>
                    </>
                  )}
                </SecondContainer>
                {values.tokenDeploymentMechanism === "new" && (
                  <SecondContainer container item direction="row" wrap="wrap">
                    <Grid container item direction="row" alignItems="center" xs={8}>
                      <Grid item xs={1}>
                        <Checkbox
                          disableRipple
                          checked={values.nonTransferable}
                          inputProps={{
                            "aria-label": "Non-transferable"
                          }}
                          onChange={() => {
                            setFieldValue("nonTransferable", !values.nonTransferable)
                          }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography color="textSecondary" style={{ display: "flex", alignItems: "center" }}>
                          Non-transferable
                          <Tooltip
                            placement="bottom"
                            title={`
                                This action is not reversible. When checked, tokens cannot be transferred between addresses.
                            `}
                          >
                            <InfoIcon style={{ marginLeft: 8 }} />
                          </Tooltip>
                        </Typography>
                      </Grid>
                    </Grid>
                  </SecondContainer>
                )}
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
