import { Grid } from "components/ui"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { EvmProposalCountdown } from "modules/etherlink/components/EvmProposalCountdown"
import { ProposalActionButtons } from "./ProposalActionButtons"
import { useProposalTimeline } from "services/wagmi/etherlink/hooks/useProposalTimeline"
import { useProposalUiOverride } from "services/wagmi/etherlink/hooks/useProposalUiOverride"
import dayjs from "dayjs"

interface ProposalActionSectionProps {
  daoProposalSelected: any
  daoSelected: any
}

export const ProposalActionSection = ({ daoProposalSelected, daoSelected }: ProposalActionSectionProps) => {
  const { isTimerActive, timerLabel, timerTargetDate } = useProposalTimeline(daoProposalSelected, daoSelected)
  const override = useProposalUiOverride(s => s.overrides[daoProposalSelected?.id || ""]) as any

  const hasOverrideQueued = override?.status === "queued" && typeof override?.eta === "number"
  const countdownLabel = hasOverrideQueued ? "Execution available in" : timerLabel
  const countdownTarget = hasOverrideQueued ? dayjs.unix(override.eta) : timerTargetDate
  const shouldShowCountdown = isTimerActive || hasOverrideQueued

  return (
    <ContentContainer style={{ gap: 10, color: "white", marginTop: 32 }}>
      <Grid item xs={12} md={12} style={{ padding: "40px" }}>
        {shouldShowCountdown ? (
          <EvmProposalCountdown overrideLabel={countdownLabel} overrideTarget={countdownTarget} />
        ) : null}
        <ProposalActionButtons />
      </Grid>
    </ContentContainer>
  )
}
