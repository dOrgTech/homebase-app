import React from "react"
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "components/ui"
import dayjs from "dayjs"
import { TableContainer, MobileTableHeader, MobileTableRow } from "components/ui/Table"
import { etherlinkStyled } from "components/ui"
const { OverflowCell, OverflowItem } = etherlinkStyled
const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

const titles = ["Registry Items", "Value", "Last Updated"]

interface RowData {
  key: string
  value: string
  lastUpdated?: string
  onClick: () => void
}

interface Props {
  data: RowData[]
}

const titleDataMatcher = (title: (typeof titles)[number], rowData: RowData) => {
  switch (title) {
    case "Registry Items":
      return rowData.key
    case "Value":
      return rowData.value
    case "Last Updated":
      return rowData.lastUpdated || "-"
    default:
      console.error("Invalid title", title)
      return "-"
  }
}

const MobileRegistryTable: React.FC<Props> = ({ data }) => {
  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Typography align="center" variant="h4" color="textPrimary">
          Registry
        </Typography>
      </MobileTableHeader>
      {data.map((rowData, i) => (
        <MobileTableRow
          key={`registryMobile-${i}`}
          item
          container
          direction="column"
          alignItems="center"
          onClick={() => rowData.onClick()}
          style={{ gap: 19 }}
        >
          {titles.map((title, j) => (
            <OverflowItem item key={`registryMobileItem-${j}`}>
              <Typography variant="h6" color="secondary" align="center">
                {title === "Registry Items" ? "Proposal Key" : title}
              </Typography>
              <Typography variant="h6" color="textPrimary" align="center">
                {titleDataMatcher(title, rowData)}
              </Typography>
            </OverflowItem>
          ))}
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={e => {
                e.stopPropagation()
                rowData.onClick()
              }}
            >
              Edit
            </Button>
          </Grid>
        </MobileTableRow>
      ))}
    </Grid>
  )
}

const DesktopRegistryTable: React.FC<Props> = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {titles.map((title, i) => (
            <TableCell key={`registrytitle-${i}`}>{title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((rowData, i) => (
          <TableRow key={`registryrow-${i}`} onClick={() => rowData.onClick()}>
            <TableCell>{rowData.key.toUpperCase()}</TableCell>
            <OverflowCell>{rowData.value}</OverflowCell>
            <TableCell>{rowData.lastUpdated ? dayjs(rowData.lastUpdated).format("L") : "-"}</TableCell>
            <TableCell align="right">
              <Button
                variant="contained"
                color="secondary"
                onClick={e => {
                  e.stopPropagation()
                  rowData.onClick()
                }}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const EvmRegistryTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <>
      <TableContainer item>
        {isSmall ? <MobileRegistryTable data={data} /> : <DesktopRegistryTable data={data} />}
      </TableContainer>
    </>
  )
}
