/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react"
import {
  Grid,
  styled,
  Typography,
  withStyles,
  withTheme,
  TextareaAutosize,
  useTheme,
  useMediaQuery
} from "@material-ui/core"

import { Choices } from "../../components/Choices"
import { useHistory, useLocation } from "react-router-dom"
import { Field, Form, Formik, FormikErrors, getIn } from "formik"
import { TextField as FormikTextField } from "formik-material-ui"
import { Poll } from "models/Polls"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getSignature } from "services/lite/utils"
import dayjs from "dayjs"
import { useNotification } from "modules/common/hooks/useNotification"
import duration from "dayjs/plugin/duration"
import { CommunityBadge } from "../../components/CommunityBadge"
import { BackButton } from "modules/lite/components/BackButton"
import { saveLiteProposal } from "services/services/lite/lite-services"
import { useToken } from "../../hooks/useToken"
import { isWebUri } from "valid-url"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "modules/explorer/pages/DAO/router"
import { useUserTokenBalance } from "services/contracts/token/hooks/useUserTokenBalance"
dayjs.extend(duration)

const ProposalContainer = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  [theme.breakpoints.down("md")]: {
    marginTop: 30
  }
}))

const CustomFormikTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial"
    },
    "& .MuiInputBase-input": {
      textAlign: "initial",
      marginTop: 16,
      paddingTop: 19,
      borderRadius: 8,
      paddingLeft: 26,
      paddingBottom: 19,
      fontSize: 18,
      background: "#2f3438"
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

const CustomFormikTimeTextField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: 300,
      textAlign: "initial"
    },
    "& .MuiInputBase-input": {
      textAlign: "initial",
      borderRadius: 8,
      paddingLeft: 30,
      fontSize: 18,
      background: "#2f3438"
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

const PageContainer = styled("div")({
  height: "100%",
  margin: "auto",
  padding: "28px 0",
  boxSizing: "border-box",
  paddingTop: 0,

  ["@media (max-width: 1425px)"]: {},

  ["@media (max-width:1335px)"]: {},

  ["@media (max-width:1167px)"]: {
    width: "86vw !important"
  },

  ["@media (max-width:1030px)"]: {},

  ["@media (max-width:960px)"]: {},

  ["@media (max-width:645px)"]: {
    flexDirection: "column"
  }
})

const Header = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    marginBottom: 6
  }
}))

const ProposalChoices = styled(Grid)({
  flexGrow: 1
})

const CustomTextarea = styled(withTheme(TextareaAutosize))(props => ({
  "marginTop": 16,
  "minHeight": 192,
  "boxSizing": "border-box",
  "width": "100%",
  "fontWeight": 300,
  "paddingTop": 19,
  "paddingLeft": 26,
  "border": "none",
  "fontSize": 17,
  "color": props.theme.palette.text.primary,
  "background": props.theme.palette.primary.main,
  "borderRadius": 8,
  "paddingRight": 40,
  "wordBreak": "break-word",
  "fontFamily": "Roboto Mono",
  "&:focus-visible": {
    outline: "none"
  },
  "resize": "none"
}))

const CommunityLabel = styled(Grid)({
  minWidth: 212,
  height: 54,
  background: "#2F3438",
  borderRadius: 8,
  display: "inline-grid",
  marginBottom: 25,
  width: "fit-content",
  padding: 12
})

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
  marginBottom: -21,
  marginTop: 4
})

const ErrorTextTime = styled(Typography)({
  marginTop: -18,
  marginBottom: 0,
  fontSize: 14,
  color: "red"
})

const ErrorTextChoices = styled(Typography)({
  fontSize: 14,
  color: "red",
  marginBottom: -21,
  marginTop: -86
})

const TimeBox = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 8,
  width: 72,
  minHeight: 59,
  display: "grid",
  [theme.breakpoints.down("sm")]: {
    "width": 172,
    "& input": {
      marginLeft: "30%"
    }
  }
}))

const TimeContainer = styled(Grid)(({ theme }) => ({
  alignItems: "baseline",
  marginTop: 0,
  gap: 10
}))

const TimeContainerMobile = styled(Grid)(({ theme }) => ({
  alignItems: "baseline",
  marginTop: 0,
  gap: 10,
  [theme.breakpoints.down("md")]: {
    marginTop: 30,
    display: "grid"
  }
}))

const hasDuplicates = (options: string[]) => {
  const trimOptions = options.map(option => option.trim())
  return new Set(trimOptions).size !== trimOptions.length
}

const isValidHttpUrl = (externalLink: string) => {
  let url
  try {
    url = new URL(externalLink)
  } catch (_) {
    return false
  }

  return url.protocol === "http:" || url.protocol === "https:"
}

const validateForm = (values: Poll) => {
  const errors: FormikErrors<Poll> = {}

  if (!values.name) {
    errors.name = "Required"
  }

  if (!values.externalLink) {
    errors.externalLink = "Required"
  }

  if (values.choices.length === 0 || values.choices.length === 1) {
    errors.choices = "Two options at least are required"
  }

  if (values.choices.length > 0 && values.choices.includes("")) {
    errors.choices = "Please enter an option value"
  }

  if (values.choices.length > 0 && hasDuplicates(values.choices)) {
    errors.choices = "Duplicate options are not allowed"
  }

  if (values.externalLink && !isWebUri(values.externalLink)) {
    errors.externalLink = "Not a valid url"
  }

  if (values.endTimeMinutes !== undefined && values.endTimeDays !== undefined && values.endTimeHours !== undefined) {
    if (values.endTimeMinutes !== null && values.endTimeDays !== null && values.endTimeHours !== null) {
      if (values.endTimeMinutes < 5 && values.endTimeDays === 0 && values.endTimeHours === 0) {
        errors.endTimeMinutes = `Can't allow less than 5 minutes for voting`
      }
    }
  }
  if (values.endTimeDays === null || values.endTimeDays === undefined) {
    errors.endTimeDays = "Required"
  }

  if (values.endTimeDays && values.endTimeDays < 0) {
    errors.endTimeDays = "Most be greater than zero"
  }

  if (values.endTimeHours === null || values.endTimeHours === undefined) {
    errors.endTimeDays = "Required"
  }

  if (values.endTimeHours && values.endTimeHours < 0) {
    errors.endTimeDays = "Most be greater than zero"
  }

  if (values.endTimeMinutes === null || values.endTimeMinutes === undefined) {
    errors.endTimeDays = "Required"
  }

  if (values.endTimeMinutes && values.endTimeMinutes < 0) {
    errors.endTimeDays = "Most be greater than zero"
  }

  return errors
}

export const ProposalForm = ({
  submitForm,
  values,
  setFieldValue,
  errors,
  touched,
  isSubmitting,
  setFieldTouched,
  id
}: any) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const finalDate = calculateEndTime(
    getIn(values, "endTimeDays"),
    getIn(values, "endTimeHours"),
    getIn(values, "endTimeMinutes")
  )

  const { pathname } = useLocation()

  const shouldShowBar = pathname.includes("/lite") ? true : false

  const hasErrors = errors.endTimeDays || errors.endTimeHours || errors.endTimeMinutes
  return (
    <PageContainer style={shouldShowBar ? { width: "1000px" } : { width: "100%" }}>
      <Grid container>
        {shouldShowBar ? (
          <>
            <BackButton />
            <Header container direction="column">
              <CommunityLabel container direction="row" justifyContent="center" alignItems="center">
                <CommunityBadge id={id} />
              </CommunityLabel>
              <Typography
                color="textPrimary"
                variant="subtitle1"
                style={isMobileSmall ? { marginBottom: 0 } : { marginBottom: 24 }}
              >
                New Proposal
              </Typography>
            </Header>
          </>
        ) : null}
        <Grid container direction="row">
          <ProposalContainer container item direction={"row"} style={{ gap: 30 }} xs={12}>
            <Grid item xs={12}>
              <Typography color="textPrimary">Proposal Title</Typography>
              <Field name="name" type="text" placeholder="Proposal Title*" component={CustomFormikTextField} />
              {errors?.name && touched.name ? <ErrorText>{errors.name}</ErrorText> : null}
            </Grid>

            {!isMobileSmall ? (
              <>
                <TimeContainer
                  container
                  item
                  direction={"row"}
                  style={{ gap: 10, flexBasis: "20% !important;" }}
                  xs={12}
                >
                  <Grid item container direction="row" xs={12}>
                    <Typography color="textPrimary">Set Poll Duration</Typography>
                  </Grid>
                  <TimeBox item xs={1}>
                    <Field
                      style={{ margin: "auto" }}
                      id="outlined-basic"
                      name="endTimeDays"
                      type="number"
                      placeholder="DD"
                      component={CustomFormikTimeTextField}
                      inputProps={{ min: 0 }}
                      onClick={() => {
                        if (getIn(values, "endTimeDays") === 0) {
                          setFieldValue("endTimeDays", "")
                          setFieldTouched("endTimeDays")
                        }
                      }}
                      onChange={(newValue: any) => {
                        if (newValue.target.value === "") {
                          setFieldValue("endTimeDays", null)
                        } else {
                          setFieldValue("endTimeDays", parseInt(newValue.target.value, 10))
                        }
                      }}
                    />
                  </TimeBox>
                  <TimeBox item xs={1}>
                    <Field
                      style={{ margin: "auto" }}
                      id="outlined-basic"
                      name="endTimeHours"
                      type="number"
                      placeholder="HH"
                      component={CustomFormikTimeTextField}
                      inputProps={{ min: 0 }}
                      onClick={() => {
                        if (getIn(values, "endTimeHours") === 0) {
                          setFieldValue("endTimeHours", "")
                        }
                      }}
                      onChange={(newValue: any) => {
                        if (newValue.target.value === "") {
                          setFieldValue("endTimeHours", null)
                        } else {
                          setFieldValue("endTimeHours", parseInt(newValue.target.value, 10))
                        }
                      }}
                    />
                  </TimeBox>

                  <TimeBox item xs={1}>
                    <Field
                      style={{ margin: "auto" }}
                      id="outlined-basic"
                      name="endTimeMinutes"
                      type="number"
                      placeholder="MM"
                      component={CustomFormikTimeTextField}
                      inputProps={{ min: 0 }}
                      onClick={() => {
                        if (getIn(values, "endTimeMinutes") === 0) {
                          setFieldValue("endTimeMinutes", "")
                        }
                      }}
                      onChange={(newValue: any) => {
                        if (newValue.target.value === "") {
                          setFieldValue("endTimeMinutes", null)
                        } else {
                          setFieldValue("endTimeMinutes", parseInt(newValue.target.value, 10))
                        }
                      }}
                    />
                  </TimeBox>
                  <Grid item xs={5}>
                    {getIn(values, "endTimeDays") !== null &&
                    getIn(values, "endTimeHours") !== null &&
                    getIn(values, "endTimeMinutes") !== null &&
                    !hasErrors ? (
                      <Grid container direction="row" style={{ marginLeft: 16 }}>
                        <Typography color="textPrimary" variant={"body2"}>
                          End date:
                        </Typography>
                        <Typography color="secondary" variant="body2" style={{ marginLeft: 10 }}>
                          {" "}
                          {dayjs(Number(finalDate)).format("MM/DD/YYYY h:mm A")}
                        </Typography>
                      </Grid>
                    ) : null}

                    <Grid container direction="row" style={{ marginLeft: 16 }}>
                      {errors?.endTimeDays && touched.endTimeDays ? (
                        <ErrorTextTime>{errors.endTimeDays}</ErrorTextTime>
                      ) : null}
                    </Grid>
                  </Grid>
                </TimeContainer>
              </>
            ) : null}

            <Grid item xs={12}>
              <Typography color="textPrimary">Description</Typography>
              <Field name="description">
                {() => (
                  <CustomTextarea
                    maxLength={1500}
                    aria-label="empty textarea"
                    placeholder="Type description"
                    value={getIn(values, "description")}
                    onChange={(newValue: any) => {
                      setFieldValue("description", newValue.target.value)
                    }}
                  />
                )}
              </Field>
            </Grid>
            <Grid item xs={12}>
              <Typography color="textPrimary">External Link</Typography>
              <Field name="externalLink" type="text" placeholder="External Link" component={CustomFormikTextField} />
              {errors?.externalLink && touched.externalLink ? <ErrorText>{errors.externalLink}</ErrorText> : null}
            </Grid>

            {isMobileSmall ? (
              <TimeContainerMobile direction="row">
                <Grid item container direction="row" xs={12}>
                  <Typography color="textPrimary" style={{ fontSize: 16 }}>
                    Set Poll Duration
                  </Typography>
                </Grid>
                <TimeBox item>
                  <Field
                    style={{ margin: "auto" }}
                    id="outlined-basic"
                    name="endTimeDays"
                    type="number"
                    placeholder="DD"
                    component={CustomFormikTextField}
                    inputProps={{ min: 0 }}
                    onClick={() => {
                      if (getIn(values, "endTimeDays") === 0) {
                        setFieldValue("endTimeDays", "")
                        setFieldTouched("endTimeDays")
                      }
                    }}
                    onChange={(newValue: any) => {
                      if (newValue.target.value === "") {
                        setFieldValue("endTimeDays", null)
                      } else {
                        setFieldValue("endTimeDays", parseInt(newValue.target.value, 10))
                      }
                    }}
                  />
                </TimeBox>
                <TimeBox item>
                  <Field
                    style={{ margin: "auto" }}
                    id="outlined-basic"
                    name="endTimeHours"
                    type="number"
                    placeholder="HH"
                    component={CustomFormikTextField}
                    inputProps={{ min: 0 }}
                    onClick={() => {
                      if (getIn(values, "endTimeHours") === 0) {
                        setFieldValue("endTimeHours", "")
                      }
                    }}
                    onChange={(newValue: any) => {
                      if (newValue.target.value === "") {
                        setFieldValue("endTimeHours", null)
                      } else {
                        setFieldValue("endTimeHours", parseInt(newValue.target.value, 10))
                      }
                    }}
                  />
                </TimeBox>

                <TimeBox item>
                  <Field
                    style={{ margin: "auto" }}
                    id="outlined-basic"
                    name="endTimeMinutes"
                    type="number"
                    placeholder="MM"
                    component={CustomFormikTextField}
                    inputProps={{ min: 0 }}
                    onClick={() => {
                      if (getIn(values, "endTimeMinutes") === 0) {
                        setFieldValue("endTimeMinutes", "")
                      }
                    }}
                    onChange={(newValue: any) => {
                      if (newValue.target.value === "") {
                        setFieldValue("endTimeMinutes", null)
                      } else {
                        setFieldValue("endTimeMinutes", parseInt(newValue.target.value, 10))
                      }
                    }}
                  />
                </TimeBox>
                {getIn(values, "endTimeDays") !== null &&
                getIn(values, "endTimeHours") !== null &&
                getIn(values, "endTimeMinutes") !== null &&
                !hasErrors ? (
                  <Grid container direction="row">
                    <Typography color="textPrimary" variant={"body2"}>
                      End date:
                    </Typography>
                    <Typography color="secondary" variant="body2" style={{ marginLeft: 10 }}>
                      {" "}
                      {dayjs(Number(finalDate)).format("MM/DD/YYYY h:mm A")}
                    </Typography>
                  </Grid>
                ) : null}

                <Grid container direction="row">
                  {errors?.endTimeDays && touched.endTimeDays ? (
                    <ErrorTextTime>{errors.endTimeDays}</ErrorTextTime>
                  ) : null}
                </Grid>
              </TimeContainerMobile>
            ) : null}
            <ProposalChoices>
              <Choices
                id={id}
                choices={getIn(values, "choices")}
                isLoading={isSubmitting}
                submitForm={submitForm}
                votingStrategy={getIn(values, "votingStrategy")}
                setFieldValue={setFieldValue}
              />
              {errors?.choices && touched.choices ? <ErrorTextChoices>{errors.choices}</ErrorTextChoices> : null}
            </ProposalChoices>
          </ProposalContainer>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

const calculateEndTime = (days: number, hours: number, minutes: number) => {
  const time = dayjs().add(days, "days").add(hours, "hours").add(minutes, "minutes")
  return String(time.valueOf())
}

export const ProposalCreator: React.FC<{ id?: string; onClose?: any }> = props => {
  const navigate = useHistory()
  const { network, account, wallet } = useTezos()
  const openNotification = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const daoId = useDAOID()
  const { data } = useDAO(daoId)
  const id = data?.liteDAOData?._id ? data?.liteDAOData?._id : props.id
  const tokenAddress = useToken(id)

  const initialState: Poll = {
    name: "",
    description: "",
    externalLink: "",
    choices: [""],
    startTime: dayjs().toISOString(),
    endTime: "",
    daoID: "",
    author: "",
    votingStrategy: 0,
    endTimeDays: null,
    endTimeHours: null,
    endTimeMinutes: null
  }

  const saveProposal = useCallback(
    async (values: Poll) => {
      try {
        setIsLoading(true)
        if (!wallet) {
          return
        }

        const data = values
        data.daoID = id
        data.startTime = String(dayjs().valueOf())
        data.endTime = calculateEndTime(values.endTimeDays!, values.endTimeHours!, values.endTimeMinutes!)
        data.author = account

        const { signature, payloadBytes } = await getSignature(account, wallet, JSON.stringify(data))
        const publicKey = (await wallet?.client.getActiveAccount())?.publicKey
        if (!signature) {
          openNotification({
            message: `Issue with Signature`,
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }

        const res = await saveLiteProposal(signature, publicKey, payloadBytes)
        const respData = await res.json()
        if (res.ok) {
          openNotification({
            message: "Proposal created!",
            autoHideDuration: 3000,
            variant: "success"
          })
          setIsLoading(false)
          if (props?.onClose) {
            props?.onClose()
          }
          daoId
            ? navigate.push(`/explorer/dao/${daoId}/proposals`)
            : navigate.push(`/explorer/lite/dao/${id}/community`)
        } else {
          console.log("Error: ", respData.message)
          openNotification({
            message: respData.message,
            autoHideDuration: 3000,
            variant: "error"
          })
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.log("error: ", error)
        openNotification({
          message: "Proposal could not be created",
          autoHideDuration: 3000,
          variant: "error"
        })
        setIsLoading(false)
        return
      }
    },
    [navigate, id, network, tokenAddress]
  )

  return (
    <PageContainer style={{ width: "100%" }}>
      <Grid container direction={"column"}>
        <Formik
          validateOnChange={true}
          validateOnBlur={false}
          validate={validateForm}
          onSubmit={saveProposal}
          initialValues={initialState}
        >
          {({ submitForm, setFieldValue, values, errors, touched, setFieldTouched }) => {
            return (
              <Form style={{ width: "100%" }}>
                <ProposalForm
                  submitForm={submitForm}
                  isSubmitting={isLoading}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  values={values}
                  setFieldTouched={setFieldTouched}
                  id={id}
                />
              </Form>
            )
          }}
        </Formik>
      </Grid>
    </PageContainer>
  )
}
