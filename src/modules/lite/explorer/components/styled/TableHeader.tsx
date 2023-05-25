import { styled, Grid } from "@material-ui/core"

export const TableHeader = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: 20
}))
