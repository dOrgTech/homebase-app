import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { ArrowBackIosOutlined } from "@material-ui/icons"
import { useHistory } from "react-router"

export const BackButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const navigate = useHistory()
  return (
    <Grid
      container
      style={{ gap: 15, cursor: "pointer", marginBottom: 23, width: "fit-content" }}
      onClick={() => (onClick ? onClick() : navigate.goBack())}
      alignItems="center"
    >
      <ArrowBackIosOutlined color="secondary" />
      <Typography color="secondary">Back</Typography>
    </Grid>
  )
}
