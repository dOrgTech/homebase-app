/* eslint-disable react/display-name */
import { Grid, Typography, TextField, styled, makeStyles, CircularProgress } from "@material-ui/core"
import React, { useCallback, useEffect, useMemo } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormInput, ProposalFormTextarea } from "./ProposalFormInput"
// import { useProposeConfigChange } from "../../../services/contracts/baseDAO/hooks/useProposeConfigChange"
import { ResponsiveDialog } from "./ResponsiveDialog"
import Prism, { highlight, plugins } from "prismjs"
import Editor from "react-simple-code-editor"
import "prism-themes/themes/prism-night-owl.css"
import { MainButton } from "modules/common/MainButton"
import { SearchLambda } from "./styled/SearchLambda"
import { CheckOutlined } from "@material-ui/icons"
import { useLambdaAddPropose } from "services/contracts/baseDAO/hooks/useLambdaAddPropose"
import { useLambdaRemovePropose } from "services/contracts/baseDAO/hooks/useLambdaRemovePropose"
// import { RegistryDAO } from "services/contracts/baseDAO"
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

export enum ProposalAction {
  new,
  remove,
  execute,
  none
}

interface Props {
  open: boolean
  action: ProposalAction
  handleClose: () => void
}

enum LambdaProposalState {
  write_action,
  wallet_action,
  action_finished
}

export const ProposalFormLambda: React.FC<Props> = ({ open, handleClose, action }) => {
  const style = styles()
  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const grammar = Prism.languages.javascript

  const lambdaForm = useForm<Values>()
  const lambdaName = lambdaForm.watch("lambda_name")
  const [lambda, setLambda] = React.useState<Lambda | null>(null)
  const [state, setState] = React.useState<LambdaProposalState>(LambdaProposalState.wallet_action)
  const [lambdaParams, setLambdaParams] = React.useState<string>("")
  const [lambdaArguments, setLambdaArguments] = React.useState<string>("")
  const [code, setCode] = React.useState<string>(
    action === ProposalAction.new
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

  useEffect(() => {
    if (open) {
      setCode("")
      setState(LambdaProposalState.write_action)
      setLambda(null)
      lambdaForm.reset()
    }
  }, [open, lambdaForm])

  const { mutate: lambdaMutate } = useLambdaAddPropose()
  const { mutate: lambdaRemoveMutate } = useLambdaRemovePropose()
  const { mutate: lambdaExecuteMutate } = useLambdaExecutePropose()

  const daoLambdas = useDAOLambdas(daoId)

  const onSubmit = useCallback(
    (_: Values) => {
      if (action === ProposalAction.new) {
        const agoraPostId = Number(123)

        lambdaMutate({
          dao: dao as LambdaDAO,
          args: {
            agoraPostId,
            data: code
          }
        })
      } else if (action === ProposalAction.remove) {
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
    },
    [dao, lambdaMutate, code, action, lambda, lambdaRemoveMutate, lambdaArguments, lambdaExecuteMutate, lambdaParams]
  )

  const handleSearchChange = (data: Lambda) => {
    if (!data?.value) {
      lambdaForm.reset()
      setCode("")
      return
    }

    lambdaForm.setValue("lambda_name", data.key)
    setLambda(data)
    setCode(
      JSON.stringify(
        {
          code: JSON.parse(data.value.code),
          handler_check: JSON.parse(data.value.handler_check),
          is_active: data.value.is_active
        },
        null,
        2
      )
    )
    return
  }

  return (
    <FormProvider {...lambdaForm}>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        title={ProposalAction[action] + " Lambda Proposal"}
        template={"lambda"}
      >
        {state === LambdaProposalState.write_action ? (
          <>
            <Grid container direction={"row"} spacing={4}>
              <ProgressContainer item xs={6} container direction="column">
                <Grid item>
                  <ProposalFormInput label={"Lambda Name"}>
                    <Controller
                      control={lambdaForm.control}
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
                            <SearchLambda lambdas={daoLambdas} handleChange={handleSearchChange} />
                          </Grid>
                        )
                      }
                    />
                  </ProposalFormInput>
                </Grid>
                {action === 2 && lambdaForm.getValues("lambda_name") !== undefined ? (
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
              <StyledSendButton onClick={lambdaForm.handleSubmit(onSubmit as any)} disabled={!code || !lambdaName}>
                Submit
              </StyledSendButton>
            </StyledRow>
          </>
        ) : null}

        {state === LambdaProposalState.wallet_action ? (
          <>
            <LoadingContainer container direction="column" alignItems="center" justifyContent="center">
              <CircularProgress color="secondary" size={169} />
              <LoadingStateLabel>Confirm action in wallet</LoadingStateLabel>
            </LoadingContainer>
          </>
        ) : null}

        {state === LambdaProposalState.action_finished ? (
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
