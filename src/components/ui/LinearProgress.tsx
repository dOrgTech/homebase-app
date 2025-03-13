import { Theme, LinearProgress as MuiLinearProgress } from "@material-ui/core"
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

const StyledLinearProgressLoader = withStyles((theme: Theme) => ({
  root: {
    "backgroundColor": theme.palette.primary.light,
    "color": theme.palette.primary.light,
    "& .MuiLinearProgress-bar": {
      backgroundColor: theme.palette.secondary.main
    }
  }
}))(MuiLinearProgress)

export const LinearProgress = ({ value, variant }: { value: number; variant: "success" | "error" }) => {
  return <StyledLinearProgress value={value} variant={variant} />
}

export const LinearProgressLoader = () => {
  return <StyledLinearProgressLoader />
}
