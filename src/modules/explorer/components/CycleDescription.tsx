import { Typography, useMediaQuery, useTheme, Theme, styled } from "@material-ui/core"
import React from "react"
import { useDAO } from "services/services/dao/hooks/useDAO"

const ProposalsStatus = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontSize: "20px",
  color: theme.palette.text.primary,

  ["@media (max-width:1030px)"]: {
    fontSize: "18px"
  }
}))

export const CycleDescription: React.FC<{ daoAddress: string }> = ({ daoAddress }) => {
  const { cycleInfo } = useDAO(daoAddress)
  const isVotingPeriod = cycleInfo && cycleInfo.type
  const theme = useTheme()

  return <ProposalsStatus>{isVotingPeriod === "voting" ? "Voting on Proposals" : "Creating Proposals"}</ProposalsStatus>
}
