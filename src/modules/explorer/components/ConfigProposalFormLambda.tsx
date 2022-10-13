import { Grid, Typography, TextField, styled, CircularProgress } from "@material-ui/core"
import React, { useCallback, useEffect } from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useDAOID } from "../pages/DAO/router"
import { ProposalCodeEditorInput, ProposalFormInput } from "./ProposalFormInput"
import { ResponsiveDialog } from "./ResponsiveDialog"
import Prism, { highlight } from "prismjs"
import "prism-themes/themes/prism-night-owl.css"
import { MainButton } from "modules/common/MainButton"
import { SearchLambda } from "./styled/SearchLambda"
import { CheckOutlined } from "@material-ui/icons"
import { useLambdaAddPropose } from "services/contracts/baseDAO/hooks/useLambdaAddPropose"
import { useLambdaRemovePropose } from "services/contracts/baseDAO/hooks/useLambdaRemovePropose"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"
import { useDAOLambdas } from "services/contracts/baseDAO/hooks/useDAOLambdas"
import { Lambda } from "services/bakingBad/lambdas/types"
import { useLambdaExecutePropose } from "services/contracts/baseDAO/hooks/useLambdaExecutePropose"

const StyledSendButton = styled(MainButton)(({ theme }) => ({
  width: 101,
  color: "#1C1F23"
}))

const StyledRow = styled(Grid)({
  marginTop: 30
})

const LoadingContainer = styled(Grid)({
  minHeight: 651
})

const LoadingStateLabel = styled(Typography)({
  marginTop: 40
})

const CheckIcon = styled(CheckOutlined)({
  fontSize: 169
})

const codeEditorStyles = {
  minHeight: 500,
  fontFamily: "Roboto Mono",
  fontSize: 14,
  fontWeight: 400,
  outlineWidth: 0
}

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

const getCodeByProposalAction = (action: ProposalAction) => {
  switch (action) {
    case ProposalAction.new: {
      return `const allowances = new MichelsonMap();
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
    }
    default:
      return ""
  }
}

export const ProposalFormLambda: React.FC<Props> = ({ open, handleClose, action }) => {
  const grammar = Prism.languages.javascript

  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const daoLambdas = useDAOLambdas(daoId)

  const { mutate: lambdaAdd } = useLambdaAddPropose()
  const { mutate: lambdaRemove } = useLambdaRemovePropose()
  const { mutate: lambdaExecute } = useLambdaExecutePropose()

  const lambdaForm = useForm<Values>()

  const [lambda, setLambda] = React.useState<Lambda | null>(null)
  const [state, setState] = React.useState<LambdaProposalState>(LambdaProposalState.wallet_action)
  const [lambdaParams, setLambdaParams] = React.useState<string>("")
  const [lambdaArguments, setLambdaArguments] = React.useState<string>("")
  const [code, setCode] = React.useState<string>(getCodeByProposalAction(action))

  useEffect(() => {
    if (open) {
      setCode("")
      setState(LambdaProposalState.write_action)
      setLambda(null)
      lambdaForm.reset()
    }
  }, [open, lambdaForm])

  const onSubmit = useCallback(
    (_: Values) => {
      const agoraPostId = Number(123)

      switch (action) {
        case ProposalAction.new: {
          lambdaAdd({
            dao: dao as LambdaDAO,
            args: {
              agoraPostId,
              data: code
            }
          })
          break
        }

        case ProposalAction.remove: {
          if (!lambda) {
            // @TODO: Display Error
            return
          }

          setState(LambdaProposalState.wallet_action)
          setCode("")

          lambdaRemove({
            dao: dao as LambdaDAO,
            args: {
              agoraPostId,
              handler_name: lambda.key
            }
          })
          break
        }

        case ProposalAction.execute: {
          if (!lambda || lambdaArguments === "" || lambdaParams === "") {
            // @TODO: Display Error
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

          lambdaExecute({
            dao: dao as LambdaDAO,
            args: {
              agoraPostId,
              handler_name: lambda.key,
              handler_code,
              handler_params: lambdaParams,
              lambda_arguments: lambdaArguments
            }
          })
          break
        }
        default:
        // @TODO: Display Error
      }
    },
    [dao, lambdaAdd, code, action, lambda, lambdaRemove, lambdaArguments, lambdaExecute, lambdaParams]
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

  const renderNewProposal = () => {
    return (
      <>
        <ProposalFormInput label="Lambda Name">
          <Controller
            control={lambdaForm.control}
            name="lambda_name"
            render={({ field }) => (
              <TextField {...field} placeholder="Enter Lambda Name" InputProps={{ disableUnderline: true }} />
            )}
          />
        </ProposalFormInput>
        <ProposalCodeEditorInput
          label="Implementation"
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, grammar, "javascript")}
        />
      </>
    )
  }

  const renderRemoveProposal = () => {
    return (
      <>
        <ProposalFormInput label="Lambda Name">
          <SearchLambda lambdas={daoLambdas} handleChange={handleSearchChange} />
        </ProposalFormInput>
        <ProposalCodeEditorInput
          label="Implementation"
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, grammar, "javascript")}
        />
      </>
    )
  }

  const renderExecuteProposal = () => {
    return (
      <>
        <ProposalCodeEditorInput
          label="Lambda Arguments Code"
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          value={lambdaArguments}
          onValueChange={lambdaArguments => setLambdaArguments(lambdaArguments)}
          highlight={lambdaArguments => highlight(lambdaArguments, grammar, "javascript")}
          style={codeEditorStyles}
        />
        <ProposalCodeEditorInput
          label="Lambda Params"
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={lambdaParams}
          onValueChange={lambdaParams => setLambdaParams(lambdaParams)}
          highlight={lambdaParams => highlight(lambdaParams, grammar, "javascript")}
        />
        <ProposalCodeEditorInput
          label="Implementation"
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, grammar, "javascript")}
        />
      </>
    )
  }

  return (
    <FormProvider {...lambdaForm}>
      <ResponsiveDialog
        open={open}
        onClose={handleClose}
        title={ProposalAction[action] + " Lambda Proposal"}
        template="lambda"
      >
        {state === LambdaProposalState.write_action ? (
          <>
            <Grid container direction="row" spacing={4}>
              {action === ProposalAction.new ? renderNewProposal() : null}
              {action === ProposalAction.remove ? renderRemoveProposal() : null}
              {action === ProposalAction.execute ? renderExecuteProposal() : null}
            </Grid>

            <StyledRow container direction="row" spacing={4} justifyContent="flex-end">
              <StyledSendButton onClick={lambdaForm.handleSubmit(onSubmit)} disabled={!code}>
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
