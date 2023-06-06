import { Grid, Typography, TextField, styled, CircularProgress } from "@material-ui/core"
import React, { useCallback, useEffect } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
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
import { parseLambdaCode } from "utils"

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

const codeEditorcontainerstyles = {
  marginTop: "8px"
}

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

const codeEditorPlaceholder = {
  addLambda: `Write Michelson Code for Lambda's Implementation

Eg:-

(Left (Left (Pair (Pair { DROP ;
    NIL operation ;
    EMPTY_MAP string bytes ;
    NONE address ;
    PAIR ;
    PAIR }
  { DROP ; UNIT })
"sample")))
  `,
  existingLambda: `Choose a Lambda from the Dropdown, the implementation will appear here
  `,
  lambdaExecuteArgumentsCode: `Write Michelson Code for the input Paramerers of your Lambda

Eg:-

{
  "prim": "pair",
  "annots": [
    "%xtz_transfer_type"
  ],
  "args": [
    {
      "prim": "mutez",
      "annots": [
        "%amount"
      ]
    },
    {
      "prim": "address",
      "annots": [
        "%recipient"
      ]
    }
  ]
},
`,
  lambdaExecuteParams: `Enter the values for the given params in a JSON/JavaScript Object format.

Eg:-

{
  xtz_transfer_type: {
    amount: 10000000000000000000,
    recipient: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
  }
}
  `
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
  const [state, setState] = React.useState<LambdaProposalState>(LambdaProposalState.write_action)
  const [lambdaParams, setLambdaParams] = React.useState<string>("")
  const [lambdaArguments, setLambdaArguments] = React.useState<string>("")
  const [code, setCode] = React.useState<string>("")

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
      const agoraPostId = Number(0)

      switch (action) {
        case ProposalAction.new: {
          lambdaAdd({
            dao: dao as LambdaDAO,
            args: {
              agoraPostId,
              data: code
            },
            handleClose
          })

          break
        }

        case ProposalAction.remove: {
          if (!lambda) {
            // @TODO: Display Error
            return
          }

          setCode("")

          lambdaRemove({
            dao: dao as LambdaDAO,
            args: {
              agoraPostId,
              handler_name: lambda.key
            },
            handleClose
          })

          break
        }

        case ProposalAction.execute: {
          if (!lambda || lambdaArguments === "" || lambdaParams === "") {
            // @TODO: Display Error
            return
          }

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
            },
            handleClose
          })

          break
        }
        default:
        // @TODO: Display Error
      }
    },
    [dao, lambdaAdd, code, action, lambda, lambdaRemove, lambdaArguments, lambdaExecute, lambdaParams, handleClose]
  )

  const handleSearchChange = (data: Lambda) => {
    if (!data?.value) {
      lambdaForm.reset()
      setCode("")
      return
    }

    lambdaForm.setValue("lambda_name", data.key)
    setLambda(data)
    setCode(parseLambdaCode(data.value))
    return
  }

  const renderNewProposal = () => {
    return (
      <>
        <ProposalCodeEditorInput
          label="Implementation"
          containerstyle={codeEditorcontainerstyles}
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, grammar, "javascript")}
          placeholder={codeEditorPlaceholder.addLambda}
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
          containerstyle={codeEditorcontainerstyles}
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, grammar, "javascript")}
          placeholder={codeEditorPlaceholder.lambdaExecuteArgumentsCode}
        />
      </>
    )
  }

  const renderExecuteProposal = () => {
    return (
      <>
        <ProposalFormInput label="Lambda Name">
          <SearchLambda lambdas={daoLambdas} handleChange={handleSearchChange} />
        </ProposalFormInput>
        <ProposalCodeEditorInput
          label="Implementation"
          containerstyle={codeEditorcontainerstyles}
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, grammar, "javascript")}
          placeholder={codeEditorPlaceholder.existingLambda}
        />
        <ProposalCodeEditorInput
          label="Lambda Arguments Code"
          containerstyle={codeEditorcontainerstyles}
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          value={lambdaArguments}
          onValueChange={lambdaArguments => setLambdaArguments(lambdaArguments)}
          highlight={lambdaArguments => highlight(lambdaArguments, grammar, "javascript")}
          style={codeEditorStyles}
          placeholder={codeEditorPlaceholder.lambdaExecuteArgumentsCode}
        />
        <ProposalCodeEditorInput
          label="Lambda Params"
          containerstyle={codeEditorcontainerstyles}
          insertSpaces
          ignoreTabKey={false}
          tabSize={4}
          padding={10}
          style={codeEditorStyles}
          value={lambdaParams}
          onValueChange={lambdaParams => setLambdaParams(lambdaParams)}
          highlight={lambdaParams => highlight(lambdaParams, grammar, "javascript")}
          placeholder={codeEditorPlaceholder.lambdaExecuteParams}
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
        template="md"
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
