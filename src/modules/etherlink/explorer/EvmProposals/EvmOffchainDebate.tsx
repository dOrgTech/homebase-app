import React, { useState } from "react"
import { Grid, styled, Typography, IconButton, FormControlLabel, Switch } from "@material-ui/core"
import { Add as AddIcon, RemoveCircleOutline } from "@material-ui/icons"
import { StyledTextField } from "components/ui/StyledTextField"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"

const InputContainer = styled(Grid)({
  background: "#1c2024",
  padding: "16px",
  borderRadius: "4px",
  marginBottom: "8px"
})

const AddButton = styled(Grid)({
  background: "#1c2024",
  padding: "12px",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "16px"
})

const RemoveButton = styled(IconButton)({
  color: "#FF4D4D",
  padding: "4px"
})

export const EvmOffchainDebate: React.FC = () => {
  const { offchainDebate, setOffchainDebate } = useEvmProposalOps()
  const choices = offchainDebate?.options
  const setChoices = (x: any) => setOffchainDebate("options", x)
  const isMultiChoice = offchainDebate?.is_multiple_choice
  const setIsMultiChoice = (x: any) => setOffchainDebate("is_multiple_choice", x)

  const handleDurationChange = (field: string, value: string) => {
    setOffchainDebate(field, value)
  }

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices]
    newChoices[index] = value
    setChoices(newChoices)
  }

  const addChoice = () => {
    setChoices([...choices, ""])
  }

  const removeChoice = (index: number) => {
    if (choices.length <= 2) return
    const newChoices = choices.filter((_, i) => i !== index)
    setChoices(newChoices)
  }

  return (
    <Grid container direction="column" spacing={2}>
      <InputContainer container spacing={2}>
        <Grid item xs={12}>
          <Typography color="textPrimary" gutterBottom>
            Poll Duration
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <StyledTextField
            fullWidth
            label="Days"
            type="number"
            value={offchainDebate.expiry_days}
            onChange={e => handleDurationChange("expiry_days", e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={4}>
          <StyledTextField
            fullWidth
            label="Hours"
            type="number"
            value={offchainDebate.expiry_hours}
            onChange={e => handleDurationChange("expiry_hours", e.target.value)}
            inputProps={{ min: 0, max: 23 }}
          />
        </Grid>
        <Grid item xs={4}>
          <StyledTextField
            fullWidth
            label="Minutes"
            type="number"
            value={offchainDebate.expiry_minutes}
            onChange={e => handleDurationChange("expiry_minutes", e.target.value)}
            inputProps={{ min: 0, max: 59 }}
          />
        </Grid>
      </InputContainer>

      <InputContainer container spacing={2}>
        <Grid item xs={12} container justifyContent="space-between" alignItems="center">
          <Typography color="textPrimary" gutterBottom>
            Poll Options
          </Typography>
          <FormControlLabel
            control={
              <Switch checked={isMultiChoice} onChange={e => setIsMultiChoice(e.target.checked)} color="primary" />
            }
            style={{ color: "#fff" }}
            label={isMultiChoice ? "Multi Choice" : "Single Choice"}
          />
        </Grid>
        {choices.map((choice, index) => (
          <Grid item xs={12} key={index} container alignItems="center" spacing={1}>
            <Grid item xs>
              <StyledTextField
                fullWidth
                label={`Option ${index + 1}`}
                value={choice}
                onChange={e => handleChoiceChange(index, e.target.value)}
              />
            </Grid>
            <Grid item>
              {choices.length > 2 && (
                <RemoveButton onClick={() => removeChoice(index)}>
                  <RemoveCircleOutline />
                </RemoveButton>
              )}
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <AddButton onClick={addChoice}>
            <AddIcon />
            <Typography color="textPrimary" style={{ marginLeft: 8 }}>
              Add Option
            </Typography>
          </AddButton>
        </Grid>
      </InputContainer>
    </Grid>
  )
}
