import React, { useState, useEffect } from "react"
import { Box, Select, MenuItem, Typography, Slider, Paper, styled, SelectChangeEvent, Grid } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

export interface Org {
  symbol: string
}

export interface Member {
  name: string
  votingWeight: number
}

// TODO: @ashutoshpw Replace with actual data
export const generateMembers = (): Member[] => {
  return Array.from({ length: 100 }, (_, index) => ({
    name: `Member ${index + 1}`,
    votingWeight: Math.random() * 100 + 1
  }))
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  minWidth: 520,
  height: 30,
  backgroundColor: theme.palette.grey[200],
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    paddingRight: theme.spacing(4),
    fontWeight: 600,
    backgroundColor: "transparent"
  },
  "&:before, &:after": {
    display: "none"
  }
}))

export const VotingPowerStats: React.FC<{
  membersCount: number
  membersPercentage: number
  votingPower: number
  votingPowerPercentage: number
}> = ({ membersCount, membersPercentage, votingPower, votingPowerPercentage }) => {
  return (
    <Grid container justifyContent="space-between" px={4}>
      <Grid item>
        <Typography variant="body1" style={{ color: "white" }}>
          Number of Members
        </Typography>
        <Typography variant="h5" sx={{ mt: 1 }} style={{ color: "white" }}>
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
        <Typography variant="h5" sx={{ mt: 1 }} style={{ color: "white" }}>
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
    const initialMembers = generateMembers()
    initialMembers.sort((a, b) => b.votingWeight - a.votingWeight)
    setMembers(initialMembers)
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
        <Typography variant="body2" fontWeight={600} sx={{ mr: 1 }}>
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
        sx={{
          minWidth: 520,
          height: 180,
          bgcolor: "grey.900",
          border: 1,
          borderColor: "grey.200",
          px: 2,
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

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Slider
            value={sliderValue}
            onChange={(_, value) => setSliderValue(value as number)}
            min={1}
            max={100}
            sx={{ width: 430 }}
          />
        </Box>
      </Paper>
    </Box>
  )
}
