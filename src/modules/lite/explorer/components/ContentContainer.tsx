// TODO: Replace usage with components/ui/ContentContainer
import { styled, Grid } from "@mui/material"

export const ContentContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  background: theme.palette.primary.main
}))
