import React from "react"
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  FileCopyOutlined
} from "components/ui"
import { TableContainer, MobileTableHeader, MobileTableRow } from "components/ui/Table"
import { etherlinkStyled } from "components/ui"
import { useNotification } from "modules/common/hooks/useNotification"
const { OverflowCell, OverflowItem } = etherlinkStyled

const desktopTitles = ["Registry Items", "Value", "Copy"]

interface RowData {
  key: string
  value: string
  onClick: () => void
}

interface Props {
  data: RowData[]
}

const MobileRegistryTable: React.FC<Props> = ({ data }) => {
  const openNotification = useNotification()

  const handleCopy = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    openNotification({
      message: "Copied to clipboard",
      variant: "success",
      autoHideDuration: 2000
    })
  }

  if (data.length === 0) {
    return (
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{ padding: 40 }}>
        <Typography align="center" variant="h6" color="textSecondary">
          There are no items in this DAO's registry
        </Typography>
      </Grid>
    )
  }

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
          style={{ gap: 19 }}
        >
          <Grid item style={{ width: "100%", maxWidth: 300, cursor: "pointer" }} onClick={() => rowData.onClick()}>
            <Typography variant="h6" color="secondary" align="center">
              Proposal Key
            </Typography>
            <Typography
              variant="h6"
              color="textPrimary"
              align="center"
              title={rowData.key.toUpperCase()}
              style={{ wordBreak: "break-word", fontWeight: "bold" }}
            >
              {rowData.key.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item style={{ width: "100%", maxWidth: 300 }}>
            <Typography variant="h6" color="secondary" align="center">
              Value
            </Typography>
            <Typography
              variant="h6"
              color="textPrimary"
              align="center"
              title={rowData.value}
              style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {rowData.value}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton aria-label="Copy registry value" onClick={e => handleCopy(rowData.value, e)}>
              <FileCopyOutlined fontSize="small" color="secondary" />
            </IconButton>
          </Grid>
        </MobileTableRow>
      ))}
    </Grid>
  )
}

const DesktopRegistryTable: React.FC<Props> = ({ data }) => {
  const openNotification = useNotification()

  const handleCopy = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    openNotification({
      message: "Copied to clipboard",
      variant: "success",
      autoHideDuration: 2000
    })
  }

  if (data.length === 0) {
    return (
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{ padding: 40 }}>
        <Typography align="center" variant="h6" color="textSecondary">
          There are no items in this DAO's registry
        </Typography>
      </Grid>
    )
  }

  return (
    <Table style={{ width: "100%", tableLayout: "fixed" }}>
      <TableHead>
        <TableRow>
          <TableCell style={{ width: "30%", minWidth: 200 }}>Registry Items</TableCell>
          <TableCell>Value</TableCell>
          <TableCell align="right" style={{ width: 80 }}>
            Copy
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((rowData, i) => (
          <TableRow key={`registryrow-${i}`}>
            <TableCell
              style={{ wordBreak: "break-word", fontWeight: "bold", cursor: "pointer" }}
              title={rowData.key.toUpperCase()}
              onClick={() => rowData.onClick()}
            >
              {rowData.key.toUpperCase()}
            </TableCell>
            <TableCell
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "#fff",
                maxWidth: 0
              }}
              title={rowData.value}
            >
              {rowData.value}
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Copy value">
                <IconButton aria-label="Copy registry value" onClick={e => handleCopy(rowData.value, e)}>
                  <FileCopyOutlined fontSize="small" color="secondary" />
                </IconButton>
              </Tooltip>
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
