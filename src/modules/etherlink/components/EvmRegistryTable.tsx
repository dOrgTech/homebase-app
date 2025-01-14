import React, { useState } from "react"
import {
  Button,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import dayjs from "dayjs"

import { ContentContainer } from "modules/explorer/components/ContentContainer"

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

export const OverflowCell = styled(TableCell)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D"
})

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D"
})

const OverflowItem = styled(Grid)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 300
})

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const titleDataMatcher = (title: (typeof titles)[number], rowData: RowData) => {
  switch (title) {
    case "Registry Items":
      return rowData.key
    case "Value":
      return rowData.value
    case "Last Updated":
      return rowData.lastUpdated || "-"
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
  const [selectedItem, setSelectedItem] = useState<RowData>()
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableContainer item>
        {isSmall ? <MobileRegistryTable data={data} /> : <DesktopRegistryTable data={data} />}
      </TableContainer>
    </>
  )
}
