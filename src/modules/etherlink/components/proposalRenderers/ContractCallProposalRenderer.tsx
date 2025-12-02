import React from "react"
import { Grid } from "@material-ui/core"
import { ShortenedValueField } from "./ShortenedValueField"
import { ContainerVoteDetail, Header } from "components/ui/etherlink/styled"

interface ContractCallProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  targets?: string[]
  callDataPlain?: string[]
  compact?: boolean
}

export const ContractCallProposalRenderer: React.FC<ContractCallProposalRendererProps> = ({
  proposalData: _proposalData,
  targets,
  callDataPlain,
  compact = false
}) => {
  const target = targets && targets.length > 0 ? targets[0] : ""
  const callData = callDataPlain && callDataPlain.length > 0 ? callDataPlain[0] : "0x"

  const content = (
    <>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Target:</Header>
        <ShortenedValueField value={target} label="Target" />
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>CallData:</Header>
        <ShortenedValueField value={callData} label="CallData" />
      </Grid>
    </>
  )

  if (compact) {
    return <>{content}</>
  }

  return (
    <ContainerVoteDetail
      container
      direction="column"
      style={{ border: "1px solid #575757", marginTop: 20, padding: 20 }}
    >
      {content}
    </ContainerVoteDetail>
  )
}
