import {
  Grid,
  styled,
  Typography,
  withStyles,
  TextareaAutosize,
  withTheme,
  Box,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Tooltip,
  Link
} from "@material-ui/core"
import { validateContractAddress, validateAddress } from "@taquito/utils"
import React, { useContext, useEffect } from "react"
import { useHistory, withRouter } from "react-router"
import { useRouteMatch } from "react-router-dom"
import { Field, Form, Formik, FormikErrors, getIn } from "formik"
import { TextField as FormikTextField } from "formik-material-ui"
import { TitleBlock } from "modules/common/TitleBlock"

import { CreatorContext, ActionTypes, OrgSettings } from "modules/creator/state"
import { InfoRounded } from "@material-ui/icons"
import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata"
import { useTezos } from "services/beacon/hooks/useTezos"

const SecondContainer = styled(Grid)({
  marginTop: 25
})

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

const InfoIcon = styled(InfoRounded)(({ theme }) => ({
  position: "absolute",
  right: 25,
  top: "20%",
  color: theme.palette.secondary.light,
  height: 18,
  width: 18
}))

const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16
}))

const TextareaContainer = styled(Grid)({
  display: "flex",
  position: "relative"
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
})(FormikTextField)

const MetadataContainer = styled(Grid)({
  margin: "-4px 0 16px 0"
})

const CustomTextarea = styled(withTheme(TextareaAutosize))(props => ({
  "minHeight": 152,
  "boxSizing": "border-box",
  "width": "100%",
  "marginTop": 14,
  "fontWeight": 300,
  "padding": "21px 20px",
  "border": "none",
  "fontSize": 16,
  "fontFamily": "Roboto Mono",
  "color": props.theme.palette.text.secondary,
  "background": "#2F3438",
  "lineHeight": "135%",
  "letterSpacing": -0.18,
  "borderRadius": 8,
  "paddingRight": 40,
  "wordBreak": "break-word",
  "&:focus-visible": {
    outline: "none"
  }
}))

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red"
})

const DaoSettingsForm = withRouter(({ submitForm, values, setFieldValue, errors, touched, setFieldTouched }: any) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const {
    data: tokenMetadata,
    isLoading: loading,
    error
  } = useTokenMetadata(values?.governanceToken?.address, values?.governanceToken?.tokenId)

  useEffect(() => {
    if (tokenMetadata) {
      setFieldValue("governanceToken.tokenMetadata", tokenMetadata)
      setFieldValue("symbol", tokenMetadata.symbol)
    }

    if (error) {
      setFieldValue("governanceToken.tokenMetadata", undefined)
      setFieldValue("symbol", undefined)
    }
  }, [error, setFieldValue, tokenMetadata])

  const { dispatch } = useContext(CreatorContext)
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
        },
        back: {
          handler: () => history.push(`template`),
          text: "Back"
        }
      })
    }
  }, [dispatch, errors, history, match.path, match.url, submitForm, values])

  return (
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
  )
})

const isInvalidKtOrTzAddress = (address: string) =>
  validateContractAddress(address) !== 3 && validateAddress(address) !== 3

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

  if (values.guardian && isInvalidKtOrTzAddress(values.guardian)) {
    errors.guardian = "Invalid address"
  }

  if (!values.governanceToken.address) {
    errors.governanceToken = {
      ...errors.governanceToken,
      address: "Required"
    }
  }

  if (values.governanceToken.address && validateContractAddress(values.governanceToken.address) !== 3) {
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

export const DaoSettings = (): JSX.Element => {
  const { state, dispatch, updateCache } = useContext(CreatorContext)
  const { orgSettings } = state.data
  const history = useHistory()
  const { account } = useTezos()

  const saveStepInfo = (values: OrgSettings, { setSubmitting }: { setSubmitting: (b: boolean) => void }) => {
    const newValues: OrgSettings = { ...values, administrator: account }
    const newState = {
      ...state.data,
      orgSettings: newValues
    }
    updateCache(newState)
    setSubmitting(true)
    dispatch({ type: ActionTypes.UPDATE_ORGANIZATION_SETTINGS, org: newValues })
    history.push(`voting`)
  }

  return (
    <Box>
      <TitleBlock
        title="DAO Basics"
        description={
          <Typography variant="subtitle1" color="textSecondary">
            These settings will define the name, symbol, and initial distribution of your token. You will need a
            pre-existing FA2 token to use as governance token. To deploy your own governance token you can go{" "}
            <Link target="_blank" href="https://fa2-bakery.netlify.app/" color="secondary">
              here
            </Link>{" "}
            and then come back.
          </Typography>
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
              <DaoSettingsForm
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
