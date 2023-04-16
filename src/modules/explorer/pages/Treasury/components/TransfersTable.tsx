import dayjs from "dayjs"
import React, { useMemo } from "react"
import {
  Grid,
  Link,
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
import hexToRgba from "hex-to-rgba"
import { TransferWithBN } from "services/contracts/baseDAO/hooks/useTransfers"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Network } from "services/beacon"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { networkNameMap } from "services/bakingBad"
import { Blockie } from "modules/common/Blockie"
import { toShortAddress } from "services/contracts/utils"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

const TokenSymbol = styled(Typography)(({ theme }) => ({
  background: hexToRgba(theme.palette.secondary.main, 0.11),
  borderRadius: 4,
  color: theme.palette.secondary.main,
  padding: "1px 8px",
  boxSizing: "border-box",
  width: "min-content"
}))

const createData = (transfer: TransferWithBN) => {
  return {
    token: transfer.name,
    date: dayjs(transfer.date).format("ll"),
    address: transfer.recipient,
    amount: transfer.amount.dp(10, 1).toString(),
    hash: transfer.hash
  }
}

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const RecipientText = styled(Typography)({
  marginLeft: 8,
  marginTop: 8
})

interface RowData {
  token: string
  date: string
  amount: string
  address: string
  hash: string
}

const Titles = ["Transfer History", "Date", "Recipient", "Amount"]

const titleDataMatcher = (title: (typeof Titles)[number], rowData: RowData) => {
  switch (title) {
    case "Transfer History":
      return rowData.token
    case "Date":
      return rowData.date
    case "Amount":
      return rowData.amount
    case "Recipient":
      return rowData.address
    case "Sender":
      return rowData.address
  }
}
const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D"
})

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D"
})

//TODO: Should mobile table items also redirect to block explorer on click?

const MobileTransfersTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Typography align="center" variant="h4" color="textPrimary">
          Transfer History
        </Typography>
      </MobileTableHeader>
      {data.map((row, i) => (
        <MobileTableRow
          key={`transfersMobile-${i}`}
          item
          container
          direction="column"
          alignItems="center"
          style={{ gap: 19 }}
        >
          {Titles.map((title, j) => (
            <Grid item key={`transfersMobileItem-${j}`}>
              <Typography variant="h6" color="secondary" align="center">
                {title === "Outbound Transfers" || title === "Inbound Transfers" ? "Token:" : title}
              </Typography>
              <Typography variant="h6" color="textPrimary" align="center">
                {titleDataMatcher(title, row)}
              </Typography>
            </Grid>
          ))}
        </MobileTableRow>
      ))}
    </Grid>
  )
}

const DesktopTransfersTable: React.FC<{ data: RowData[]; network: Network }> = ({ data: rows, network }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {Titles.map((title, i) => (
              <TableCell key={`tokentitle-${i}`}>{title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              component={Link}
              key={`tokenrow-${i}`}
              href={`https://${network === "mainnet" ? "" : networkNameMap[network] + "."}tzkt.io/${row.hash}`}
              target="_blank"
            >
              <TableCell>
                <TokenSymbol>{row.token}</TokenSymbol>
              </TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell style={{ display: "flex", alignItems: "center" }}>
                <Blockie address={row.address} size={24} style={{ marginTop: 8 }} />
                <RecipientText variant="body2">{toShortAddress(row.address)}</RecipientText>
              </TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export const TransfersTable: React.FC<{ transfers: TransferWithBN[] }> = ({ transfers }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const rows = useMemo(() => {
    if (!transfers) {
      return []
    }

    return transfers.map(t => createData(t))
  }, [transfers])

  const { network } = useTezos()

  return (
    <TableContainer>
      {isSmall ? <MobileTransfersTable data={rows} /> : <DesktopTransfersTable data={rows} network={network} />}
    </TableContainer>
  )
}
