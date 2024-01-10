import { Collapse, Grid, IconButton, styled, Typography } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { ContentContainer } from "./ContentContainer"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import { ProposalTableRow } from "modules/lite/explorer/components/ProposalTableRow"
import { StyledDivider } from "modules/lite/explorer/components/ProposalList"
import { Poll } from "models/Polls"
import ReactPaginate from "react-paginate"
import "../pages/DAOList/styles.css"

const TableContainer = styled(Grid)({
  width: "100%"
})

const TableHeader = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

interface Props {
  currentLevel: number
  proposals: Proposal[]
  showFooter?: boolean
  rightItem?: (proposal: Proposal) => React.ReactElement
  liteProposals: Poll[] | undefined
}

export const ProposalsList: React.FC<Props> = ({ currentLevel, proposals, showFooter, rightItem, liteProposals }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [open, setopen] = useState(true)
  const [offset, setOffset] = useState(0)

  const pageCount = Math.ceil(proposals && liteProposals ? proposals.length + liteProposals.length / 16 : 0)

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (proposals) {
      const newOffset = (event.selected * 2) % proposals.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"} style={{ gap: 16 }}>
        {proposals.length && proposals.length > 0 ? (
          <Grid
            item
            container
            wrap={"nowrap"}
            component={Collapse}
            in={open}
            timeout="auto"
            unmountOnExit
            direction="column"
          >
            {proposals.map((p, i) => (
              <Grid item key={`proposal-${i}`}>
                <Link to={`proposal/${p.id}`}>
                  <ProposalItem proposal={p} status={p.getStatus(currentLevel).status}>
                    {rightItem ? rightItem(p) : null}
                  </ProposalItem>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : null}
        {liteProposals && liteProposals.length > 0
          ? liteProposals.map((poll, i) => {
              return (
                <div key={`poll-${i}`}>
                  <ProposalTableRow poll={poll} />
                </div>
              )
            })
          : null}

        {!(proposals.length && proposals.length > 0) && !(liteProposals && liteProposals.length > 0) ? (
          <ProposalsFooter item container direction="column" justifyContent="center">
            <Grid item>
              <Typography color="textPrimary" align="center">
                No items
              </Typography>
            </Grid>
          </ProposalsFooter>
        ) : null}
        {showFooter && (
          <ProposalsFooter item container direction="column" justifyContent="center">
            <Grid item>
              <Link to="proposals">
                <Typography color="secondary" variant="body2" align="center">
                  View All Proposals
                </Typography>
              </Link>
            </Grid>
          </ProposalsFooter>
        )}
      </Grid>
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
        />
      </Grid>
    </TableContainer>
  )
}
