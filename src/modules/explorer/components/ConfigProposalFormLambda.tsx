/* eslint-disable react/display-name */
import { Grid, Typography, TextField, styled, makeStyles, CircularProgress } from "@material-ui/core"
import React, { useCallback, useEffect, useMemo } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormInput, ProposalFormTextarea } from "./ProposalFormInput"
import { useProposeConfigChange } from "../../../services/contracts/baseDAO/hooks/useProposeConfigChange"
import { ResponsiveDialog } from "./ResponsiveDialog"
import Prism, { highlight, plugins } from "prismjs"
import Editor from "react-simple-code-editor"
import "prism-themes/themes/prism-night-owl.css"
import { MainButton } from "modules/common/MainButton"
import { SearchLambda } from "./styled/SearchLambda"
import { CheckOutlined } from "@material-ui/icons"
import { useLambdaAddPropose } from "services/contracts/baseDAO/hooks/useLambdaAddPropose"
import { useLambdaRemovePropose } from "services/contracts/baseDAO/hooks/useLambdaRemovePropose"
import { RegistryDAO } from "services/contracts/baseDAO"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"
import { useDAOLambdas } from "services/contracts/baseDAO/hooks/useDAOLambdas"
import { Lambda } from "services/bakingBad/lambdas/types"
import { useLambdaExecutePropose } from "services/contracts/baseDAO/hooks/useLambdaExecutePropose"

const StyledSendButton = styled(MainButton)(({ theme }) => ({
  width: 101,
  color: "#1C1F23"
}))

type LambdaValues = {
  label: string
  code: string
  type: string
  parameters: any
}

const StyledRow = styled(Grid)({
  marginTop: 30
})

const ProgressContainer = styled(Grid)(({ theme }) => ({
  maxHeight: 600,
  display: "block",
  overflowY: "scroll"
}))

const MarginContainer = styled(Grid)({
  marginTop: 32
})

const LoadingContainer = styled(Grid)({
  minHeight: 651
})

const LoadingStateLabel = styled(Typography)({
  marginTop: 40
})

const ParameterTitle = styled(Typography)({
  marginBottom: 18
})

const CustomEditor = styled(Editor)({
  "& textarea": {
    outline: "none !important"
  },
  "& textarea:focus-visited": {
    outline: "none !important"
  }
})

const CheckIcon = styled(CheckOutlined)({
  fontSize: 169
})

const styles = makeStyles({
  textarea: {
    minHeight: 500,
    maxHeight: 500,
    overflow: "scroll"
  }
})

type LambdaParameter = {
  name: string
  type: string
  value: any
  isOptional: boolean
}

type Values = {
  lambda_name: string
  lambda_contract?: string
  lambda_token_address?: string
  lambda_parameters?: Array<LambdaParameter>
}

enum ProposalModalKey {
  new,
  remove,
  execute
}
interface Props {
  open: boolean
  action: any
  handleClose: () => void
}

enum LambdaProposalState {
  write_action,
  wallet_action,
  action_finished
}

export const ProposalFormLambda: React.FC<Props> = ({ open, handleClose, action }) => {
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  console.log("dao: ", dao)
  const style = styles()

  const methods = useForm<Values>()
  const lambdaName = methods.watch("lambda_name")
  const grammar = Prism.languages.javascript

  const [lambda, setLambda] = React.useState<Lambda | null>(null)
  const [state, setState] = React.useState<LambdaProposalState>(LambdaProposalState.wallet_action)
  const [lambdaParams, setLambdaParams] = React.useState<string>("")
  const [lambdaArguments, setLambdaArguments] = React.useState<string>("")

  const [code, setCode] = React.useState<string>(
    action === 0
      ? `const allowances = new MichelsonMap();
  const ledger = new MichelsonMap();
  ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });

  const opknownBigMapContract = await tezos.contract.originate({
    code: knownBigMapContract,
    storage: {
      ledger,
      owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      totalSupply: '100',
    },
  });   
}`
      : ""
  )

  // const lambdaOptions = [
  //   {
  //     label: "sample",
  //     code: `const allowances = new MichelsonMap();
  //     const ledger = new MichelsonMap();
  //     ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });`,
  //     type: "read",
  //     parameters: [
  //       {
  //         name: "conversionRate",
  //         type: "number",
  //         value: undefined
  //       }
  //     ]
  //   },
  //   {
  //     label: "addPaymentToken",
  //     code: `const tokens = new MichelsonMap();
  //     const ledger = new MichelsonMap();
  //     ledger.set('', { tokens, balance: '100' });`,
  //     type: "write",
  //     parameters: [
  //       {
  //         name: "conversionRate",
  //         type: "number",
  //         value: undefined,
  //         isOptional: false
  //       },
  //       {
  //         name: "price",
  //         type: "number",
  //         value: undefined,
  //         isOptional: true
  //       },
  //       {
  //         name: "gasFee",
  //         type: "number",
  //         value: undefined,
  //         isOptional: true
  //       }
  //     ]
  //   },
  //   {
  //     label: "clientProjects",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "write"
  //   },
  //   {
  //     label: "defaultPollValues",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "write"
  //   },
  //   {
  //     label: "setConversionRates",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "write"
  //   },
  //   {
  //     label: "addPaymentToken",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "write"
  //   },
  //   {
  //     label: "clientProjects",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "write"
  //   },
  //   {
  //     label: "defaultPollValues",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "write"
  //   },
  //   {
  //     label: "setConversionRates",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "read"
  //   },
  //   {
  //     label: "clientProjects",
  //     code: `const clients = new MichelsonMap();
  //     ledger.set('', { clients, balance: '100' });`,
  //     type: "write"
  //   }
  // ]

  useEffect(() => {
    if (open) {
      setCode("")
      setState(LambdaProposalState.write_action)
      setLambda(null)
      methods.reset()
    }
  }, [open, methods])

  const { mutate: lambdaMutate } = useLambdaAddPropose()
  const { mutate: lambdaRemoveMutate } = useLambdaRemovePropose()
  const { mutate: lambdaExecuteMutate } = useLambdaExecutePropose()

  const daoLambdas = useDAOLambdas(daoId)

  const onSubmit = useCallback(
    (values: Values) => {
      if (action === ProposalModalKey.new) {
        const agoraPostId = Number(123)

        lambdaMutate({
          dao: dao as LambdaDAO,
          args: {
            agoraPostId,
            data: code
          }
        })
      } else if (action === ProposalModalKey.remove) {
        if (!lambda) {
          return
        }

        setState(LambdaProposalState.wallet_action)
        setCode("")

        const agoraPostId = Number(123)

        lambdaRemoveMutate({
          dao: dao as LambdaDAO,
          args: {
            agoraPostId,
            handler_name: lambda.key
          }
        })
      } else {
        const agoraPostId = Number(123)
        if (!lambda || lambdaArguments === "" || lambdaParams === "") {
          return
        }

        setState(LambdaProposalState.wallet_action)
        setCode("")

        const lambdaCode = JSON.parse(code)

        const handler_code = {
          code: JSON.stringify(lambdaCode.code),
          handler_check: JSON.stringify(lambdaCode.handler_check),
          is_active: lambdaCode.is_active
        }

        lambdaExecuteMutate({
          dao: dao as LambdaDAO,
          args: {
            agoraPostId,
            handler_name: lambda.key,
            handler_code,
            handler_params: lambdaParams,
            lambda_arguments: lambdaArguments
          }
        })
      }

      // setTimeout(() => {
      //   setState(LambdaProposalState.action_finished);
      // }, 3000);
    },
    [dao, lambdaMutate, code, action, lambda, lambdaRemoveMutate, lambdaArguments, lambdaExecuteMutate, lambdaParams]
  )

  const handleChange = (data: Lambda) => {
    if (data?.value) {
      setLambda(data)
      methods.setValue("lambda_name", data.key)

      const lambdaCode = {
        code: JSON.parse(data.value.code),
        handler_check: JSON.parse(data.value.handler_check),
        is_active: data.value.is_active
      }

      setCode(JSON.stringify(lambdaCode, null, 2))
      return
    }
    methods.reset()
    setCode("")
    return
  }

  return (
    <FormProvider {...methods}>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        title={ProposalModalKey[action] + " Lambda Proposal"}
        template={"lambda"}
      >
        {state === LambdaProposalState.write_action ? (
          <>
            <Grid container direction={"row"} spacing={4}>
              <ProgressContainer item xs={6} container direction="column">
                <Grid item>
                  <ProposalFormInput label={"Lambda Name"}>
                    <Controller
                      control={methods.control}
                      name={`lambda_name`}
                      render={({ field }) =>
                        action === 0 ? (
                          <TextField
                            {...field}
                            placeholder="Enter Lambda Name"
                            InputProps={{ disableUnderline: true }}
                          />
                        ) : (
                          <Grid>
                            <SearchLambda lambdas={daoLambdas} handleChange={handleChange} />
                          </Grid>
                        )
                      }
                    />
                  </ProposalFormInput>
                </Grid>
                {action === 2 && methods.getValues("lambda_name") !== undefined ? (
                  <>
                    <ProposalFormTextarea label={"Lambda Arguments Code"}>
                      <CustomEditor
                        disabled={!(action === 2)}
                        textareaClassName={style.textarea}
                        preClassName={style.textarea}
                        value={lambdaArguments}
                        onValueChange={lambdaArguments => setLambdaArguments(lambdaArguments)}
                        highlight={lambdaArguments => highlight(lambdaArguments, grammar, "javascript")}
                        padding={10}
                        style={{
                          fontFamily: "Roboto Mono",
                          fontSize: 14,
                          fontWeight: 400,
                          outlineWidth: 0
                        }}
                      />
                    </ProposalFormTextarea>

                    <ProposalFormTextarea label={"Lambda Params"}>
                      <CustomEditor
                        disabled={!(action === 2)}
                        textareaClassName={style.textarea}
                        preClassName={style.textarea}
                        value={lambdaParams}
                        onValueChange={lambdaParams => setLambdaParams(lambdaParams)}
                        highlight={lambdaParams => highlight(lambdaParams, grammar, "javascript")}
                        padding={10}
                        style={{
                          fontFamily: "Roboto Mono",
                          fontSize: 14,
                          fontWeight: 400,
                          outlineWidth: 0
                        }}
                      />
                    </ProposalFormTextarea>
                    {/* <MarginContainer item>
                      <ProposalFormInput label={"Contract"}>
                        <Controller
                          control={methods.control}
                          name={`lambda_contract`}
                          render={({ field }) => (
                            <TextField {...field} placeholder="Enter Address" InputProps={{ disableUnderline: true }} />
                          )}
                        />
                      </ProposalFormInput>
                    </MarginContainer>

                    <MarginContainer item>
                      <ProposalFormInput label={"Token Address"}>
                        <Controller
                          control={methods.control}
                          name={`lambda_token_address`}
                          render={({ field }) => (
                            <TextField {...field} placeholder="Enter Address" InputProps={{ disableUnderline: true }} />
                          )}
                        />
                      </ProposalFormInput>
                    </MarginContainer> */}

                    {/* {lambda && lambda.parameters ? (
                      <>
                        {lambda.parameters.map((valueItem: LambdaParameter, i: number) => (
                          <MarginContainer item key={valueItem.name + i}>
                            <ParameterTitle style={{ gap: 18 }}>
                              {valueItem.name} {valueItem.isOptional ? "(optional)" : null}
                            </ParameterTitle>
                            <ProposalFormInput>
                              <Controller
                                control={methods.control}
                                name={`lambda_parameters.${i}.value`}
                                render={({ field }) => (
                                  <TextField
                                    required={valueItem.isOptional}
                                    {...field}
                                    placeholder={valueItem.type}
                                    InputProps={{ disableUnderline: true }}
                                  />
                                )}
                              />
                            </ProposalFormInput>
                          </MarginContainer>
                        ))}
                      </>
                    ) : null} */}
                  </>
                ) : null}
              </ProgressContainer>
              <Grid item xs={6} container direction="column">
                <ProposalFormTextarea label={"Implementation"}>
                  <CustomEditor
                    disabled={action !== 0}
                    textareaClassName={style.textarea}
                    preClassName={style.textarea}
                    value={code}
                    onValueChange={code => setCode(code)}
                    highlight={code => highlight(code, grammar, "javascript")}
                    padding={10}
                    style={{
                      fontFamily: "Roboto Mono",
                      fontSize: 14,
                      fontWeight: 400,
                      outlineWidth: 0
                    }}
                  />
                </ProposalFormTextarea>
              </Grid>
            </Grid>

            <StyledRow container direction={"row"} spacing={4} justifyContent="flex-end">
              <StyledSendButton onClick={methods.handleSubmit(onSubmit as any)} disabled={!code || !lambdaName}>
                Submit
              </StyledSendButton>
            </StyledRow>
          </>
        ) : state === LambdaProposalState.wallet_action ? (
          <>
            <LoadingContainer container direction="column" alignItems="center" justifyContent="center">
              <CircularProgress color="secondary" size={169} />
              <LoadingStateLabel>Confirm action in wallet</LoadingStateLabel>
            </LoadingContainer>
          </>
        ) : state === LambdaProposalState.action_finished ? (
          <>
            <LoadingContainer container direction="column" alignItems="center" justifyContent="center">
              <CheckIcon color="secondary" />
              <LoadingStateLabel>Proposal created</LoadingStateLabel>
            </LoadingContainer>
          </>
        ) : null}
      </ResponsiveDialog>
    </FormProvider>
  )
}