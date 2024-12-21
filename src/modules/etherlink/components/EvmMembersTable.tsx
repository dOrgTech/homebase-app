import React, { useState } from "react"
import { styled, Grid, Typography, useTheme, useMediaQuery } from "@material-ui/core"
import dayjs from "dayjs"
import { Blockie } from "modules/common/Blockie"
import { CopyButton } from "components/ui/CopyButton"
import { toShortAddress } from "services/contracts/utils"
import numbro from "numbro"
import ReactPaginate from "react-paginate"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

interface RowData {
  address: string
  votingWeight: string
  personalBalance: string
  proposalsVoted: any[]
  proposalsCreated: any[]
}

const CardContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: "40px 48px",
  borderRadius: 8
}))

const Value = styled(Typography)({
  marginTop: 8,
  fontWeight: 300,
  gap: 6,
  display: "flex",
  textTransform: "uppercase"
})

const Symbol = styled(Typography)({
  marginLeft: 4,
  fontWeight: 300
})

const formatConfig = {
  average: true,
  mantissa: 1,
  thousandSeparated: true,
  trimMantissa: true
}

interface UserTable {
  data: RowData[]
  symbol: string
  handlePageClick: (event: { selected: number }) => void
  pageCount: number
  currentPage: number
  offset: number
}

const MobileUsersTable: React.FC<UserTable> = ({ data, symbol, handlePageClick, pageCount, currentPage, offset }) => {
  return (
    <>
      <Grid container style={{ gap: 32 }}>
        {data.slice(offset, offset + 8).map((item, i) => (
          <CardContainer key={`usersrow-${i}`} container direction="row" style={{ gap: 24 }}>
            <Grid item container direction="row" alignItems="center" xs={12} style={{ gap: 8 }}>
              <Blockie address={item.address} size={24} />
              <Typography style={{ fontWeight: 300 }} color="textPrimary" variant="body2">
                {toShortAddress(item.address)}
              </Typography>
              <CopyButton text={item.address} />
            </Grid>
            <Grid item container direction="row" xs={12} style={{ gap: 20 }}>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Voting Weight
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.votingWeight).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Personal Balance
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.personalBalance).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Proposals Created
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.proposalsCreated?.length).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Proposals Voted
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.proposalsVoted?.length).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
            </Grid>
          </CardContainer>
        ))}
        <Grid container direction="row" justifyContent="flex-end">
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
      </Grid>
    </>
  )
}

const DesktopUsersTable: React.FC<UserTable> = ({ data, symbol, handlePageClick, pageCount, currentPage, offset }) => {
  return (
    <>
      <Grid container style={{ gap: 32 }}>
        {data.slice(offset, offset + 8).map((item, i) => (
          <CardContainer key={`usersrow-${i}`} container direction="row" style={{ gap: 24 }}>
            <Grid item container direction="row" alignItems="center" xs={12} style={{ gap: 8 }}>
              <Blockie address={item.address} size={24} />
              <Typography style={{ fontWeight: 300 }} color="textPrimary" variant="body2">
                {item.address}
              </Typography>
              <CopyButton text={item.address} />
            </Grid>
            <Grid item container direction="row" xs={12} justifyContent="space-between">
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Voting Weight
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.votingWeight).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Personal Balance
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.personalBalance).format(formatConfig)}
                </Value>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Proposals Created
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.proposalsCreated?.length).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" variant="body2" style={{ fontWeight: 500 }}>
                  Proposals Voted
                </Typography>
                <Value variant="body2" color="secondary">
                  {numbro(item.proposalsVoted?.length).format(formatConfig)}
                  <Symbol variant="body2">{symbol}</Symbol>
                </Value>
              </Grid>
            </Grid>
          </CardContainer>
        ))}

        <Grid container direction="row" justifyContent="flex-end">
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
      </Grid>
    </>
  )
}

export const EvmMembersTable: React.FC<{ data: RowData[]; symbol: string }> = ({ data, symbol }) => {
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(820))
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const pageCount = Math.ceil(data ? data.length / 8 : 0)

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (data) {
      const newOffset = (event.selected * 8) % data.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }

  return isExtraSmall ? (
    <MobileUsersTable
      data={data}
      symbol={symbol}
      handlePageClick={handlePageClick}
      pageCount={pageCount}
      currentPage={currentPage}
      offset={offset}
    />
  ) : (
    <DesktopUsersTable
      data={data}
      symbol={symbol}
      handlePageClick={handlePageClick}
      pageCount={pageCount}
      currentPage={currentPage}
      offset={offset}
    />
  )
}
