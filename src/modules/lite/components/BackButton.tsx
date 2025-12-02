import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { ArrowBackIosOutlined } from "@material-ui/icons"
import { useHistory } from "react-router"

export const BackButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled }) => {
  const navigate = useHistory()
  return (
    <Grid
      container
      style={{ gap: 15, cursor: "pointer", width: "fit-content", opacity: disabled ? 0.5 : 1 }}
      onClick={() => (onClick && !disabled ? onClick() : navigate.goBack())}
      alignItems="center"
      role="button"
      tabIndex={0}
      aria-label="Back"
      onKeyDown={e => e.key === "Enter" && (onClick ? onClick() : navigate.goBack())}
    >
      <ArrowBackIosOutlined color="secondary" />
      <Typography color="secondary">Back</Typography>
    </Grid>
  )
}
