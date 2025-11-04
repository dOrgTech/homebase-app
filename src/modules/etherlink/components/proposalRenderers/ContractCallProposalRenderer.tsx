import React from "react"
import { Grid } from "@material-ui/core"
import { ShortenedValueField } from "./ShortenedValueField"
import { ContainerVoteDetail, Header } from "components/ui/etherlink/styled"

interface ContractCallProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  targets?: string[]
  callDataPlain?: string[]
}

export const ContractCallProposalRenderer: React.FC<ContractCallProposalRendererProps> = ({
  proposalData: _proposalData,
  targets,
  callDataPlain
}) => {
  // For Contract Call, we need to show Target and CallData
  // Target comes from the targets array (first element typically)
  // CallData comes from the callDataPlain array (first element typically)

  const target = targets && targets.length > 0 ? targets[0] : ""
  const callData = callDataPlain && callDataPlain.length > 0 ? callDataPlain[0] : "0x"

  return (
    <ContainerVoteDetail
      container
      direction="column"
      style={{ border: "1px solid #575757", marginTop: 20, padding: 20 }}
    >
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Target:</Header>
        <ShortenedValueField value={target} label="Target" />
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>CallData:</Header>
        <ShortenedValueField value={callData} label="CallData" />
      </Grid>
    </ContainerVoteDetail>
  )
}
