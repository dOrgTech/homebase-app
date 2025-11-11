import React from "react"
import { Grid, Typography, Box, styled } from "@material-ui/core"
import { ethers } from "ethers"
import { ContainerVoteDetail } from "components/ui/etherlink/styled"
import { TransferETHProposalRenderer } from "./TransferETHProposalRenderer"
import { TransferERC20ProposalRenderer } from "./TransferERC20ProposalRenderer"
import { MintBurnProposalRenderer } from "./MintBurnProposalRenderer"
import { proposalInterfaces } from "modules/etherlink/config"

const ActionContainer = styled(Box)({
  border: "1px solid #575757",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  backgroundColor: "rgba(0, 0, 0, 0.2)"
})

const ActionHeader = styled(Typography)({
  marginBottom: 12,
  fontWeight: 600
})

interface ProposalDataItem {
  parameter: string
  value: string
}

interface BatchProposalRendererProps {
  proposalData: ProposalDataItem[]
  targets?: string[]
  callDataPlain?: string[]
  values?: any[]
  tokenSymbol?: string
  decimals?: number
  nativeDecimals?: number
}

export const BatchProposalRenderer: React.FC<BatchProposalRendererProps> = ({
  proposalData,
  targets,
  callDataPlain,
  values,
  tokenSymbol,
  decimals,
  nativeDecimals
}) => {
  const decodeCallDataForBatch = (callData: string): ProposalDataItem[] => {
    const formattedCallData = callData.startsWith("0x") ? callData : `0x${callData}`

    for (const iface of proposalInterfaces) {
      try {
        const ethersInterface = new ethers.Interface(iface.interface)
        const decoded = ethersInterface.decodeFunctionData(iface.interface[0], formattedCallData)
        const functionFragment = ethersInterface.getFunction(iface.interface[0])

        if (decoded && functionFragment) {
          const result: ProposalDataItem[] = [
            { parameter: "Function", value: functionFragment.name },
            { parameter: "Signature", value: iface.interface[0] }
          ]

          functionFragment.inputs.forEach((input, index) => {
            const value = decoded[index]
            result.push({
              parameter: `${input.name} (${input.type})`,
              value: value?.toString() || ""
            })
          })

          return result
        }
      } catch (error) {
        continue
      }
    }

    return []
  }

  const decodedActions = React.useMemo(() => {
    if (callDataPlain && callDataPlain.length > 0) {
      return callDataPlain.map(callData => decodeCallDataForBatch(callData))
    }
    return []
  }, [callDataPlain])

  const actions = decodedActions.length > 0 ? decodedActions : proposalData ? groupActionsByFunction(proposalData) : []

  function groupActionsByFunction(data: ProposalDataItem[]) {
    const result: ProposalDataItem[][] = []
    let currentAction: ProposalDataItem[] = []

    data.forEach((item, index) => {
      if (item.parameter === "Function" && currentAction.length > 0) {
        result.push(currentAction)
        currentAction = [item]
      } else {
        currentAction.push(item)
      }
    })

    if (currentAction.length > 0) {
      result.push(currentAction)
    }

    return result
  }

  const getActionTitle = (action: ProposalDataItem[], actionIndex: number) => {
    const functionItem = action.find(item => item.parameter === "Function")
    const functionName = functionItem?.value?.toLowerCase() || ""
    const targetAddress = targets && targets[actionIndex] ? targets[actionIndex] : null

    let displayName = functionItem?.value || "Action"

    if (functionName.includes("transfereth")) {
      displayName = "Transfer XTZ"
    } else if (functionName.includes("transfererc20")) {
      displayName = "Transfer ERC20 Token"
    } else if (functionName.includes("mint")) {
      displayName = tokenSymbol ? `Mint ${tokenSymbol} Tokens` : "Mint Tokens"
    } else if (functionName.includes("burn")) {
      displayName = tokenSymbol ? `Burn ${tokenSymbol} Tokens` : "Burn Tokens"
    } else {
      displayName = "Unknown Action"
    }

    if (targetAddress) {
      return `Action ${actionIndex + 1}: ${displayName} (${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)})`
    }

    return `Action ${actionIndex + 1}: ${displayName}`
  }

  const renderAction = (action: ProposalDataItem[], actionIndex: number) => {
    const functionItem = action.find(item => item.parameter === "Function")
    const functionName = functionItem?.value?.toLowerCase() || ""

    const actionTargets = targets && targets[actionIndex] ? [targets[actionIndex]] : undefined
    const actionCallDataPlain = callDataPlain && callDataPlain[actionIndex] ? [callDataPlain[actionIndex]] : undefined
    const actionValues = values && values[actionIndex] ? [values[actionIndex]] : undefined

    if (functionName.includes("transfereth")) {
      return (
        <TransferETHProposalRenderer
          proposalData={action}
          targets={actionTargets}
          callDataPlain={actionCallDataPlain}
          values={actionValues}
          tokenSymbol={tokenSymbol}
          decimals={nativeDecimals || 18}
          compact={true}
        />
      )
    }

    if (functionName.includes("transfererc20")) {
      return <TransferERC20ProposalRenderer proposalData={action} decimals={decimals} compact={true} />
    }

    if (functionName.includes("mint") || functionName.includes("burn")) {
      const proposalType = functionName.includes("mint") ? "mint" : "burn"
      return (
        <MintBurnProposalRenderer
          proposalData={action}
          proposalType={proposalType}
          tokenSymbol={tokenSymbol}
          decimals={decimals}
          compact={true}
        />
      )
    }

    return (
      <Grid container direction="column">
        <Typography color="textSecondary">Unknown action type</Typography>
      </Grid>
    )
  }

  return (
    <ContainerVoteDetail
      container
      direction="column"
      style={{ border: "1px solid #575757", marginTop: 20, padding: 20 }}
    >
      <Grid item style={{ marginBottom: 20 }}>
        <Typography variant="h3" color="textPrimary">
          Batch Proposal ({actions.length} {actions.length === 1 ? "Action" : "Actions"})
        </Typography>
      </Grid>

      {actions.map((action, actionIndex) => (
        <ActionContainer key={actionIndex}>
          <ActionHeader variant="h4" color="textPrimary">
            {getActionTitle(action, actionIndex)}
          </ActionHeader>
          <Grid container direction="column">
            {renderAction(action, actionIndex)}
          </Grid>
        </ActionContainer>
      ))}
    </ContainerVoteDetail>
  )
}
