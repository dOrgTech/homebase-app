/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react"
import {
  Grid,
  styled,
  Typography,
  Checkbox,
  useMediaQuery,
  useTheme,
  withStyles,
  withTheme,
  TextareaAutosize,
  CircularProgress,
  InputAdornment,
  Tooltip
} from "@material-ui/core"
import { UploadAvatar } from "./components/UploadAvatar"
import { Field, Form, Formik, FormikErrors, getIn } from "formik"
import { TextField as FormikTextField } from "formik-material-ui"
import { Community } from "models/Community"
import { useHistory } from "react-router"

import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getEthSignature, getSignature, validateTokenAddress } from "services/utils/utils"
import { Navbar } from "modules/common/Toolbar"
import { SmallButton } from "modules/common/SmallButton"
import { saveLiteCommunity } from "services/services/lite/lite-services"
import { InfoRounded } from "@material-ui/icons"
import CodeIcon from "@mui/icons-material/Code"
import CodeOffIcon from "@mui/icons-material/CodeOff"
import { ProposalCodeEditorInput } from "modules/explorer/components/ProposalFormInput"
import Prism, { highlight } from "prismjs"
import "prism-themes/themes/prism-night-owl.css"
import { Network } from "services/beacon"

const CodeButton = styled(CodeIcon)(({ theme }) => ({
  background: theme.palette.primary.dark,
  padding: 3,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  borderBottom: "0.5px solid",
  cursor: "pointer",
  color: theme.palette.secondary.main
}))

const CodeOffButton = styled(CodeOffIcon)(({ theme }) => ({
  background: theme.palette.primary.dark,
  padding: 3,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  borderBottom: "0.5px solid",
  cursor: "pointer",
  color: theme.palette.secondary.main
}))

const CommunityContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  padding: "0px 15px",
  [theme.breakpoints.down("md")]: {
    marginTop: 0
  }
}))

const InfoIconInput = styled(InfoRounded)(({ theme }) => ({
  cursor: "default",
  color: theme.palette.secondary.light,
  height: 16,
  width: 16
}))

const AvatarCommunityContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  padding: "0px 15px",
  [theme.breakpoints.down("sm")]: {
    marginTop: 30
  }
}))

const CommunityContainerBottom = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  padding: "0px 15px",
  [theme.breakpoints.down("sm")]: {
    marginTop: 30,
    gap: 12
  },
  marginTop: 30
}))

const TitleContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  padding: "0px 15px",
  [theme.breakpoints.down("md")]: {
    marginTop: 0
  },
  marginBottom: 26
}))

const AvatarContainer = styled(Grid)({
  height: "100%"
})

const PageContent = styled(Grid)({
  width: "1000px",
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  flexDirection: "row",
  paddingTop: 0,
  ["@media (max-width:1167px)"]: {
    width: "86vw"
  }
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

const CustomTextarea = styled(withTheme(TextareaAutosize))(props => ({
  "minHeight": 152,
  "boxSizing": "border-box",
  "width": "100%",
  "fontWeight": 400,
  "padding": "21px 20px",
  "fontFamily": "Roboto Flex",
  "borderTopRightRadius": 0,
  "border": "none",
  "fontSize": 16,
  "color": props.theme.palette.text.secondary,
  "background": props.theme.palette.primary.dark,
  "borderRadius": 8,
  "paddingRight": 40,
  "wordBreak": "break-word",
  "&:focus-visible": {
    outline: "none"
  },
  "resize": "none"
}))

const CustomSelect = styled(Field)(({ theme }) => ({
  width: "100%",
  background: theme.palette.primary.dark,
  border: "none",
  color: theme.palette.text.secondary,
  fontFamily: "Roboto Flex",
  fontSize: 18,
  borderRight: "26px solid transparent",
  borderRadius: 4,
  minHeight: 52
}))

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
  marginBottom: -21,
  marginTop: -16
})

const PageContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main
}))

const CustomInputContainer = styled(Grid)(({ theme }) => ({
  height: 54,
  boxSizing: "border-box",
  background: theme.palette.primary.dark,
  borderRadius: 8,
  alignItems: "center",
  display: "flex",
  padding: "13px 23px",
  width: "100%",
  fontWeight: 300
}))

const CheckboxContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("xs")]: {
    maxWidth: "16.666667%",
    flexBasis: "16.666667%"
  },
  maxwidth: "5%",
  flexBasis: "5%"
}))

const validateForm = (network: Network, values: Community) => {
  const errors: FormikErrors<Community> = {}

  if (!values.name) {
    errors.name = "Required"
  }

  if (!values.tokenAddress) {
    errors.tokenAddress = "Required"
  }

  if (values.tokenAddress && validateTokenAddress(network, values.tokenAddress) !== 3) {
    console.log("Address isValid", validateTokenAddress(network, values.tokenAddress))
    errors.tokenAddress = "Invalid address"
  }

  return errors
}

const CommunityForm = ({ submitForm, values, setFieldValue, errors, touched, setFieldTouched, isSubmitting }: any) => {
  const theme = useTheme()
  const { isEtherlink } = useTezos()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const { data: tokenMetadata, isLoading: loading, error } = useTokenMetadata(values?.tokenAddress)
  console.log("TokenMetadata", tokenMetadata)
  const options = {
    eth: [
      {
        name: "erc20",
        label: "ERC20"
      }
    ],
    tez: [
      {
        value: "fa2",
        label: "FA2"
      },
      {
        value: "nft",
        label: "NFT"
      }
    ]
  }
  const tokenStandardOptions = isEtherlink ? options.eth : options.tez

  const codeEditorStyles = {
    minHeight: 500,
    fontFamily: "Roboto Flex",
    fontSize: 14,
    fontWeight: 400,
    outlineWidth: 0,
    color: "white"
  }

  const [isMarkup, setIsMarkup] = useState(false)
  const grammar = Prism.languages.markup
  const codeEditorPlaceholder = `
  <html>
    <head>
      <title> Proposal Description </title>
      </head>
      <body>
        <h1> ... </h1>
      </body>
  </html>`

  useEffect(() => {
    if (tokenMetadata) {
      setFieldValue("tokenID", tokenMetadata.token_id)
      setFieldValue("tokenType", "ERC20")
      setFieldValue("symbol", tokenMetadata.symbol)
      setFieldValue("decimals", tokenMetadata.decimals)
    }

    if (error) {
      setFieldValue("tokenID", "0")
      setFieldValue("tokenType", "ERC20")
      setFieldValue("symbol", undefined)
    }
  }, [error, setFieldValue, tokenMetadata])

  return (
    <PageContainer container direction="row">
      <Navbar mode="creator" />
      <PageContent container>
        <TitleContainer container direction="row">
          <Typography variant="h3" color="textSecondary">
            Create a Community
          </Typography>
        </TitleContainer>
        <CommunityContainer container item direction={"column"} style={{ gap: 22 }} xs={12} md={6} lg={9}>
          <CustomInputContainer item>
            <Field name="name" type="text" placeholder="Community Name*" component={CustomFormikTextField} />
          </CustomInputContainer>
          {errors?.name && touched.name ? <ErrorText>{errors.name}</ErrorText> : null}
          <Grid item>
            {!isMarkup ? (
              <div style={{ justifyContent: "flex-end", display: "flex" }}>
                <Tooltip title="Allow markup">
                  <CodeButton onClick={() => setIsMarkup(true)} />
                </Tooltip>
              </div>
            ) : (
              <div style={{ justifyContent: "flex-end", display: "flex" }}>
                <Tooltip title="Disable markup">
                  <CodeOffButton onClick={() => setIsMarkup(false)} />
                </Tooltip>
              </div>
            )}

            {!isMarkup ? (
              <Field name="description">
                {() => (
                  <CustomTextarea
                    disabled={isSubmitting}
                    maxLength={1500}
                    aria-label="empty textarea"
                    placeholder="Short description"
                    value={getIn(values, "description")}
                    onChange={(newValue: any) => {
                      setFieldValue("description", newValue.target.value)
                    }}
                  />
                )}
              </Field>
            ) : (
              <Field name="description">
                {() => (
                  <ProposalCodeEditorInput
                    insertSpaces
                    ignoreTabKey={false}
                    tabSize={4}
                    style={codeEditorStyles}
                    padding={10}
                    value={getIn(values, "description")}
                    onValueChange={(newValue: string) => {
                      setFieldValue("description", newValue)
                    }}
                    highlight={code => highlight(code, grammar, "javascript")}
                    placeholder={codeEditorPlaceholder}
                  />
                )}
              </Field>
            )}
          </Grid>
          <CustomInputContainer item>
            <Field name="linkToTerms" type="text" placeholder="Link to Terms" component={CustomFormikTextField} />
          </CustomInputContainer>
          <CustomInputContainer item>
            <Field
              onClick={() => setFieldTouched("tokenAddress")}
              name="tokenAddress"
              type="text"
              onBlur={(e: any) => {
                setFieldValue("tokenAddress", e.target.value)
              }}
              placeholder="Token Contract Address*"
              component={CustomFormikTextField}
            />
          </CustomInputContainer>
          {tokenMetadata && !loading && (
            <Typography variant="subtitle2" color="secondary" style={{ marginTop: -16 }}>
              {tokenMetadata.name}
            </Typography>
          )}
          {errors?.tokenAddress && touched.tokenAddress ? <ErrorText>{errors.tokenAddress}</ErrorText> : null}
        </CommunityContainer>
        <AvatarCommunityContainer container direction={"column"} style={{ gap: 30 }} item xs={12} md={6} lg={3}>
          <AvatarContainer container item>
            <UploadAvatar url={values.picUri} setFieldValue={setFieldValue} disabled={isSubmitting} />
          </AvatarContainer>
        </AvatarCommunityContainer>

        <CommunityContainerBottom container justifyContent="space-between" spacing={isMobileSmall ? 4 : 1}>
          <Grid item container xs={12} md={4}>
            <CustomInputContainer>
              <Field name="symbol" type="text" placeholder="Token Symbol" component={CustomFormikTextField} />
            </CustomInputContainer>
          </Grid>
          <Grid item container xs={12} md={4}>
            <CustomInputContainer>
              <Field
                name="tokenID"
                type="text"
                placeholder="Token ID"
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
                component={CustomFormikTextField}
              />
            </CustomInputContainer>
          </Grid>
          <Grid item container xs={12} md={4}>
            <CustomInputContainer>
              <Field name="tokenType">
                {() => (
                  <CustomSelect
                    disabled={isSubmitting}
                    as="select"
                    name={getIn(values, "tokenType")}
                    label="Token Standard"
                    onChange={(newValue: any) => {
                      setFieldValue("tokenType", newValue.target.value)
                    }}
                  >
                    {tokenStandardOptions.map((opt: any, idx) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </CustomSelect>
                )}
              </Field>
            </CustomInputContainer>
          </Grid>
        </CommunityContainerBottom>

        <CommunityContainerBottom container direction="column">
          <Grid container direction="row" alignItems="center">
            <CheckboxContainer item xs={2}>
              <Field name="requiredTokenOwnership">
                {() => (
                  <Checkbox
                    disableRipple
                    checked={values.requiredTokenOwnership}
                    value={getIn(values, "requiredTokenOwnership")}
                    inputProps={{
                      "aria-label": "Checkbox A"
                    }}
                    onChange={() => {
                      setFieldValue("requiredTokenOwnership", !values.requiredTokenOwnership)
                    }}
                  />
                )}
              </Field>
            </CheckboxContainer>
            <Grid item xs>
              <Typography color="textSecondary">Require token ownership to create proposals</Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center">
            <CheckboxContainer item xs={2}>
              <Field name="allowPublicAccess">
                {() => (
                  <Checkbox
                    disableRipple
                    checked={values.allowPublicAccess}
                    value={getIn(values, "allowPublicAccess")}
                    inputProps={{
                      "aria-label": "Checkbox B"
                    }}
                    onChange={() => {
                      setFieldValue("allowPublicAccess", !values.allowPublicAccess)
                    }}
                  />
                )}
              </Field>
            </CheckboxContainer>
            <Grid item xs>
              <Typography color="textSecondary">Allow public read access to this community</Typography>
            </Grid>
          </Grid>
        </CommunityContainerBottom>
        <CommunityContainerBottom container direction="row">
          {isSubmitting ? (
            <CircularProgress color="secondary" />
          ) : (
            <SmallButton variant="contained" color="secondary" onClick={() => submitForm(values)}>
              Create Community
            </SmallButton>
          )}
        </CommunityContainerBottom>
      </PageContent>
    </PageContainer>
  )
}

export const CommunityCreator: React.FC = () => {
  const navigate = useHistory()
  const { network, account, wallet, etherlink } = useTezos()
  const openNotification = useNotification()

  const initialState: Community = {
    _id: "",
    name: "",
    description: "",
    linkToTerms: "",
    picUri: "",
    members: [],
    polls: [],
    tokenAddress: "",
    symbol: "",
    tokenID: "",
    tokenType: "FA2",
    requiredTokenOwnership: false,
    allowPublicAccess: false,
    network,
    votingAddressesCount: 0
  }

  const saveCommunity = useCallback(
    async (values: Community) => {
      console.log({ values })

      if (wallet) {
        values.members.push(account)

        try {
          const { signature, payloadBytes } = await getSignature(account, wallet, JSON.stringify(values))
          const publicKey = (await wallet?.client.getActiveAccount())?.publicKey
          if (!signature) {
            openNotification({
              message: `Issue with Signature`,
              autoHideDuration: 3000,
              variant: "error"
            })
            return
          }

          const resp = await saveLiteCommunity(signature, publicKey, payloadBytes, network)
          const data = await resp.json()
          if (resp.ok) {
            openNotification({
              message: "Community created! Checkout the DAO in explorer page",
              autoHideDuration: 3000,
              variant: "success"
            })
            navigate.push("/explorer")
          } else {
            console.log("Error: ", data.message)
            openNotification({
              message: data.message,
              autoHideDuration: 3000,
              variant: "error"
            })
            return
          }
        } catch (error) {
          console.log("error: ", error)
          openNotification({
            message: "Community could not be created!",
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
      } else if (etherlink.isConnected) {
        // Ethelink
        try {
          console.log({ etherlink })
          const { signature, payloadBytes } = await getEthSignature(etherlink.account.address, JSON.stringify(values))
          const resp = await saveLiteCommunity(signature, etherlink.account.address, payloadBytes, network)
          const data = await resp.json()
          if (resp.ok) {
            openNotification({
              message: "Community created! Checkout the DAO in explorer page",
              autoHideDuration: 3000,
              variant: "success"
            })
            navigate.push("/explorer")
          } else {
            console.log("Error: ", data.message)
            openNotification({
              message: data.message,
              autoHideDuration: 3000,
              variant: "error"
            })
            return
          }
        } catch (error) {
          console.log("error: ", error)
          openNotification({
            message: "Community could not be created!",
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
      }
    },
    [navigate, network, openNotification, account, wallet, etherlink]
  )

  return (
    <PageContainer>
      <Formik
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={false}
        validate={(formValues: Community) => validateForm(network, formValues)}
        onSubmit={saveCommunity}
        initialValues={initialState}
      >
        {({ submitForm, isSubmitting, setFieldValue, values, errors, touched, setFieldTouched }) => {
          return (
            <Form style={{ width: "100%" }}>
              <CommunityForm
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
    </PageContainer>
  )
}
