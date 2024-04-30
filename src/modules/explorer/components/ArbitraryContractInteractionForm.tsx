import React, { useMemo, useState } from "react"
import {
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
  withStyles
} from "@material-ui/core"
import { ProposalFormInput } from "./ProposalFormInput"
import { validateContractAddress, validateAddress } from "@taquito/utils"
import { ErrorMessage, Field, FieldArray, Form, Formik, FormikErrors, getIn } from "formik"
import { SmallButtonDialog } from "modules/common/SmallButton"
import { SearchLambda } from "./styled/SearchLambda"
import { ArrowBackIos } from "@material-ui/icons"
import { SearchEndpoints } from "./SearchEndpoints"
import { toShortAddress } from "services/contracts/utils"

export interface Endpoint {
  key: string
  parameters: Parameter[]
}

interface Parameter {
  key: string
  type: string
  value?: any
}

const endpoints: Endpoint[] = [
  {
    key: "add_controller",
    parameters: [
      {
        key: "id",
        type: "string"
      },
      {
        key: "duration",
        type: "number"
      }
    ]
  },
  {
    key: "approve",
    parameters: [
      {
        key: "vote",
        type: "boolean"
      }
    ]
  }
]

const TypeText = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 300,
  color: theme.palette.primary.light
}))

const Container = styled(`div`)({
  display: "inline-grid",
  gap: 32
})

const BackButton = styled(Paper)({
  cursor: "pointer",
  background: "inherit",
  width: "fit-content",
  display: "flex",
  boxShadow: "none",
  alignItems: "center"
})

const ErrorText = styled(Typography)({
  fontSize: 14,
  color: "red",
  marginTop: 4
})

const Title = styled(Typography)({
  fontSize: 18,
  fontWeight: 450
})

const Value = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 300,
  lineHeight: "160%",
  color: theme.palette.primary.light
}))

const SubContainer = styled(Grid)({
  gap: 8,
  display: "inline-grid"
})

const BackButtonIcon = styled(ArrowBackIos)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: 12,
  marginRight: 16,
  cursor: "pointer"
}))

type ACIValues = {
  destination_contract: string
  amount: number
  target_endpoint: string
  parameters: Parameter[]
}

enum Status {
  NEW_INTERACTION = 0,
  CONTRACT_VALIDATED = 1,
  ENDPOINT_SELECTED = 2
}

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
})(TextField)

const ContractInteractionForm = ({
  submitForm,
  values,
  setFieldValue,
  errors,
  touched,
  setFieldTouched,
  setFieldError,
  isValid
}: any) => {
  const [state, setState] = useState<Status>(Status.NEW_INTERACTION)
  const [endpoint, setEndpoint] = useState<Endpoint | undefined>(undefined)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const shouldContinue = useMemo(() => {
    if (values.destination_contract !== "" && !errors.destination_contract) {
      return false
    }
    return true
  }, [values, errors])

  const validateAddress = () => {
    if (getIn(values, "amount") === "") {
      setFieldValue("amount", 0)
    }
    setState(Status.CONTRACT_VALIDATED)
  }

  const processParameters = (data: Endpoint) => {
    setEndpoint(data)
    setFieldValue("parameters", data.parameters)
    setFieldValue("target_endpoint", data.key)
  }

  const goBack = () => {
    setState(Status.NEW_INTERACTION)
    setEndpoint(undefined)
  }

  return (
    <>
      {state === Status.NEW_INTERACTION ? (
        <Grid container direction="row" style={{ marginTop: 30 }} spacing={2}>
          <Grid item xs={isMobileSmall ? 12 : 6}>
            <ProposalFormInput label="Destination Contract Address">
              <Field
                id="destination_contract"
                placeholder="Enter Address"
                name="destination_contract"
                component={CustomFormikTextField}
                onClick={() => setFieldTouched("destination_contract")}
                onChange={(newValue: any) => {
                  setFieldValue("destination_contract", newValue.target.value)
                }}
                value={getIn(values, "destination_contract")}
                inputProps={{
                  maxLength: 36
                }}
              />
            </ProposalFormInput>
            {errors.destination_contract && touched.destination_contract ? (
              <ErrorText>{errors.destination_contract}</ErrorText>
            ) : null}
          </Grid>
          <Grid item xs={isMobileSmall ? 12 : 6}>
            <ProposalFormInput label="Amount">
              <Field
                component={CustomFormikTextField}
                id="amount"
                placeholder="0"
                name="amount"
                onClick={() => setFieldTouched("amount")}
                onChange={(newValue: any) => {
                  setFieldValue("amount", newValue.target.value)
                }}
                value={getIn(values, "amount")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>XTZ</Typography>
                    </InputAdornment>
                  )
                }}
              />
            </ProposalFormInput>
          </Grid>
        </Grid>
      ) : state === Status.CONTRACT_VALIDATED ? (
        <>
          <Grid container direction="column" style={{ marginTop: 30, gap: 32 }}>
            <SubContainer item>
              <Title color="textPrimary">Calling Contract</Title>
              <Value>
                {isMobileSmall
                  ? toShortAddress(getIn(values, "destination_contract"))
                  : getIn(values, "destination_contract")}
              </Value>
            </SubContainer>
            <SubContainer item>
              <Title color="textPrimary">With an attached value of</Title>
              <Value>{getIn(values, "amount")} XTZ</Value>
            </SubContainer>
            <SubContainer item>
              <Title color="textPrimary">Contract Endpoint</Title>
              <ProposalFormInput>
                <SearchEndpoints endpoints={endpoints} handleChange={processParameters} />
              </ProposalFormInput>
            </SubContainer>
            {endpoint && (
              <SubContainer item>
                <FieldArray
                  name="parameters"
                  render={arrayHelpers => (
                    <Container>
                      {endpoint.parameters.length > 0 &&
                        endpoint.parameters.map((param, index) => (
                          <div key={index}>
                            <ProposalFormInput label={`Parameter ${index + 1}`} key={`${param.key}`}>
                              <Field
                                component={CustomFormikTextField}
                                name={`parameters.${index}`}
                                type={param.type === "number" ? "number" : "string"}
                                placeholder={`${param.key}`}
                                onChange={(newValue: any) => {
                                  setFieldValue(`parameters.${index}.value`, newValue.target.value, false)
                                  if (newValue.target.value === "") {
                                    setFieldError(`parameters.${index}`, "Required")
                                  }
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <TypeText>{`( ${param.type} )`}</TypeText>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </ProposalFormInput>
                            {errors.parameters && errors.parameters[index] ? (
                              <ErrorText>{errors.parameters[index]}</ErrorText>
                            ) : null}
                          </div>
                        ))}
                    </Container>
                  )}
                />
              </SubContainer>
            )}
          </Grid>
        </>
      ) : null}

      {state === Status.NEW_INTERACTION ? (
        <Grid container direction="row" justifyContent="flex-end" style={{ marginTop: 30 }} spacing={2}>
          <SmallButtonDialog variant="contained" disabled={shouldContinue} onClick={validateAddress}>
            Continue
          </SmallButtonDialog>
        </Grid>
      ) : state === Status.CONTRACT_VALIDATED ? (
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ marginTop: 30 }}
          spacing={2}
        >
          <Grid item xs={6} container alignItems="center">
            <BackButton onClick={goBack}>
              <BackButtonIcon />
              <Typography color="secondary">Back</Typography>
            </BackButton>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end">
            <SmallButtonDialog variant="contained" disabled={!isValid}>
              Submit
            </SmallButtonDialog>
          </Grid>
        </Grid>
      ) : null}
    </>
  )
}

export const ArbitraryContractInteractionForm: React.FC = () => {
  const isInvalidKtOrTzAddress = (address: string) =>
    validateContractAddress(address) !== 3 && validateAddress(address) !== 3

  const initialValue: ACIValues = {
    destination_contract: "",
    amount: 0,
    target_endpoint: "",
    parameters: []
  }

  const validateForm = (values: ACIValues) => {
    const errors: FormikErrors<ACIValues> = {}
    if (!values.destination_contract) {
      errors.destination_contract = "Required"
    }
    if (values.destination_contract && isInvalidKtOrTzAddress(values.destination_contract)) {
      errors.destination_contract = "Invalid contract address"
    }
    if (!values.target_endpoint) {
      errors.target_endpoint = "Required"
    }
    if (values.parameters && values.parameters.length > 0) {
      values.parameters.map((param: Parameter, index: number) => {
        if (!param.value || param.value === "") {
          errors.parameters = []
          errors.parameters[index] = "Required"
          errors.parameters.filter(Boolean)
        }
      })
    }
    return errors
  }

  const saveInfo = () => {
    console.log("saveInfo")
  }

  return (
    <Formik
      validateOnChange={true}
      validateOnBlur={true}
      validate={validateForm}
      onSubmit={saveInfo}
      initialValues={initialValue}
    >
      {({
        submitForm,
        isSubmitting,
        setFieldValue,
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldError,
        isValid
      }) => {
        return (
          <Form style={{ width: "100%" }}>
            <ContractInteractionForm
              submitForm={submitForm}
              isSubmitting={isSubmitting}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              values={values}
              setFieldTouched={setFieldTouched}
              setFieldError={setFieldError}
              isValid={isValid}
            />
          </Form>
        )
      }}
    </Formik>
  )
}
