import React, { Fragment } from "react"
import { Grid, Typography, IconButton, Divider } from "@mui/material"
import { theme } from "theme"
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
          <Typography variant={"body2"} color={theme.palette.text.primary}>
            {index}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant={"body2"} color={theme.palette.text.secondary}>
            {description}
          </Typography>
        </Grid>

        <Grid item>
          <IconButton size="small">
            <RemoveCircleOutline htmlColor={theme.palette.error.main} />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
    </Fragment>
  )
}
