import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { ShortenedValueField } from "./ShortenedValueField"
import { ContainerVoteDetail, Header } from "components/ui/etherlink/styled"

interface ConfigChangeProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  proposalType: string
}

export const ConfigChangeProposalRenderer: React.FC<ConfigChangeProposalRendererProps> = ({
  proposalData,
  proposalType
}) => {
  // Extract the new value from the proposal data
  const newValueParam = proposalData.find(
    item =>
      item.parameter.toLowerCase().includes("new") ||
      item.parameter.toLowerCase().includes("value") ||
      item.parameter === "0" ||
      item.parameter.match(/^(new|value)\s*\(/)
  )

  // Determine the header text based on proposal type
  const getHeaderText = () => {
    const type = proposalType.toLowerCase()
    if (type === "quorum") return "Change Quorum"
    if (type === "voting delay") return "Change Voting Delay"
    if (type === "voting period") return "Change Voting Period"
    if (type === "proposal threshold") return "Change Proposal Threshold"
    return "Change Configuration"
  }

  return (
    <ContainerVoteDetail
      container
      direction="column"
      style={{ border: "1px solid #575757", marginTop: 20, padding: 20 }}
    >
      <Grid item style={{ marginBottom: 20 }}>
        <Typography variant="h3" color="textPrimary">
          {getHeaderText()}
        </Typography>
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>New Value:</Header>
        <ShortenedValueField value={newValueParam?.value || ""} label="New Value" />
      </Grid>
    </ContainerVoteDetail>
  )
}
