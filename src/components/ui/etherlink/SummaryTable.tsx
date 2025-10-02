import { TableContainer, TableCell, Typography, styled } from "@material-ui/core"

export const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  width: "inherit",
  [theme.breakpoints.down("sm")]: {}
}))

export const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingBottom: 0,
    paddingLeft: "16px !important",
    textAlign: "end"
  }
}))

export const CustomTableCellValue = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingTop: 0,
    paddingRight: "16px !important",
    textAlign: "end",
    paddingBottom: 0
  }
}))

export const RowValue = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  [theme.breakpoints.down("sm")]: {
    fontSize: 16
  }
}))
