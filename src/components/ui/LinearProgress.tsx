import { Button, Grid, Theme, LinearProgress as MuiLinearProgress } from "@material-ui/core"
import { styled } from "@mui/material/styles"
import { withStyles } from "@material-ui/core/styles"

const StyledLinearProgress = withStyles((theme: Theme) => ({
  root: (props: { variant: "success" | "error" }) => ({
    "height": 10,
    "backgroundColor": theme.palette.primary.light,
    "color": theme.palette.primary.light,
    "& .MuiLinearProgress-bar": {
      backgroundColor: `${
        props.variant === "success" ? theme.palette.secondary.main : theme.palette.error.main
      } !important`
    }
  })
}))((props: { value: number }) => <MuiLinearProgress {...props} value={props.value} variant="determinate" />)

export const LinearProgress = ({ value, variant }: { value: number; variant: "success" | "error" }) => {
  return <StyledLinearProgress value={value} variant={variant} />
}
