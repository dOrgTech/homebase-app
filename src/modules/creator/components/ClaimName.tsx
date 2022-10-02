import { Grid, Paper, styled, Typography } from "@material-ui/core"
import React from "react"

const CustomUrlButton = styled(Paper)({
  border: "1px solid #3866F9",
  width: 165,
  height: 31,
  boxSizing: "border-box",
  borderRadius: 21,
  cursor: "pointer",
  backgroundColor: "#fff",
  boxShadow: "none",
  textAlign: "center",
  margin: "auto",
  padding: 5,
  color: "#3866F9",
  marginTop: 12,
  fontFamily: "system-ui"
})

const CustomContainer = styled(Grid)({
  height: 62,
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid #E4E4E4",
  boxSizing: "border-box",
  marginTop: 14
})

export const ClaimName: React.FC = () => {
  return (
    <>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography variant="h2">Claim a name</Typography>
        </Grid>
        <Grid item xs={6}>
          <CustomUrlButton>Use a custom URL</CustomUrlButton>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Typography variant="subtitle1">Organization’s name</Typography>
        </Grid>
      </Grid>
      <CustomContainer container direction="row"></CustomContainer>
    </>
  )
}
