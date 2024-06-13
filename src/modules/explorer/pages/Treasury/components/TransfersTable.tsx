import React, { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
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
import ReactPaginate from "react-paginate"
import "../../DAOList/styles.css"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import numbro from "numbro"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

const createData = (transfer: TransferWithBN) => {
  return {
    token: transfer.name,
    date: dayjs(transfer.date).format("L"),
    address: transfer.recipient,
    amount: transfer.amount.dp(10, 1).toString(),
    hash: transfer.hash,
    type: transfer.type
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

const ItemContainer = styled(Grid)(({ theme }) => ({
  padding: "40px 48px",
  gap: 8,
  borderRadius: 8,
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    padding: "30px 38px",
    gap: 20
  }
}))

const Container = styled(Grid)({
  gap: 24,
  display: "grid"
})

const Title = styled(Typography)({
  color: "#fff",
  fontSize: 24
})

const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  fontSize: 16,
  fontWeight: 300
}))

const AmountText = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: 18,
  fontWeight: 300,
  lineHeight: "160%"
}))

const BlockExplorer = styled(Typography)({
  "fontSize": 16,
  "fontWeight": 400,
  "cursor": "pointer",
  "display": "flex",
  "alignItems": "center",
  "& svg": {
    fontSize: 16,
    marginRight: 6
  }
})

interface RowData {
  token: string
  date: string
  amount: string
  address: string
  hash: string
  type: string | undefined
}

const Titles = ["Token", "Date", "Recipient", "Amount"]

const formatConfig = {
  average: true,
  mantissa: 1,
  thousandSeparated: true,
  trimMantissa: true
}

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
      window.scrollTo({ top: 0, behavior: "smooth" })
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
          nextClassName="nextButton"
          previousClassName="nextButton"
        />
      </Grid>
    </Grid>
  )
}

const TransfersTableItems: React.FC<{ data: RowData[]; network: Network }> = ({ data: rows, network }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("xs"))

  useEffect(() => {
    setOffset(0)
  }, [rows])

  const openBlockExplorer = (hash: string) => {
    window.open(`https://${networkNameMap[network]}.tzkt.io/` + hash, "_blank")
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (rows) {
      const newOffset = (event.selected * 5) % rows.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
  const pageCount = Math.ceil(rows ? rows.length / 5 : 0)
  return (
    <>
      {rows && rows.length > 0 ? (
        <>
          <Container item>
            {rows.slice(offset, offset + 5).map((row, i) => {
              return (
                <ItemContainer container key={`${row.hash}-${i}`} justifyContent="space-between" alignItems="center">
                  <Grid item xs={isSmall ? 12 : 5} style={isSmall ? { gap: 12 } : {}} container direction="column">
                    <Grid item container direction="row" alignItems="center">
                      <StyledBullet />
                      <Title>{row.token}</Title>
                    </Grid>
                    <Grid item container direction={isSmall ? "column" : "row"} style={{ gap: 10 }}>
                      <Subtitle>To {toShortAddress(row.address)}</Subtitle>
                      {isSmall ? null : <Subtitle> •</Subtitle>}
                      <Subtitle>{dayjs(row.date).format("ll")}</Subtitle>
                    </Grid>
                  </Grid>
                  <Grid item xs={isSmall ? 12 : 5} style={isSmall ? { gap: 6 } : {}} container direction="column">
                    <Grid item container direction="row" justifyContent={isSmall ? "flex-start" : "flex-end"}>
                      <AmountText>
                        {row.type ? (row.type === "Deposit" ? "-" : "+") : null}{" "}
                        {isSmall ? numbro(row.amount).format(formatConfig) : row.amount} {row.token}{" "}
                      </AmountText>
                    </Grid>
                    <Grid item direction="row" container justifyContent={isSmall ? "flex-start" : "flex-end"}>
                      <BlockExplorer color="secondary" onClick={() => openBlockExplorer(row.hash)}>
                        <OpenInNewIcon color="secondary" />
                        View on Block Explorer
                      </BlockExplorer>
                    </Grid>
                  </Grid>
                </ItemContainer>
              )
            })}
          </Container>

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
              nextClassName="nextButton"
              previousClassName="nextButton"
            />
          </Grid>
        </>
      ) : (
        <Typography color="textPrimary">No items</Typography>
      )}
    </>
  )
}

export const TransfersTable: React.FC<{ transfers: TransferWithBN[] }> = ({ transfers }) => {
  const rows = useMemo(() => {
    if (!transfers) {
      return []
    }

    return transfers.map(t => createData(t))
  }, [transfers])

  const { network } = useTezos()

  return (
    <TableContainer>
      {rows && rows.length > 0 ? (
        <TransfersTableItems data={rows} network={network} />
      ) : (
        <Typography color="textPrimary">No items</Typography>
      )}
    </TableContainer>
  )
}
