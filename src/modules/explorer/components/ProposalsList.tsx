import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Collapse, Grid, styled } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import { Link } from "react-router-dom"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { ProposalTableRow } from "modules/lite/explorer/components/ProposalTableRow"
import { Poll } from "models/Polls"
import ReactPaginate from "react-paginate"
import "../pages/DAOList/styles.css"
import { Filters } from "../pages/User/components/UserMovements"
import { ProposalType } from "./FiltersUserDialog"

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
  filters: undefined | Filters
}

interface ProposalObj {
  type: string
  proposal: Proposal | Poll
}

export const ProposalsList: React.FC<Props> = ({
  currentLevel,
  proposals,
  liteProposals,
  proposalStyle,
  showFullList = true,
  filters = undefined
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const [open, setopen] = useState(true)
  const [filteredProposals, setFilteredProposals] = useState<ProposalObj[]>([])

  const listOfProposals = useMemo(() => {
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
    return proposalList
  }, [liteProposals, proposals])

  const pageCount = Math.ceil(filteredProposals ? filteredProposals.length / 4 : 0)

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (filteredProposals) {
      setOffset((event.selected * 4) % filteredProposals.length)
      setCurrentPage(event.selected)
    }
  }

  useEffect(() => {
    setFilteredProposals(listOfProposals)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filterByType = useCallback(
    (type: ProposalType) => {
      switch (type) {
        case ProposalType.ALL: {
          setFilteredProposals(listOfProposals)
          break
        }
        case ProposalType.OFF_CHAIN: {
          setFilteredProposals(listOfProposals.filter((item: ProposalObj) => item.type === "lite"))
          break
        }
        case ProposalType.ON_CHAIN: {
          setFilteredProposals(listOfProposals.filter((item: ProposalObj) => item.type === "lambda"))
          break
        }
        default:
          setFilteredProposals(listOfProposals)
          break
      }
    },
    [listOfProposals]
  )

  const applyFilters = useCallback(() => {
    console.log(filters)
    if (filters) {
      filterByType(filters.type)
      console.log(listOfProposals)
    }
  }, [filters, listOfProposals, filterByType])

  useEffect(() => {
    applyFilters()
  }, [filters, applyFilters])

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"} style={{ gap: 16 }}>
        {filteredProposals && filteredProposals.length && filteredProposals.length > 0 ? (
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
            {filteredProposals.slice(offset, offset + 4).map((p, i) =>
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
