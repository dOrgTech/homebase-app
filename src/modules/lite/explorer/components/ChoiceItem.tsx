import React, { Fragment } from "react"
import { Grid, Typography, IconButton, Divider } from "@mui/material"
import { RemoveCircleOutline } from "@material-ui/icons"

type ChoiceItemProps = {
  index: number
  description: string
}

export const ChoiceItem: React.FC<ChoiceItemProps> = ({ index, description }) => {
  return (
    <Fragment>
      <Grid container px={3.5} py={1.5} justifyContent={"space-between"} alignItems={"center"}>
        <Grid item>
          <Typography variant={"body2"}>{index}</Typography>
        </Grid>
        <Grid item>
          <Typography variant={"body2"}>{description}</Typography>
        </Grid>

        <Grid item>
          <IconButton size="small">
            <RemoveCircleOutline />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
    </Fragment>
  )
}
