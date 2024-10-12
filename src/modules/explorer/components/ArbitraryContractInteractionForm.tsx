import React, { useMemo, useState } from "react"
import {
  CircularProgress,
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
import { validateContractAddress } from "@taquito/utils"
import { Field, FieldArray, Form, Formik, FormikErrors, getIn } from "formik"
import { SmallButtonDialog } from "modules/common/SmallButton"
import { ArrowBackIos } from "@material-ui/icons"
import { ContractEndpoint, SearchEndpoints } from "./SearchEndpoints"
import { formatUnits, toShortAddress } from "services/contracts/utils"
import { useArbitraryContractData } from "services/aci/useArbitratyContractData"
import { useTezos } from "services/beacon/hooks/useTezos"
import { ArbitraryContract } from "models/Contract"
import { evalTaquitoParam, generateExecuteContractMichelson } from "services/aci"
import { emitMicheline, MichelsonType, Parser } from "@taquito/michel-codec"
import ProposalExecuteForm from "./ProposalExecuteForm"
import { useLambdaExecutePropose } from "services/contracts/baseDAO/hooks/useLambdaExecutePropose"
import { Expr, MichelsonData, packDataBytes } from "@taquito/michel-codec"
import { BaseDAO, getContract } from "services/contracts/baseDAO"
import { TezosToolkit } from "@taquito/taquito"
import { Schema } from "@taquito/michelson-encoder"
import BigNumber from "bignumber.js"

// Base ACI Lambda
const aciBaseLambda = {
  code: `Left (Left (Pair (Pair { UNPAIR; UNPAIR; SWAP; UNPACK (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (bytes %packed_argument)); ASSERT_SOME; UNPAIR; DIP{ SWAP; PAIR; PAIR}; SWAP; EXEC} {DROP; UNIT}) "simple_lambda"))`,
  type: `(or (or (pair %add_handler (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (lambda %handler_check (pair bytes (map string bytes)) unit)) (string %name)) (pair %execute_handler (string %handler_name) (bytes %packed_argument))) (string %remove_handler))`
}

const aciLambda = {
  code: 'Pair {NIL operation; PUSH address "KT1T17GC91HrJ8ijZgnMaE9j4PZbojbVAn73"; CONTRACT %change_string string; ASSERT_SOME ;PUSH mutez 0;PUSH string "new string"; TRANSFER_TOKENS; CONS; SWAP; CAR; CAR; NONE address; PAIR; PAIR} 0x',
  type: `pair (lambda (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) bytes`
}

const executionLambda = {
  code: (hash: string, executionLambdaName = "simple_lambda_3") =>
    `(Left (Right (Pair "${executionLambdaName}" 0x${hash})))`,
  type: "(or (or (pair %add_handler (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (lambda %handler_check (pair bytes (map string bytes)) unit)) (string %name)) (pair %execute_handler (string %handler_name) (bytes %packed_argument))) (string %remove_handler))"
}

async function packLambda(tezos: TezosToolkit, lambdaCode: string, lambdaType: string): Promise<string> {
  console.log("PACKLAMBDA", lambdaCode, lambdaType)
  const parser = new Parser()
  const michelsonData = lambdaCode
  const mData = parser.parseData(michelsonData)
  const michelsonType = parser.parseData(lambdaType)
  const { packed } = await tezos.rpc.packData({
    data: mData as unknown as MichelsonData,
    type: michelsonType as unknown as Expr
  })
  return packed
}

async function prepareContractData(
  tezos: TezosToolkit,
  lambdaCode: string,
  lambdaType: string,
  contractAddress: string
): Promise<string> {
  console.log({ lambdaCode })

  /**
   * This needs to be deployed to the DAO
   * e.g, https://better-call.dev/ghostnet/KT1VG3ynsnyxFGzw9mdBwYnyZAF8HZvqnNkw/storage/big_map/336003/keys
   *
   * If not, we need to create a proposal to just deploy it first.
   * */
  // const packedBaseAci = await packLambda(tezos, aciBaseLambda.code, aciBaseLambda.type)
  // console.log("ACILambdaCode", lambdaCode, packedBaseAci)

  const packedLambdaBytes = await packLambda(tezos, `Pair ${lambdaCode} 0x`, lambdaType)
  const execLambdaCode = executionLambda.code(packedLambdaBytes, "simple_lambda_3")
  const execLambdaType = executionLambda.type
  const finalPackedDataBytes = await packLambda(tezos, execLambdaCode, execLambdaType)

  // const finalPackedData = await packLambda(tezos, executionLambda.code(packedLambda, "simple_lambda_3"), executionLambda.type)

  const contract = await getContract(tezos, "KT1VG3ynsnyxFGzw9mdBwYnyZAF8HZvqnNkw")

  // TODO: Replace with actual frozn token value
  const frozenToken = formatUnits(new BigNumber(10000), 6)
  const contractMethod = contract.methods.propose(await tezos.wallet.pkh(), frozenToken, finalPackedDataBytes)

  // const result = await contractMethod.send()
  // console.log("RESULT", result)

  return finalPackedDataBytes

  // return contractMethod.send()
}

async function packLambdaExp(tezos: TezosToolkit, lambdaCode: string): Promise<string> {
  // const aciLambda = `Left (Left (Pair (Pair { UNPAIR; UNPAIR; SWAP; UNPACK (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (bytes %packed_argument)); ASSERT_SOME; UNPAIR; DIP{ SWAP; PAIR; PAIR}; SWAP; EXEC} {DROP; UNIT}) "simple_lambda"))' of type '(or (or (pair %add_handler (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (lambda %handler_check (pair bytes (map string bytes)) unit)) (string %name)) (pair %execute_handler (string %handler_name) (bytes %packed_argument))) (string %remove_handler))`
  const parser = new Parser()
  const michelsonData = `Left (Left (Pair (Pair { UNPAIR; UNPAIR; SWAP; UNPACK (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (bytes %packed_argument)); ASSERT_SOME; UNPAIR; DIP{ SWAP; PAIR; PAIR}; SWAP; EXEC} {DROP; UNIT}) "simple_lambda"))`
  const dataToPack = parser.parseMichelineExpression(michelsonData)

  const mData = parser.parseData(michelsonData)

  const michelsonType = parser.parseData(
    `(or (or (pair %add_handler (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (lambda %handler_check (pair bytes (map string bytes)) unit)) (string %name)) (pair %execute_handler (string %handler_name) (bytes %packed_argument))) (string %remove_handler))`
  )
  const schema = new Schema(michelsonType as unknown as Expr)
  // const data = schema.Encode(dataToPack)
  const { packed } = await tezos.rpc.packData({
    data: mData as unknown as MichelsonData,
    type: michelsonType as unknown as Expr
  })
  return packed
  // ==============================
  // const parser = new Parser()
  // const michelsonData = `Left (Left (Pair (Pair { UNPAIR; UNPAIR; SWAP; UNPACK (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (bytes %packed_argument)); ASSERT_SOME; UNPAIR; DIP{ SWAP; PAIR; PAIR}; SWAP; EXEC} {DROP; UNIT}) "simple_lambda"))`
  // const dataToPack = parser.parseMichelineExpression(michelsonData)

  // const michelsonType = `(or (or (pair %add_handler (pair (lambda %code (pair (pair (map %handler_storage string bytes) (bytes %packed_argument)) (pair %proposal_info (address %from) (nat %frozen_token) (bytes %proposal_metadata))) (pair (pair (option %guardian address) (map %handler_storage string bytes)) (list %operations operation))) (lambda %handler_check (pair bytes (map string bytes)) unit)) (string %name)) (pair %execute_handler (string %handler_name) (bytes %packed_argument))) (string %remove_handler))`
  // const typeToPack = parser.parseMichelineExpression(michelsonType)
  // console.log("typeToPack", typeToPack)
  // console.log("dataToPack", dataToPack)

  // const metadata = packDataBytes(dataToPack as unknown as MichelsonData, typeToPack as unknown as MichelsonType)

  // ==============================
  // const lambda = parser.parseMichelineExpression(aciLambda) as MichelsonData
  // console.log("lambda", lambda)
  // const metadata = packDataBytes(lambda, {
  //   prim: "lambda",
  //   args: [{ prim: "unit" }, { prim: "unit" }]
  // } as unknown as MichelsonType)

  // const metadata = await BaseDAO.encodeLambdaAddMetadata(
  //   { prim: "lambda", args: [{ prim: "unit" }] },
  //   aciLambda,
  //   {} as unknown as TezosToolkit
  // )
  // ==============================

  // const lambda = parser.parseMichelineExpression(
  // )
  // const typeJson = parser.parseMichelineExpression("lambda")
  // console.log("lambda", { lambda, typeJson })
  // const packed = packDataBytes(lambda as unknown as MichelsonData, typeJson as unknown as MichelsonType)
  // return packed.bytes
}

interface Parameter {
  key: string
  type: string
  value?: any
}

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
  destination_contract: any
  destination_contract_address: string
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
  isValid,
  showHeader
}: any) => {
  const [state, setState] = useState<Status>(Status.NEW_INTERACTION)
  const [formState, setFormState] = useState<any>({ address: "", amount: 0, shape: {} })
  const [endpoint, setEndpoint] = useState<ContractEndpoint | undefined>(undefined)
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const { mutate: fetchContractData, data } = useArbitraryContractData()
  // console.log("FormData", data)
  const { tezos, network } = useTezos()
  const [isLoading, setIsLoading] = useState(false)

  const shouldContinue = useMemo(() => {
    if (values.destination_contract_address !== "" && !errors.destination_contract_address) {
      return false
    }
    return true
  }, [values, errors])

  const validateAddress = () => {
    if (getIn(values, "amount") === "") {
      setFieldValue("amount", 0)
    }
    setIsLoading(true)
    fetchContractData({
      contract: getIn(values, "destination_contract_address"),
      network: network,
      handleContinue: () => setState(Status.CONTRACT_VALIDATED),
      finishLoad: () => setIsLoading(false),
      showHeader: () => showHeader(false)
    })
  }

  const processParameters = (data: ContractEndpoint) => {
    setEndpoint(data)
    setFieldValue("parameters", data.params)
    setFieldValue("target_endpoint", data.name)
  }

  const goBack = () => {
    showHeader(true)
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
                id="destination_contract_address"
                placeholder="Enter Address"
                name="destination_contract_address"
                component={CustomFormikTextField}
                onClick={() => setFieldTouched("destination_contract_address")}
                onChange={(newValue: any) => {
                  const contractAddress = newValue.target.value.trim()
                  console.log("Destination Contract Address", contractAddress)
                  setFieldValue("destination_contract_address", contractAddress)

                  if (validateContractAddress(contractAddress) === 3) {
                    tezos.contract.at(contractAddress).then((contract: any) => {
                      setFieldValue("destination_contract", contract)
                    })
                  } else {
                    console.log("invalid address", contractAddress)
                  }
                }}
                value={getIn(values, "destination_contract_address")}
                inputProps={{
                  maxLength: 36
                }}
              />
            </ProposalFormInput>
            {errors.destination_contract_address && touched.destination_contract_address ? (
              <ErrorText>{errors.destination_contract_address}</ErrorText>
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
                  ? toShortAddress(getIn(values, "destination_contract_address"))
                  : getIn(values, "destination_contract_address")}
              </Value>
            </SubContainer>
            <SubContainer item>
              <Title color="textPrimary">With an attached value of</Title>
              <Value>{getIn(values, "amount")} XTZ</Value>
            </SubContainer>
            <SubContainer item>
              <Title color="textPrimary">Contract Endpoint</Title>
              <ProposalExecuteForm
                address={values.destination_contract_address}
                amount={values.amount}
                shape={formState.shape}
                reset={() => setFormState({ address: "", amount: 0, shape: {} })}
                setField={(lambdaCode: string, metadata: string) => {
                  // debugger

                  console.log("SetField", lambdaCode, metadata, values.destination_contract_address)

                  prepareContractData(tezos, lambdaCode, aciLambda.type, values.destination_contract_address).then(
                    (packedBytes: string) => {
                      console.log("Packed LambdaX", packedBytes)
                    }
                  )
                }}
                setLoading={() => {}}
                setState={shape => {
                  // debugger
                  console.log("New Shape", shape)
                  setFormState((v: any) => ({ ...v, shape }))
                }}
                onReset={() => {
                  setFormState({ address: "", amount: 0, shape: {} })
                  // props.onReset()
                }}
                loading={false}
                onShapeChange={shapeInitValue => {
                  setFormState((v: any) => ({
                    ...v,
                    shape: { ...v?.shape, ...shapeInitValue }
                  }))
                }}
              />
            </SubContainer>

            {/* ACI: Endpoint list */}
            {endpoint && (
              <SubContainer item>
                <FieldArray
                  name="parameters"
                  render={arrayHelpers => (
                    <Container>
                      {endpoint.params.length > 0 &&
                        endpoint.params.map((param, index) => (
                          <div key={index}>
                            <ProposalFormInput label={`Parameter ${index + 1}`} key={`${param.placeholder}`}>
                              <Field
                                component={CustomFormikTextField}
                                name={`parameters.${index}`}
                                type={param.type === "nat" || param.type === "init" ? "number" : "string"}
                                placeholder={`${param.placeholder}`}
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
          {isLoading ? (
            <CircularProgress color="secondary" size={30} />
          ) : (
            <SmallButtonDialog variant="contained" disabled={shouldContinue} onClick={validateAddress}>
              Continue
            </SmallButtonDialog>
          )}
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
            <SmallButtonDialog
              onClick={() => {
                console.log({ formState })
                // debugger
                let entrypoint = formState.shape.token.initValue // accept_ownership | default etc
                let taquitoParam

                const execContract = formState.shape.contract
                const taquitoFullParam = evalTaquitoParam(formState.shape.token, formState.shape.init)
                if (execContract?.parameterSchema.isMultipleEntryPoint) {
                  const p = Object.entries(taquitoFullParam)
                  if (p.length !== 1) {
                    throw new Error("should only one entrypoint is selected")
                  }
                  ;[entrypoint, taquitoParam] = p[0]
                } else {
                  taquitoParam = taquitoFullParam
                }
                const param = emitMicheline(
                  execContract?.methodsObject[entrypoint](taquitoParam).toTransferParams()?.parameter?.value
                )

                const micheline_type = execContract?.parameterSchema.isMultipleEntryPoint
                  ? execContract?.entrypoints.entrypoints[entrypoint]
                  : execContract?.parameterSchema.root.val

                // const micheline_type = values.destination_contract?.parameterSchema.isMultipleEntryPoint
                //   ? values.destination_contract.entrypoints.entrypoints[entrypoint]
                //   : values.destination_contract?.parameterSchema.root.val

                const p = new Parser()
                const type = emitMicheline(p.parseJSON(micheline_type), {
                  indent: "",
                  newline: ""
                })

                const lambda = generateExecuteContractMichelson("1.0.0", {
                  address: values.destination_contract_address,
                  entrypoint,
                  type,
                  amount: values.amount,
                  param
                })

                // TODO: Deploy this to DAO
                console.log({ lambda })
              }}
              variant="contained"
              disabled={!isValid}
            >
              Submit Form
            </SmallButtonDialog>
          </Grid>
        </Grid>
      ) : null}
    </>
  )
}

export const ArbitraryContractInteractionForm: React.FC<{ showHeader: (state: boolean) => void }> = ({
  showHeader
}) => {
  const { mutate: executeProposeLambda } = useLambdaExecutePropose()
  const isInvalidKtOrTzAddress = (address: string) => validateContractAddress(address) !== 3

  const initialValue: ACIValues = {
    destination_contract: {} as ArbitraryContract,
    destination_contract_address: "",
    amount: 0,
    target_endpoint: "",
    parameters: []
  }

  const validateForm = (values: ACIValues) => {
    console.log("validateFormValues", values)
    return {}
    const errors: FormikErrors<ACIValues> = {}
    if (!values.destination_contract_address) {
      errors.destination_contract_address = "Required"
    }
    if (values.destination_contract_address && isInvalidKtOrTzAddress(values.destination_contract_address)) {
      errors.destination_contract_address = "Invalid contract address"
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

  const interact = () => {
    console.log("saveInfo")
  }

  return (
    <Formik
      validateOnChange={true}
      validateOnBlur={true}
      validate={validateForm}
      onSubmit={interact}
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
              showHeader={showHeader}
            />
          </Form>
        )
      }}
    </Formik>
  )
}
