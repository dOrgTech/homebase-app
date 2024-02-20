import dayjs from "dayjs"
import React, { useMemo, useState } from "react"
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
import { TransferWithBN } from "services/contracts/baseDAO/hooks/useTransfers"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Network } from "services/beacon"
import { ContentContainer } from "modules/explorer/components/ContentContainer"
import { networkNameMap } from "services/bakingBad"
import { toShortAddress } from "services/contracts/utils"
import { ReactComponent as BulletIcon } from "assets/img/bullet.svg"
import { CopyButton } from "modules/common/CopyButton"
import ReactPaginate from "react-paginate"
import "../../DAOList/styles.css"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

const createData = (transfer: TransferWithBN) => {
  return {
    token: transfer.name,
    date: dayjs(transfer.date).format("L"),
    address: transfer.recipient,
    amount: transfer.amount.dp(10, 1).toString(),
    hash: transfer.hash
  }
}

const StyledBullet = styled(BulletIcon)({
  background: "#1DB",
  borderRadius: 50,
  marginRight: 6
})

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const RecipientText = styled(Typography)({
  marginLeft: 8,
  marginTop: 8
})

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

const ProposalsFooterMobile = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34,
  backgroundColor: "#2a2e32",
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8
})

interface RowData {
  token: string
  date: string
  amount: string
  address: string
  hash: string
}

const Titles = ["Token", "Date", "Recipient", "Amount"]

const titleDataMatcher = (title: (typeof Titles)[number], rowData: RowData) => {
  switch (title) {
    case "Token":
      return rowData.token
    case "Date":
      return rowData.date
    case "Amount":
      return rowData.amount
    case "Recipient":
      return toShortAddress(rowData.address)
    case "Sender":
      return rowData.address
  }
}
const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D",
  backgroundColor: "#383E43",
  borderTopRightRadius: 8,
  borderTopLeftRadius: 8
})

const MobileTableRow = styled(Grid)({
  "padding": "30px",
  "borderTop": "1px solid #575757",
  "&:last-child": {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8
  }
})

//TODO: Should mobile table items also redirect to block explorer on click?

const MobileTransfersTable: React.FC<{ data: RowData[]; network: Network }> = ({ data, network }) => {
  const openTxInfo = (data: RowData) => {
    window.open(`https://${network === "mainnet" ? "" : networkNameMap[network] + "."}tzkt.io/${data.hash}`)
  }

  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (data) {
      const newOffset = (event.selected * 5) % data.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }
  const pageCount = Math.ceil(data ? data.length / 5 : 0)
  return (
    <Grid container direction="column" alignItems="center">
      <MobileTableHeader item>
        <Typography align="center" variant="h4" color="textPrimary">
          Transfer History
        </Typography>
      </MobileTableHeader>
      {data.slice(offset, offset + 5).map((row, i) => (
        <MobileTableRow
          key={`transfersMobile-${i}`}
          item
          container
          direction="column"
          alignItems="center"
          onClick={() => openTxInfo(row)}
          style={i % 2 !== 1 ? { gap: 19, backgroundColor: "#2a2e32" } : { gap: 19, backgroundColor: "#383E43" }}
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
      {!(data && data.length > 0) ? (
        <ProposalsFooterMobile item container direction="column" justifyContent="center">
          <Grid item>
            <Typography color="textPrimary" align="left">
              No items
            </Typography>
          </Grid>
        </ProposalsFooterMobile>
      ) : null}
      <Grid container direction="row" justifyContent="flex-end">
        <ReactPaginate
          previousLabel={"<"}
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={4}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage}
        />
      </Grid>
    </Grid>
  )
}

const DesktopTransfersTable: React.FC<{ data: RowData[]; network: Network }> = ({ data: rows, network }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (rows) {
      const newOffset = (event.selected * 5) % rows.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }
  const pageCount = Math.ceil(rows ? rows.length / 5 : 0)
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
          {rows.slice(offset, offset + 5).map((row, i) => (
            <TableRow
              component={Link}
              key={`tokenrow-${i}`}
              href={`https://${network === "mainnet" ? "" : networkNameMap[network] + "."}tzkt.io/${row.hash}`}
              target="_blank"
            >
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StyledBullet /> {row.token}
                </div>
              </TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell style={{ display: "flex", alignItems: "center" }}>
                <RecipientText variant="body2">{toShortAddress(row.address)}</RecipientText>
                <CopyButton text={row.address} style={{ marginBottom: 2 }} />
              </TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
          {!(rows && rows.length > 0) ? (
            <ProposalsFooter item container direction="column" justifyContent="center">
              <Grid item>
                <Typography color="textPrimary" align="left">
                  No items
                </Typography>
              </Grid>
            </ProposalsFooter>
          ) : null}
        </TableBody>
      </Table>
      <Grid container direction="row" justifyContent="flex-end">
        <ReactPaginate
          previousLabel={"<"}
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={4}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage}
        />
      </Grid>
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
      {isSmall ? (
        <MobileTransfersTable data={rows} network={network} />
      ) : (
        <DesktopTransfersTable data={rows} network={network} />
      )}
    </TableContainer>
  )
}
