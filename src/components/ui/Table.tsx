import { styled, Grid, Theme } from "@material-ui/core"

export const ContentContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  background: "#24282D"
}))

export const TableHeader = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: "16px 46px",
  minHeight: 34,
  [theme.breakpoints.down("sm")]: {
    gap: 10
  }
}))

export const TableContainer = styled(ContentContainer)({
  width: "100%"
})
