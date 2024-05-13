import React, { useEffect, useState } from "react"
import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@material-ui/core"
import { toShortAddress } from "../../../services/contracts/utils"
import { Blockie } from "modules/common/Blockie"
import ReactPaginate from "react-paginate"
import numbro from "numbro"
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore"

const StyledRow = styled(Grid)({
  paddingLeft: 46,
  paddingTop: 10,
  paddingBottom: 10
})

const titles = ["Address", "Votes"] as const

interface RowData {
  address: string
  votes: string
  id?: number
}

const formatConfig = {
  thousandSeparated: true
}

export const VotesTable: React.FC<{ data: RowData[] }> = ({ data }) => {
  const [columns, setColumns] = useState<RowData[]>([])
  const [countAddress, setCountAddress] = useState(0)
  const [countVotes, setCountVotes] = useState(0)

  useEffect(() => {
    if (data) {
      setColumns(data)
    }
  }, [data])

  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (data) {
      const newOffset = (event.selected * 6) % data.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }
  const pageCount = Math.ceil(data ? data.length / 6 : 0)

  const sortData = (index: number) => {
    switch (index) {
      case 0:
        setCountAddress(countAddress + 1)
        if (countAddress % 2 === 0) {
          const newOrder = columns.slice().sort((a, b) => (a.address > b.address ? 1 : -1))
          setColumns(newOrder)
        } else {
          setColumns(data)
        }
        return
      case 1:
        setCountVotes(countVotes + 1)
        if (countVotes % 2 === 0) {
          const newOrderVotes = columns.slice().sort((a, b) => Number(a.votes) - Number(b.votes))
          setColumns(newOrderVotes)
        } else {
          setColumns(data)
        }
        return
    }
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {titles.map((title, i) => (
              <TableCell key={`votestitle-${i}`}>
                <Grid item container alignItems="center">
                  {title}
                  <UnfoldMoreIcon
                    onClick={() => sortData(i)}
                    style={{ cursor: "pointer", opacity: 0.65, fontSize: 20, marginLeft: 8 }}
                  />
                </Grid>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {columns.length > 0 ? (
            columns.slice(offset, offset + 6).map((row, i) => (
              <TableRow key={`votesrow-${i}`}>
                <TableCell>
                  <Grid item container>
                    <Blockie address={row.address} size={24} style={{ marginRight: 16 }} />
                    {toShortAddress(row.address)}
                  </Grid>
                </TableCell>
                <TableCell>{numbro(row.votes).format(formatConfig)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <StyledRow item>
                <Typography color="textPrimary" align="left">
                  No items
                </Typography>
              </StyledRow>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    </>
  )
}
