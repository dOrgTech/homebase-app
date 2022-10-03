import React from "react"
import { Grid, styled, Typography } from "@material-ui/core"

const StyledBody = styled(Grid)(({ theme }) => ({
  "borderRadius": 4,
  "background": theme.palette.primary.main,
  "padding": "0 20px",
  "minHeight": 54,
  "& input": {
    minHeight: 54,
    padding: 0,
    textAlign: "start"
  },

  "& .MuiInputBase-input": {
    fontWeight: 300
  }
}))

const StyledBodyTextarea = styled(Grid)(({ theme }) => ({
  "borderRadius": 4,
  "background": "#121416",
  "maxHeight": 500,
  "overflow": "scroll",
  "& input": {
    maxHeight: 500,
    padding: 0,
    textAlign: "start",
    overflow: "scroll"
  },

  "& .MuiInputBase-input": {
    fontWeight: 300
  }
}))

export const ProposalFormInput: React.FC<{ label?: string }> = ({ label, children }) => {
  return (
    <Grid container direction={"column"} style={{ gap: 18 }}>
      {label ? (
        <Grid item>
          <Typography style={{ fontWeight: 400 }} color={"textPrimary"}>
            {label}
          </Typography>
        </Grid>
      ) : null}
      <StyledBody>{children}</StyledBody>
    </Grid>
  )
}

export const ProposalFormTextarea: React.FC<{ label?: string; children: any }> = ({ label, children }) => {
  return (
    <Grid container direction={"column"} style={{ gap: 18 }}>
      {label ? (
        <Grid item>
          <Typography style={{ fontWeight: 400 }} color={"textPrimary"}>
            {label}
          </Typography>
        </Grid>
      ) : null}
      <StyledBodyTextarea>{children}</StyledBodyTextarea>
    </Grid>
  )
}
