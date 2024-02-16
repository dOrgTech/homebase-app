import React, { useEffect } from "react"
import { Button, Divider, Grid, styled, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Choice } from "models/Choice"

const StyledContainer = styled(Grid)(({ theme }: { theme: Theme }) => ({
  borderRadius: 4,
  minHeight: 75,
  border: "1px solid",
  borderColor: theme.palette.primary.light,
  cursor: "pointer"
}))

const StyledButton = styled(Button)({
  "width": "100%",
  "minHeight": "inherit",
  "&:hover": {
    background: "rgba(129, 254, 183, 0.62)"
  }
})

export const ChoiceItemSelected: React.FC<{
  choice: Choice
  setSelectedVotes: any
  votes: Choice[]
  multiple: boolean
}> = ({ choice, setSelectedVotes, votes, multiple }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const handleVotes = (choice: Choice) => {
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
              borderColor: theme.palette.secondary.main,
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
        <Typography variant="body1" color="textPrimary">
          {choice.name}
        </Typography>
      </StyledButton>
    </StyledContainer>
  )
}
