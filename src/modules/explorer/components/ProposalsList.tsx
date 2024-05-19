import { Collapse, Grid, styled, Typography } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { ProposalTableRow } from "modules/lite/explorer/components/ProposalTableRow"
import { Poll } from "models/Polls"
import ReactPaginate from "react-paginate"
import "../pages/DAOList/styles.css"

const TableContainer = styled(Grid)({
  width: "100%"
})

const CustomGrid = styled(Grid)({
  "&:not(:last-child)": {
    marginBottom: 16
  }
})

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

interface Props {
  currentLevel: number
  proposals: Proposal[] | undefined
  showFooter?: boolean
  rightItem?: (proposal: Proposal) => React.ReactElement
  liteProposals: Poll[] | undefined
  proposalStyle?: any
}

export const ProposalsList: React.FC<Props> = ({
  currentLevel,
  proposals,
  showFooter,
  rightItem,
  liteProposals,
  proposalStyle
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const [open, setopen] = useState(true)

  const pageCount = Math.ceil(
    proposals && liteProposals
      ? proposals.length + liteProposals.length / 4
      : proposals && liteProposals?.length === undefined
      ? proposals.length / 4
      : proposals?.length === undefined && liteProposals
      ? liteProposals.length / 4
      : 0
  )

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (proposals) {
      const newOffset = (event.selected * 4) % proposals.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"} style={{ gap: 16 }}>
        {proposals && proposals.length && proposals.length > 0 ? (
          <Grid
            item
            container
            wrap={"nowrap"}
            component={Collapse}
            in={open}
            timeout="auto"
            unmountOnExit
            // style={{ display: "block" }}
            direction="column"
          >
            {proposals.slice(offset, offset + 4).map((p, i) => (
              <CustomGrid item key={`proposal-${i}`} style={proposalStyle}>
                <Link to={`proposal/${p.id}`}>
                  <ProposalItem proposal={p} status={p.getStatus(currentLevel).status}>
                    {rightItem ? rightItem(p) : null}
                  </ProposalItem>
                </Link>
              </CustomGrid>
            ))}
          </Grid>
        ) : null}
        {liteProposals && liteProposals.length > 0
          ? liteProposals.slice(offset, offset + 4).map((poll, i) => {
              return (
                <div style={{ width: "inherit" }} key={`poll-${i}`}>
                  <ProposalTableRow poll={poll} />
                </div>
              )
            })
          : null}

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
          nextClassName="nextButton"
          forcePage={currentPage}
          previousClassName="nextButton"
        />
      </Grid>
    </TableContainer>
  )
}
