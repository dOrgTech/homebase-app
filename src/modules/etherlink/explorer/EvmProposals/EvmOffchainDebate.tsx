import React from "react"
import { Grid, Typography, IconButton, FormControlLabel } from "components/ui"
import { Add as AddIcon, RemoveCircleOutline } from "components/ui"
import { StyledTextField } from "components/ui/StyledTextField"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { Switch, InputContainer } from "components/ui"

// Styled components replaced by shared InputContainer and inline styles

export const EvmOffchainDebate: React.FC = () => {
  const { offchainDebate, setOffchainDebate } = useEvmProposalOps()
  const choices = offchainDebate?.options
  const setChoices = (x: string[]) => setOffchainDebate("options", x)
  const isMultiChoice = offchainDebate?.is_multiple_choice
  const setIsMultiChoice = (x: boolean) => setOffchainDebate("is_multiple_choice", x)

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
            onChange={e => setOffchainDebate("expiry_days", e.target.value)}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={4}>
          <StyledTextField
            fullWidth
            label="Hours"
            type="number"
            value={offchainDebate.expiry_hours}
            onChange={e => setOffchainDebate("expiry_hours", e.target.value)}
            inputProps={{ min: 0, max: 23 }}
          />
        </Grid>
        <Grid item xs={4}>
          <StyledTextField
            fullWidth
            label="Minutes"
            type="number"
            value={offchainDebate.expiry_minutes}
            onChange={e => setOffchainDebate("expiry_minutes", e.target.value)}
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
                <IconButton onClick={() => removeChoice(index)} style={{ color: "#FF4D4D", padding: 4 }}>
                  <RemoveCircleOutline />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Grid
            onClick={addChoice}
            style={{
              background: "#1c2024",
              padding: 12,
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16
            }}
          >
            <AddIcon />
            <Typography color="textPrimary" style={{ marginLeft: 8 }}>
              Add Option
            </Typography>
          </Grid>
        </Grid>
      </InputContainer>
    </Grid>
  )
}
