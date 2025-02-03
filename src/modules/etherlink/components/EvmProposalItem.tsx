import { Grid, Theme, Typography, styled } from "@material-ui/core"
import dayjs from "dayjs"
import React from "react"
import { toShortAddress } from "services/contracts/utils"
import { Proposal } from "services/services/dao/mappers/proposal/types"
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

export const EvmProposalItem: React.FC<{
  proposal: Proposal | any
}> = ({ proposal, children }) => {
  const formattedDate = proposal?.createdAt?.format("LLL") ?? "N/A"

  return (
    <ContentBlockItem container justifyContent="space-between" alignItems="center">
      <Grid item sm={8} role="article" aria-label={"Proposal Details"}>
        <Grid container direction="column" style={{ gap: 20 }}>
          <Grid item>
            <ProposalTitle color="textPrimary" variant="body1">
              {proposal.title}
            </ProposalTitle>
          </Grid>
          <Grid item>
            <Grid container style={{ gap: 16 }} alignItems="center">
              <Grid item>
                <StatusBadge status={proposal.status} />
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
