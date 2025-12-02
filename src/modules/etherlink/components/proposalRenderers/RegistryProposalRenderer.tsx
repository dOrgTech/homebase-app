import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { ShortenedValueField } from "./ShortenedValueField"
import { FullValueFieldWithCopy } from "./FullValueFieldWithCopy"
import { ContainerVoteDetail, Header } from "components/ui/etherlink/styled"

interface RegistryProposalRendererProps {
  proposalData: { parameter: string; value: string }[]
  compact?: boolean
}

export const RegistryProposalRenderer: React.FC<RegistryProposalRendererProps> = ({
  proposalData,
  compact = false
}) => {
  const keyParam = proposalData.find(
    item => item.parameter.toLowerCase().includes("key") || item.parameter === "0" || item.parameter.match(/^key\s*\(/)
  )
  const valueParam = proposalData.find(
    item =>
      (item.parameter.toLowerCase().includes("value") ||
        item.parameter === "1" ||
        item.parameter.match(/^value\s*\(/)) &&
      !item.parameter.toLowerCase().includes("key")
  )

  const content = (
    <>
      <Grid item style={{ marginBottom: 16 }}>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Key:</Header>
        <ShortenedValueField value={keyParam?.value || ""} label="Key" />
      </Grid>
      <Grid item>
        <Header style={{ fontSize: 14, marginBottom: 8 }}>Value:</Header>
        <FullValueFieldWithCopy value={valueParam?.value || ""} label="Value" />
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
      <Grid item style={{ marginBottom: 20 }}>
        <Typography variant="h3" color="textPrimary">
          Update Registry
        </Typography>
      </Grid>
      {content}
    </ContainerVoteDetail>
  )
}
