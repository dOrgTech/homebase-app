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

export const TableContainerGrid = styled(Grid)({
  width: "100%"
})

export const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D"
})

export const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D"
})
