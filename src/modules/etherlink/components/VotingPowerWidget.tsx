import React, { useState, useEffect } from "react"
import { Box, MenuItem, Typography, Slider, Paper, Grid, KeyboardArrowDownIcon } from "components/ui"
import { StyledPaper, StyledSelect } from "components/ui"

export interface Org {
  symbol: string
}

export interface Member {
  name: string
  votingWeight: number
}

// TODO:  Replace with actual data if this widget is in use
export const generateMembers = (): Member[] => {
  return Array.from({ length: 100 }, (_, index) => ({
    name: `Member ${index + 1}`,
    votingWeight: Math.random() * 100 + 1
  }))
}

// StyledPaper and StyledSelect come from components/ui/etherlink

export const VotingPowerStats: React.FC<{
  membersCount: number
  membersPercentage: number
  votingPower: number
  votingPowerPercentage: number
}> = ({ membersCount, membersPercentage, votingPower, votingPowerPercentage }) => {
  return (
    <Grid container justifyContent="space-between" style={{ paddingLeft: 32, paddingRight: 32 }}>
      <Grid item>
        <Typography variant="body1" style={{ color: "white" }}>
          Number of Members
        </Typography>
        <Typography variant="h5" style={{ color: "white", marginTop: 8 }}>
          {membersCount}
        </Typography>
        <Typography variant="body1" style={{ color: "white" }}>
          {membersPercentage.toFixed(2)}%
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" style={{ color: "white" }}>
          Voting Power
        </Typography>
        <Typography variant="h5" style={{ color: "white", marginTop: 8 }}>
          {votingPower.toFixed(2)}
        </Typography>
        <Typography variant="body1" style={{ color: "white" }}>
          {votingPowerPercentage.toFixed(2)}%
        </Typography>
      </Grid>
    </Grid>
  )
}

export const VotingPowerWidget: React.FC<{ tokenSymbol: string }> = ({ tokenSymbol }) => {
  const [sliderValue, setSliderValue] = useState(1)
  const [members, setMembers] = useState<Member[]>([])
  const [selectedFeature, setSelectedFeature] = useState("vote concentration")
  const concentrationOptions = ["vote concentration", `${tokenSymbol} ownership`]

  useEffect(() => {
    let isSubscribed = true
    const initialMembers = generateMembers()
    initialMembers.sort((a, b) => b.votingWeight - a.votingWeight)
    if (isSubscribed) {
      setMembers(initialMembers)
    }
    return () => {
      isSubscribed = false
    }
  }, [])

  const totalMembers = members.length
  const totalVotingPower = members.reduce((sum, member) => sum + member.votingWeight, 0)
  const percentageOfMembers = 101 - sliderValue
  const membersToInclude = Math.max(1, Math.round((percentageOfMembers / 100) * totalMembers))
  const selectedMembers = members.slice(0, membersToInclude)
  const cumulativeVotingPower = selectedMembers.reduce((sum, member) => sum + member.votingWeight, 0)

  const membersPercentage = (membersToInclude / totalMembers) * 100
  const votingPowerPercentage = (cumulativeVotingPower / totalVotingPower) * 100

  return (
    <Box pr={1.5}>
      <StyledPaper elevation={0}>
        <Typography variant="body2" style={{ fontWeight: 600, marginRight: 8 }}>
          Drag slider to check
        </Typography>
        <Box position="relative">
          <StyledSelect
            value={selectedFeature}
            onChange={(event: any) => {
              setSelectedFeature(event.target.value)
            }}
            IconComponent={KeyboardArrowDownIcon}
            variant="standard"
          >
            {concentrationOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledSelect>
        </Box>
      </StyledPaper>

      <Paper
        style={{
          minWidth: 520,
          height: 180,
          backgroundColor: "#111",
          border: "1px solid #eee",
          paddingLeft: 16,
          paddingRight: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <VotingPowerStats
          membersCount={membersToInclude}
          membersPercentage={membersPercentage}
          votingPower={cumulativeVotingPower}
          votingPowerPercentage={votingPowerPercentage}
        />

        <Box style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Slider
            value={sliderValue}
            onChange={(_, value) => setSliderValue(value as number)}
            min={1}
            max={100}
            style={{ width: 430 }}
          />
        </Box>
      </Paper>
    </Box>
  )
}
