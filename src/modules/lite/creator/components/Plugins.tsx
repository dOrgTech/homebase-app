import React from "react"
import { Button, Divider, Grid, styled, Typography } from "@material-ui/core"

const PluginsContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
}))

export const Plugins: React.FC = () => {
  return (
    <PluginsContainer>
      <Grid item>
        <Typography variant={"body2"} color="secondary">
          Choices
        </Typography>
      </Grid>
      <Divider />
      <Grid item>
        <Grid container justifyContent={"center"} alignItems={"center"} style={{ gap: 10 }}>
          <Button variant="contained" color="secondary">
            Add Plugin
          </Button>
        </Grid>
      </Grid>
    </PluginsContainer>
  )
}
