import { Grid, Typography } from "@material-ui/core"
import React from "react"

interface Props {
  blocks: number
}

export const EstimatedBlocks: React.FC<Props> = ({ blocks }) => {
  return (
    <Grid container style={{ gap: 32 }} wrap="nowrap">
      <Grid item>
        <Grid style={{ display: "flex", marginTop: 2 }} wrap="nowrap">
          <Typography color="secondary" variant="subtitle2" style={{ marginRight: 8 }}>
            {blocks} blocks
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
