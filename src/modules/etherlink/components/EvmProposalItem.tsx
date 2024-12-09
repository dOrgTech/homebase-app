import { Box, Grid, Theme, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
import dayjs from "dayjs"
import React from "react"
import { toShortAddress } from "services/contracts/utils"
import { Proposal, ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { StatusBadge } from "modules/explorer/components/StatusBadge"

const ContentBlockItem = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: "37px 42px",
  background: theme.palette.primary.main,
  borderRadius: 8
}))

const ProposalTitle = styled(Typography)({
  fontWeight: "bold"
})

const CreatedText = styled(Typography)({
  fontWeight: 300,
  color: "#bfc5ca"
})

const getStatusByHistory = (history: { active: number; executable: number; passed: number; pending: number }) => {
  const statuses = Object.keys(history)
  const status = statuses.reduce((maxStatus, currentStatus) => {
    return history[currentStatus as keyof typeof history] > history[maxStatus as keyof typeof history]
      ? currentStatus
      : maxStatus
  })
  // TODO: @ashutoshpw, handle more statuses
  switch (status) {
    case "active":
      return ProposalStatus.ACTIVE
    case "pending":
      return ProposalStatus.PENDING
    case "rejected":
      return ProposalStatus.REJECTED
    case "accepted":
      return ProposalStatus.ACTIVE
    case "executed":
      return ProposalStatus.EXECUTED
    default:
      return ProposalStatus.NO_QUORUM
  }
}

export const EvmProposalItem: React.FC<{
  proposal: Proposal | any
}> = ({ proposal, children }) => {
  const formattedDate = dayjs(proposal.startDate).format("LLL")

  return (
    <ContentBlockItem container justifyContent="space-between" alignItems="center">
      <Grid item sm={8}>
        <Grid container direction="column" style={{ gap: 20 }}>
          <Grid item>
            <ProposalTitle color="textPrimary" variant="body1">
              {proposal.title}
            </ProposalTitle>
          </Grid>
          <Grid item>
            <Grid container style={{ gap: 16 }} alignItems="center">
              <Grid item>
                <StatusBadge status={getStatusByHistory(proposal.statusHistory)} />
              </Grid>
              <Grid item>
                <CreatedText variant="body1" color="textPrimary">
                  Created at {formattedDate} by{" "}
                  <span style={{ fontWeight: 600 }}>
                    {proposal.author ? toShortAddress(proposal.author) : "unknown"}
                  </span>
                </CreatedText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>{children}</Grid>
    </ContentBlockItem>
  )
}
