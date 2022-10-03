import { styled, LinearProgress, Theme } from "@material-ui/core"

export const ProgressBar = styled(LinearProgress)(({ theme, favor }: { theme: Theme; favor: boolean }) => ({
  "marginTop": 10,
  "&.MuiLinearProgress-colorSecondary, &.MuiLinearProgress-colorPrimary": {
    "background": theme.palette.primary.light,
    "color": theme.palette.primary.light,
    "& .MuiLinearProgress-bar": {
      backgroundColor: `${favor ? theme.palette.secondary.main : theme.palette.error.main} !important`
    }
  }
}))

export const MultiColorBar = styled(LinearProgress)(({ theme }: { theme: Theme }) => ({
  "marginTop": 10,
  "&.MuiLinearProgress-colorSecondary, &.MuiLinearProgress-colorPrimary": {
    "background": theme.palette.error.main,
    "color": theme.palette.error.main,
    "& .MuiLinearProgress-bar": {
      backgroundColor: `theme.palette.secondary.main !important`
    }
  }
}))
