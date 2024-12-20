import React, { useState } from "react"
import { Grid, styled, Typography, Slider, Box } from "@material-ui/core"
import { StyledTextField } from "components/ui/StyledTextField"
import {
  Timeline as TimelineIcon,
  HowToVote as HowToVoteIcon,
  Schedule as ScheduleIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowBack as ArrowBackIcon
} from "@material-ui/icons"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { StyledSliderWithValue } from "components/ui/StyledSlider"

const OptionContainer = styled(Grid)({
  "background": "#2F3438",
  "padding": "20px",
  "borderRadius": "8px",
  "cursor": "pointer",
  "height": "100%",
  "&:hover": {
    background: "#3F444A"
  }
})

const IconContainer = styled(Box)({
  marginBottom: "16px"
})

const BackButton = styled(Grid)({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  marginBottom: "24px"
})

const TimeInputContainer = styled(Grid)({
  "& > div": {
    marginRight: "16px"
  }
})

const ConfigOption = ({
  icon,
  title,
  description,
  onClick
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) => (
  <Grid item xs={12} sm={6} style={{ gap: 4, padding: "10px", marginTop: "40px" }}>
    <OptionContainer onClick={onClick}>
      <IconContainer>{icon}</IconContainer>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        {title}
      </Typography>
      <Typography color="textSecondary">{description}</Typography>
    </OptionContainer>
  </Grid>
)

const TimeInput = ({ label, onChange }: { label: string; onChange: (field: string, value: string) => void }) => (
  <Box display="flex" flexDirection="column">
    <Typography color="textSecondary">{label}</Typography>
    <Box display="flex" flexDirection="row">
      <StyledTextField
        label="Days"
        type="number"
        variant="standard"
        onChange={e => onChange("days", e.target.value)}
        style={{ marginRight: "16px" }}
      />
      <StyledTextField
        label="Hours"
        type="number"
        variant="standard"
        onChange={e => onChange("hours", e.target.value)}
        style={{ marginRight: "16px" }}
      />
      <StyledTextField
        label="Minutes"
        type="number"
        variant="standard"
        onChange={e => onChange("minutes", e.target.value)}
        style={{ marginRight: "16px" }}
      />
    </Box>
  </Box>
)

export const EvmPropDaoConfig = () => {
  const { currentStep, daoConfig, setDaoConfig } = useEvmProposalOps()

  const renderSelectedOption = () => {
    switch (daoConfig.type) {
      case "quorumNumerator":
        return (
          <>
            <Typography color="textPrimary" gutterBottom>
              Change the minimum required participation for a proposal to pass
            </Typography>
            <StyledSliderWithValue
              defaultValue={Number(daoConfig.quorumNumerator) || 0}
              onChange={(newValue: any) => {
                setDaoConfig("quorumNumerator", newValue || 0)
              }}
            />
          </>
        )
      case "votingDelay":
        return (
          <>
            <Typography color="textPrimary" gutterBottom>
              Change the wait time between posting a proposal and the start of voting
            </Typography>
            <TimeInput label="Voting Delay Duration" onChange={(field, value) => setDaoConfig("votingDelay", value)} />
          </>
        )
      case "votingPeriod":
        return (
          <>
            <Typography color="textPrimary" gutterBottom>
              Change how long voting lasts
            </Typography>
            <TimeInput
              label="Voting Period Duration"
              onChange={(field, value) => setDaoConfig("votingPeriod", value)}
            />
          </>
        )
      case "proposalThreshold":
        return (
          <>
            <Typography color="textPrimary" gutterBottom>
              Change the minimum amount of Token ownership required to submit a proposal
            </Typography>
            <StyledTextField
              fullWidth
              label="Threshold Amount"
              type="number"
              variant="standard"
              value={daoConfig.proposalThreshold}
              onChange={e => setDaoConfig("proposalThreshold", e.target.value)}
            />
          </>
        )
      default:
        return null
    }
  }

  if (currentStep == 3) return <Box style={{ marginBottom: "20px" }}>{renderSelectedOption()}</Box>

  return (
    <Grid container spacing={0} style={{ gap: 0, marginBottom: "30px" }}>
      <ConfigOption
        icon={<HowToVoteIcon fontSize="large" />}
        title="Quorum"
        description="Change the minimum required participation for a proposal to pass"
        onClick={() => setDaoConfig("quorumNumerator")}
      />
      <ConfigOption
        icon={<TimelineIcon fontSize="large" />}
        title="Voting Delay"
        description="Change the wait time between posting a proposal and the start of voting"
        onClick={() => setDaoConfig("votingDelay")}
      />

      <ConfigOption
        icon={<ScheduleIcon fontSize="large" />}
        title="Voting Period"
        description="Change how long voting lasts"
        onClick={() => setDaoConfig("votingPeriod")}
      />

      <ConfigOption
        icon={<AccountBalanceIcon fontSize="large" />}
        title="Proposal Threshold"
        description="Change the minimum amount of Token ownership required to submit a proposal"
        onClick={() => setDaoConfig("proposalThreshold")}
      />
    </Grid>
  )
}
