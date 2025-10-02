import React from "react"
import { Button, Grid, styled, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { IEvmOffchainChoice } from "modules/etherlink/types"

const StyledContainer = styled(Grid)(({ theme }: { theme: Theme }) => ({
  borderRadius: 8,
  minHeight: 75,
  border: "none",
  cursor: "pointer",
  backgroundColor: theme.palette.primary.main
}))

const Text = styled(Typography)({
  fontWeight: 300
})

const StyledButton = styled(Button)({
  "width": "100%",
  "minHeight": "inherit",
  "&:hover": {
    background: "#2d433c"
  }
})

export const EvmChoiceItemSelected: React.FC<{
  choice: IEvmOffchainChoice
  setSelectedVotes: (votes: IEvmOffchainChoice[]) => void
  votes: IEvmOffchainChoice[]
  multiple: boolean
}> = ({ choice, setSelectedVotes, votes, multiple }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const handleVotes = (choice: IEvmOffchainChoice) => {
    if (multiple) {
      let votesArray = [...votes]
      if (!votesArray.includes(choice)) {
        votesArray?.push(choice)
      } else {
        votesArray = votesArray.filter(vote => vote._id !== choice._id)
      }
      const result = votesArray.map(vote => {
        vote.selected = true
        return vote
      })
      setSelectedVotes(result)
    } else {
      choice.selected = true
      setSelectedVotes([choice])
    }
  }

  const isPartOfVotes = () => {
    const found = votes.filter(vote => vote._id === choice._id)
    return found.length > 0
  }

  return (
    <StyledContainer
      spacing={isMobileSmall ? 1 : 2}
      container
      item
      style={
        isPartOfVotes()
          ? {
              border: "1px solid",
              borderColor: "#2D433C",
              backgroundColor: "#334d43"
            }
          : {}
      }
      xs={isMobileSmall ? 12 : 6}
      justifyContent={"center"}
      alignItems="center"
    >
      <StyledButton
        onClick={() => {
          handleVotes(choice)
          return
        }}
      >
        <Text color="textPrimary">{choice.name}</Text>
      </StyledButton>
    </StyledContainer>
  )
}
