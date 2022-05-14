import { Typography, useMediaQuery, useTheme } from "@material-ui/core"
import React from "react"
import { useDAO } from "services/indexer/dao/hooks/useDAO"

export const CycleDescription: React.FC<{ daoAddress: string }> = ({ daoAddress }) => {
  const { cycleInfo } = useDAO(daoAddress)
  const isVotingPeriod = cycleInfo && cycleInfo.type
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"))

  return (
    <Typography variant="h4" color="textPrimary" align={isExtraSmall ? "center" : "left"}>
      {isVotingPeriod === "voting" ? "VOTING ON PROPOSALS" : "CREATING PROPOSALS"}
    </Typography>
  )
}
