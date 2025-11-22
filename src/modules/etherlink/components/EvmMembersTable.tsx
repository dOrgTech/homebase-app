import React, { useMemo, useState } from "react"
import {
  styled,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress
} from "components/ui"
import dayjs from "dayjs"
import { Blockie } from "modules/common/Blockie"
import { CopyButton } from "components/ui/CopyButton"
import { toShortAddress } from "services/contracts/utils"
import numbro from "numbro"
import ReactPaginate from "react-paginate"
import { MemberProfileModal } from "./MemberProfileModal"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

interface RowData {
  address: string
  personalBalance: number
}

const HeaderText = styled(Typography)({
  fontWeight: 500,
  textTransform: "uppercase",
  fontSize: 14
})

const TableWrapper = styled("div")({
  width: "100%",
  padding: 0,
  margin: 0
})

const MemberRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}))

const AddressCell = styled(TableCell)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  borderBottom: "none"
})

const BalanceCell = styled(TableCell)({
  textAlign: "right",
  borderBottom: "none"
})

const formatConfig = {
  average: true,
  mantissa: 1,
  thousandSeparated: true,
  trimMantissa: true
}

const MembersTableContent: React.FC<{
  data: RowData[]
  symbol: string
  handlePageClick: (event: { selected: number }) => void
  pageCount: number
  currentPage: number
  offset: number
  isMobile: boolean
  loggedInAddress?: string
  onMemberClick: (member: RowData) => void
}> = ({ data, symbol, handlePageClick, pageCount, currentPage, offset, isMobile, loggedInAddress, onMemberClick }) => {
  const slicedData = useMemo(() => data.slice(offset, offset + 8), [data, offset])

  const isLoggedInUser = (address: string) => {
    return loggedInAddress?.toLowerCase() === address.toLowerCase()
  }

  return (
    <>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <HeaderText color="textPrimary">ADDRESS</HeaderText>
              </TableCell>
              <TableCell align="right">
                <HeaderText color="textPrimary">BALANCE</HeaderText>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((item, i) => {
              const isCurrentUser = isLoggedInUser(item.address)
              const clickable = !isCurrentUser
              return (
                <MemberRow
                  key={`member-${i}`}
                  style={{ cursor: clickable ? "pointer" : "default" }}
                  onClick={() => clickable && onMemberClick(item)}
                >
                  <AddressCell>
                    <Blockie address={item.address} size={24} />
                    <Typography color="textPrimary" variant="body2">
                      {isMobile ? toShortAddress(item.address) : item.address}
                    </Typography>
                    <CopyButton text={item.address} />
                  </AddressCell>
                  <BalanceCell>
                    <Typography color="textPrimary" variant="body2">
                      {numbro(item.personalBalance).format(formatConfig)} {symbol}
                    </Typography>
                  </BalanceCell>
                </MemberRow>
              )
            })}
          </TableBody>
        </Table>
      </TableWrapper>

      <Grid container direction="row" justifyContent="flex-end" style={{ marginTop: 20 }}>
        <ReactPaginate
          previousLabel={"<"}
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
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
  )
}

export const EvmMembersTable: React.FC<{ data: RowData[]; symbol: string; isLoading?: boolean }> = ({
  data,
  symbol,
  isLoading = false
}) => {
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(820))
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const [selectedMember, setSelectedMember] = useState<RowData | null>(null)
  const pageCount = Math.ceil((data?.length ?? 0) / 8)

  const { signer } = useEvmDaoOps()
  const loggedInAddress = signer?.address

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (data?.length) {
      const newOffset = (event.selected * 8) % data.length
      if (newOffset < 0 || newOffset >= data.length) {
        console.error("Invalid page offset:", newOffset)
        return
      }
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }

  const handleMemberClick = (member: RowData) => {
    setSelectedMember(member)
  }

  const handleCloseModal = () => {
    setSelectedMember(null)
  }

  if (isLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
        <CircularProgress color="secondary" />
      </Grid>
    )
  }

  if (!data?.length) {
    return <Typography color="textSecondary">No members found</Typography>
  }

  return (
    <>
      <MembersTableContent
        data={data}
        symbol={symbol}
        handlePageClick={handlePageClick}
        pageCount={pageCount}
        currentPage={currentPage}
        offset={offset}
        isMobile={isExtraSmall}
        loggedInAddress={loggedInAddress}
        onMemberClick={handleMemberClick}
      />
      {selectedMember && (
        <MemberProfileModal
          open={!!selectedMember}
          onClose={handleCloseModal}
          memberAddress={selectedMember.address}
          memberBalance={selectedMember.personalBalance}
        />
      )}
    </>
  )
}
