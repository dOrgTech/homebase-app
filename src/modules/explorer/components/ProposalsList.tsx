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
  const [filteredProposals, setFilteredProposals] = useState<ProposalObj[]>([])
  // TODO: next two lines can be safely removed
  const [filter, setFilter] = useState<number>(0)
  const [filterOnchain, setFilterOnchain] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const itemsPerPage = 24
  const pageCount = Math.ceil(
    proposals && liteProposals
      ? proposals.length + liteProposals.length / itemsPerPage
      : proposals && liteProposals?.length === undefined
      ? proposals.length / itemsPerPage
      : proposals?.length === undefined && liteProposals
      ? liteProposals.length / itemsPerPage
      : 0
  )

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (proposals) {
      const newOffset = (event.selected * itemsPerPage) % proposals.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }

  const filterByOffchainStatus = useCallback((list: { type: string; proposal: Proposal | Poll }[], status: string) => {
    if (status === "all") {
      setIsLoading(false)
      setFilteredProposals(list)
      return
    } else {
      const filtered = list.slice().filter(item => item.type === "lite")
      const filteredList = filtered.filter((item: ProposalObj) => item.proposal.isActive === status)
      setFilteredProposals(filteredList)
      setIsLoading(false)
    }
  }, [])

  const filterByOnChainStatus = useCallback(
    (list: { type: string; proposal: Proposal | Poll }[], status: StatusOption[]) => {
      if (status.length > 0) {
        const updatedList: { type: string; proposal: Proposal | Poll }[] = []
        status.map((state: StatusOption) => {
          const filtered = list.slice().filter(item => item.type === "lambda")
          const filteredByStatus = filtered.filter(item => item.proposal.getStatus(currentLevel).status === state.label)
          updatedList.push(...filteredByStatus)
        })
        setFilteredProposals(updatedList)
      } else {
        setFilteredProposals(list)
      }
      setIsLoading(false)
    },
    []
  )

  // TODO: this can be probably removed as not in use
  const orderedList = (state: Order) => {
    if (state === "recent") {
      return listOfProposals
    } else {
      const proposalList: { type: string; proposal: Proposal | Poll }[] = []

      const orderedProposals = proposals!.slice().sort((a, b) => b.voters.length - a.voters.length)
      const orderedPolls = liteProposals?.slice().sort((a, b) => b.votes! - a.votes!)

      orderedProposals?.map(proposal => {
        const item = {
          type: "lambda",
          proposal: proposal
        }
        proposalList.push(item)
        return
      })
      orderedPolls?.map(proposal => {
        const item = {
          type: "lite",
          proposal: proposal
        }
        proposalList.push(item)
        return
      })
      return proposalList
    }
  }

  const applyFilters = useCallback(() => {
    const filterByType = (
      type: ProposalType,
      filters: Filters,
      list: { type: string; proposal: Proposal | Poll }[]
    ) => {
      switch (type) {
        case ProposalType.ALL: {
          setFilteredProposals(list)
          setIsLoading(false)
          break
        }
        case ProposalType.OFF_CHAIN: {
          setFilter(Math.random())
          setTimeout(() => {
            filterByOffchainStatus(list, filters.offchainStatus)
          }, 500)
          break
        }
        case ProposalType.ON_CHAIN: {
          setFilterOnchain("status")
          setTimeout(() => {
            filterByOnChainStatus(list, filters.onchainStatus)
          }, 1000)
          break
        }
        default:
          setFilteredProposals(list)
          setIsLoading(false)
          break
      }
    }
    if (filters) {
      setIsLoading(true)
      filterByType(filters.type, filters, listOfProposals)
    }
  }, [filters, filteredProposals])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

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
            {proposals.slice(offset, offset + itemsPerPage).map((p, i) => (
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
          ? liteProposals.slice(offset, offset + itemsPerPage).map((poll, i) => {
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
          forcePage={currentPage}
        />
      </Grid>
    </TableContainer>
  )
}
