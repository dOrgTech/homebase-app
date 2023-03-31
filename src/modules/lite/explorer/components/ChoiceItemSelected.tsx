import React, { useEffect } from "react"
import { Divider, Grid, styled, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { Choice } from "models/Choice"

const StyledContainer = styled(Grid)(({ theme }: { theme: Theme }) => ({
  "borderRadius": 4,
  "minHeight": 75,
  "border": "1px solid",
  "borderColor": theme.palette.primary.light,
  "cursor": "pointer",
  "&:hover": {
    border: "1px solid",
    borderColor: theme.palette.secondary.main
  }
}))

export const ChoiceItemSelected: React.FC<{ choice: Choice; setSelectedVote: any }> = ({ choice, setSelectedVote }) => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <StyledContainer
      spacing={isMobileSmall ? 1 : 2}
      container
      item
      style={choice.selected ? { border: "1px solid", borderColor: theme.palette.secondary.main } : {}}
      xs={isMobileSmall ? 12 : 6}
      justifyContent={"center"}
      alignItems="center"
      onClick={() => {
        setSelectedVote(choice)
        choice.selected = true
        return
      }}
    >
      <Typography variant="body1" color="textPrimary">
        {choice.name}
      </Typography>
    </StyledContainer>
  )
}
