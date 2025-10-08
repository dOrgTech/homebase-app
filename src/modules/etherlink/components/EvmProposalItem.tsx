import { Grid, Typography, styled } from "components/ui"
import React, { useContext } from "react"
import { toShortAddress } from "services/contracts/utils"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { StatusBadge } from "modules/explorer/components/StatusBadge"
import { ContentContainer } from "components/ui/ContentContainer"
import { useProposalTimeline } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { EtherlinkContext } from "services/wagmi/context"

const ContentBlockItem = styled(ContentContainer)({
  padding: "37px 42px"
})

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
  const { daoSelected } = useContext(EtherlinkContext)
  const { effectiveDisplayStatus } = useProposalTimeline(proposal, daoSelected)

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
                <StatusBadge status={effectiveDisplayStatus || proposal.displayStatus || proposal.status} />
              </Grid>
              <Grid item>
                <CreatedText variant="body1" color="textPrimary">
                  Created {formattedDate}
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
