import React from "react"
import { Grid, Typography, IconButton, FormControlLabel, FormField, FormTextField, InputAdornment } from "components/ui"
import { Add as AddIcon, RemoveCircleOutline } from "components/ui"
import { useEvmProposalOps } from "services/contracts/etherlinkDAO/hooks/useEvmProposalOps"
import { Switch } from "components/ui"

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
    <Grid container direction="column" style={{ gap: 24 }}>
      <Grid item xs={12}>
        <Typography color="textPrimary" gutterBottom>
          Poll Duration
        </Typography>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <FormField label="Days" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
              <FormTextField
                type="number"
                value={offchainDebate.expiry_days}
                onChange={e => setOffchainDebate("expiry_days", e.target.value)}
                inputProps={{ min: 0, style: { fontSize: 14 } }}
              />
            </FormField>
          </Grid>
          <Grid item xs={12}>
            <FormField label="Hours" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
              <FormTextField
                type="number"
                value={offchainDebate.expiry_hours}
                onChange={e => setOffchainDebate("expiry_hours", e.target.value)}
                inputProps={{ min: 0, max: 23, style: { fontSize: 14 } }}
              />
            </FormField>
          </Grid>
          <Grid item xs={12}>
            <FormField label="Minutes" labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
              <FormTextField
                type="number"
                value={offchainDebate.expiry_minutes}
                onChange={e => setOffchainDebate("expiry_minutes", e.target.value)}
                inputProps={{ min: 0, max: 59, style: { fontSize: 14 } }}
              />
            </FormField>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
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
        <Grid container direction="column" style={{ gap: 12 }}>
          {choices.map((choice, index) => (
            <Grid item key={index}>
              <FormField label={`Option ${index + 1}`} labelStyle={{ fontSize: 16 }} containerStyle={{ gap: 12 }}>
                <FormTextField
                  value={choice}
                  onChange={e => handleChoiceChange(index, e.target.value)}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputProps={{
                    endAdornment:
                      choices.length > 2 ? (
                        <InputAdornment position="end">
                          <IconButton onClick={() => removeChoice(index)} style={{ color: "#FF4D4D", padding: 4 }}>
                            <RemoveCircleOutline />
                          </IconButton>
                        </InputAdornment>
                      ) : undefined
                  }}
                />
              </FormField>
            </Grid>
          ))}
        </Grid>
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
      </Grid>
    </Grid>
  )
}
