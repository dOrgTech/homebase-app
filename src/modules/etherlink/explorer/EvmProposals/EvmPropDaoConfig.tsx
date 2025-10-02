import React, { useContext, useEffect, useMemo, useState } from "react"
import { Grid, styled, Typography, Box } from "@material-ui/core"
import { StyledTextField } from "components/ui/StyledTextField"
import {
  Timeline as TimelineIcon,
  HowToVote as HowToVoteIcon,
  Schedule as ScheduleIcon,
  AccountBalance as AccountBalanceIcon
} from "@material-ui/icons"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { StyledSliderWithValue } from "components/ui/StyledSlider"
import { EtherlinkContext } from "services/wagmi/context"

const OptionContainer = styled(Grid)({
  "background": "#1c2024",
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

const TimeInput = ({
  label,
  defaultValue,
  onChange
}: {
  label: string
  defaultValue: { days: number; hours: number; minutes: number }
  onChange: (valueInMinutes: string) => void
}) => {
  const [days, setDays] = useState<number>(defaultValue.days)
  const [hours, setHours] = useState<number>(defaultValue.hours)
  const [minutes, setMinutes] = useState<number>(defaultValue.minutes)

  useEffect(() => {
    let totalMinutes = 0
    if (!isNaN(days)) totalMinutes += days * 1440
    if (!isNaN(hours)) totalMinutes += hours * 60
    if (!isNaN(minutes)) totalMinutes += minutes
    console.log("totalMinutes", totalMinutes)
    onChange((totalMinutes * 60).toString())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, hours, minutes])

  return (
    <Box display="flex" flexDirection="column">
      <Typography color="textSecondary">{label}</Typography>
      <Box display="flex" flexDirection="row">
        <StyledTextField
          label="Days"
          type="number"
          variant="standard"
          value={days}
          onChange={e => setDays(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)}
          style={{ marginRight: "16px" }}
        />
        <StyledTextField
          label="Hours"
          type="number"
          variant="standard"
          value={hours}
          onChange={e => setHours(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)}
          style={{ marginRight: "16px" }}
        />
        <StyledTextField
          label="Minutes"
          type="number"
          variant="standard"
          value={minutes}
          onChange={e => setMinutes(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)}
          style={{ marginRight: "16px" }}
        />
      </Box>
    </Box>
  )
}
export const EvmPropDaoConfig = () => {
  const { daoSelected } = useContext(EtherlinkContext)
  const { currentStep, daoConfig, setDaoConfig } = useEvmProposalOps()

  const defaultVotingDelay = useMemo(() => {
    return {
      days: Math.floor(Number(daoConfig.votingDelay) / 86400),
      hours: Math.floor((Number(daoConfig.votingDelay) % 86400) / 3600),
      minutes: Math.floor((Number(daoConfig.votingDelay) % 3600) / 60)
    }
  }, [daoConfig.votingDelay])

  const defaultVotingPeriod = useMemo(() => {
    return {
      days: Math.floor(Number(daoConfig.votingPeriod) / 86400),
      hours: Math.floor((Number(daoConfig.votingPeriod) % 86400) / 3600),
      minutes: Math.floor((Number(daoConfig.votingPeriod) % 3600) / 60)
    }
  }, [daoConfig.votingPeriod])

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
            <TimeInput
              label="Voting Delay Duration"
              defaultValue={defaultVotingDelay}
              onChange={value => setDaoConfig("votingDelay", value)}
            />
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
              defaultValue={defaultVotingPeriod}
              onChange={value => setDaoConfig("votingPeriod", value)}
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
        onClick={() => setDaoConfig("quorumNumerator", undefined, daoSelected?.address)}
      />
      <ConfigOption
        icon={<TimelineIcon fontSize="large" />}
        title="Voting Delay"
        description="Change the wait time between posting a proposal and the start of voting"
        onClick={() => setDaoConfig("votingDelay", undefined, daoSelected?.address)}
      />

      <ConfigOption
        icon={<ScheduleIcon fontSize="large" />}
        title="Voting Period"
        description="Change how long voting lasts"
        onClick={() => setDaoConfig("votingPeriod", undefined, daoSelected?.address)}
      />

      <ConfigOption
        icon={<AccountBalanceIcon fontSize="large" />}
        title="Proposal Threshold"
        description="Change the minimum amount of Token ownership required to submit a proposal"
        onClick={() => setDaoConfig("proposalThreshold", undefined, daoSelected?.address)}
      />
    </Grid>
  )
}
