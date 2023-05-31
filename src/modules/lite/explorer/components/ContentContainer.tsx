import { styled, Grid } from "@material-ui/core"

export const ContentContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  background: theme.palette.primary.main
}))
