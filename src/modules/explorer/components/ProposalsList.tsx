import React, { useState } from "react"
import { Collapse, Grid, styled, Typography } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
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
  showFullList?: boolean
}

export const ProposalsList: React.FC<Props> = ({
  currentLevel,
  proposals,
  showFooter,
  rightItem,
  liteProposals,
  proposalStyle,
  showFullList = true
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const [open, setopen] = useState(true)

  const proposalList: { type: string; proposal: Proposal | Poll }[] = []
  proposals?.map(proposal => {
    const item = {
      type: "lambda",
      proposal: proposal
    }
    proposalList.push(item)
    return
  })
  liteProposals?.map(proposal => {
    const item = {
      type: "lite",
      proposal: proposal
    }
    proposalList.push(item)
    return
  })

  const pageCount = Math.ceil(proposalList ? proposalList.length / 4 : 0)

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (proposalList) {
      setOffset((event.selected * 4) % proposalList.length)
      setCurrentPage(event.selected)
    }
  }

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"} style={{ gap: 16 }}>
        {proposalList && proposalList.length && proposalList.length > 0 ? (
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
            {proposalList.slice(offset, offset + 4).map((p, i) =>
              p.type === "lambda" ? (
                <CustomGrid item key={`proposal-${i}`} style={proposalStyle}>
                  <Link to={`proposal/${p.proposal.id}`}>
                    <ProposalItem
                      proposal={p.proposal}
                      status={p.proposal.getStatus(currentLevel).status}
                    ></ProposalItem>
                  </Link>
                </CustomGrid>
              ) : (
                <div style={{ width: "inherit", marginBottom: 16 }} key={`poll-${i}`}>
                  <ProposalTableRow poll={p.proposal} />
                </div>
              )
            )}
          </Grid>
        ) : null}
      </Grid>
      {/* <Grid container direction="row" justifyContent="flex-end">
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
      </Grid> */}
      {showFullList ? (
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
      ) : null}
    </TableContainer>
  )
}
