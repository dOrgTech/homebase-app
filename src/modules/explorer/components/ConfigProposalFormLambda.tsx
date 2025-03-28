import { Grid, CircularProgress, Typography } from "@material-ui/core"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { FormProvider, useForm } from "react-hook-form"
import { useDAOID } from "../pages/DAO/router"
import { ProposalCodeEditorInput, ProposalFormInput } from "./ProposalFormInput"
import { ResponsiveDialog } from "./ResponsiveDialog"
import Prism, { highlight } from "prismjs"
import "prism-themes/themes/prism-night-owl.css"
import { StyledSendButton } from "modules/common/StyledSendButton"
import { SearchLambda } from "./styled/SearchLambda"
import { useLambdaAddPropose } from "services/contracts/baseDAO/hooks/useLambdaAddPropose"
import { useLambdaRemovePropose } from "services/contracts/baseDAO/hooks/useLambdaRemovePropose"
import { LambdaDAO } from "services/contracts/baseDAO/lambdaDAO"
import { useDAOLambdas } from "services/contracts/baseDAO/hooks/useDAOLambdas"
import { Lambda } from "services/bakingBad/lambdas/types"
import { useLambdaExecutePropose } from "services/contracts/baseDAO/hooks/useLambdaExecutePropose"
import { parseLambdaCode } from "utils"
import { ArbitraryContractInteractionForm } from "./ArbitraryContractInteractionForm"
import AppConfig from "config"
import { StyledRow, LoadingContainer, LoadingStateLabel, CheckIcon } from "components/ui/ConfigProposalForm"
import { Link } from "react-router-dom"
import { ViewButton } from "./ViewButton"
import { Button } from "components/ui/Button"

const codeEditorcontainerstyles = {
  marginTop: "8px"
}

const codeEditorStyles = {
  minHeight: 500,
  fontFamily: "Roboto Flex",
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

type AciToken = {
  counter: number
  name?: string
  type: string
  children: AciToken[]
  placeholder?: string
  validate?: (value: string) => string | undefined
  initValue: tokenValueType
}
type tokenMap = Record<"key" | "value", AciToken>
type tokenValueType = string | boolean | number | AciToken | AciToken[] | tokenMap[]

export enum ProposalAction {
  new,
  remove,
  execute,
  aci,
  none
}

enum LambdaProposalState {
  write_action,
  wallet_action,
  action_finished
}

const codeEditorPlaceholder = {
  addLambda: `Write Michelson Code for Function's Implementation

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
  existingLambda: `Choose a Function from the Dropdown, the implementation will appear here
  `,
  lambdaExecuteArgumentsCode: `Write Michelson Code for the input Paramerers of your Function

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

const ARBITRARY_CONTRACT_INTERACTION = AppConfig.CONST.ARBITRARY_CONTRACT_INTERACTION

const ACI: Lambda = {
  key: ARBITRARY_CONTRACT_INTERACTION,
  id: 4998462,
  active: true,
  hash: "string",
  value: {
    code: "[]",
    handler_check: "[]",
    is_active: false
  },
  firstLevel: 4815399,
  lastLevel: 4815399,
  updates: 1
}

export const ProposalFormLambda: React.FC<{
  open: boolean
  action: ProposalAction
  handleClose: () => void
}> = ({ open, handleClose, action }) => {
  const grammar = Prism.languages.javascript

  const daoId = useDAOID()
  const { data: dao } = useDAO(daoId)
  const daoLambdas = useDAOLambdas(daoId)

  const { mutate: lambdaAdd } = useLambdaAddPropose()
  const { mutate: lambdaRemove } = useLambdaRemovePropose()
  const { mutate: lambdaExecute } = useLambdaExecutePropose()

  const [aciProposalOpen, setAciProposalOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(true)

  const lambdaForm = useForm<Values>()
  const proposalTypeQuery = new URLSearchParams(window.location.search).get("type")

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

  useEffect(() => {
    if (daoLambdas) {
      daoLambdas.push(ACI)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoLambdas])

  useEffect(() => {
    if (proposalTypeQuery === "add-function") {
      setCode(AppConfig.ACI.EXECUTOR_LAMBDA.code)
      setAciProposalOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalTypeQuery])

  useEffect(() => {
    if (action === ProposalAction.aci) {
      lambdaForm.setValue("lambda_name", ACI.key)
    }
  }, [action, lambdaForm])

  const onSubmit = useCallback(
    (_: Values) => {
      const agoraPostId = Number(0)
      // debugger
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

  const isDisabled = useMemo(() => {
    if (lambda?.key === ARBITRARY_CONTRACT_INTERACTION) return false
    if (!code) return true
    if (action === ProposalAction.execute && (!lambda || lambdaArguments === "" || lambdaParams === "")) return true
  }, [lambda, code, action, lambdaArguments, lambdaParams])

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
        <ProposalFormInput label="Function Name">
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
        {showHeader ? (
          <ProposalFormInput label="Function Name">
            <SearchLambda lambdas={daoLambdas} handleChange={handleSearchChange} />
          </ProposalFormInput>
        ) : null}

        {lambda?.key !== ARBITRARY_CONTRACT_INTERACTION ? (
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
              placeholder={codeEditorPlaceholder.existingLambda}
            />
            <ProposalCodeEditorInput
              label="Function Arguments Code"
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
        ) : (
          <ArbitraryContractInteractionForm showHeader={setShowHeader} daoLambdas={daoLambdas} />
        )}
      </>
    )
  }
  const renderAciProposal = () => {
    return (
      <>
        <ArbitraryContractInteractionForm showHeader={setShowHeader} daoLambdas={daoLambdas} />
      </>
    )
  }

  const closeModal = () => {
    setShowHeader(true)
    handleClose()
  }

  const getTitle = (action: ProposalAction) => {
    if (action === ProposalAction.aci) {
      return "Contract Call Proposal"
    }
    return ProposalAction[action] + " Function Proposal"
  }

  return (
    <FormProvider {...lambdaForm}>
      <ResponsiveDialog open={open} onClose={closeModal} title={getTitle(action)} template="md">
        {state === LambdaProposalState.write_action ? (
          <>
            <Grid container direction="row">
              {action === ProposalAction.new ? renderNewProposal() : null}
              {action === ProposalAction.remove ? renderRemoveProposal() : null}
              {action === ProposalAction.execute ? renderExecuteProposal() : null}
              {action === ProposalAction.aci ? renderAciProposal() : null}
            </Grid>

            {action !== ProposalAction.aci ? (
              <StyledRow container direction="row" justifyContent="flex-end">
                <StyledSendButton onClick={lambdaForm.handleSubmit(onSubmit)} disabled={isDisabled}>
                  Submit
                </StyledSendButton>
              </StyledRow>
            ) : null}
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
