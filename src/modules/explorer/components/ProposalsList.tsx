/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { CircularProgress, Collapse, Grid, Typography, styled } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import { Link } from "react-router-dom"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { ProposalTableRow } from "modules/lite/explorer/components/ProposalTableRow"
import { Poll } from "models/Polls"
import ReactPaginate from "react-paginate"
import "../pages/DAOList/styles.css"
import { Filters } from "../pages/User/components/UserMovements"
import { Order, ProposalType, StatusOption } from "./FiltersUserDialog"

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

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40
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
  const [filter, setFilter] = useState<number>(0)
  const [filterOnchain, setFilterOnchain] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    setFilteredProposals(listOfProposals)
  }, [])

  useEffect(() => {
    setFilteredProposals(listOfProposals)
  }, [showFullList])

  const pageCount = Math.ceil(filteredProposals ? filteredProposals.length / 4 : 0)

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (filteredProposals) {
      setOffset((event.selected * 4) % filteredProposals.length)
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
      {isLoading ? (
        <LoaderContainer container direction="row" justifyContent="center">
          <CircularProgress color="secondary" />
        </LoaderContainer>
      ) : (
        <>
          <Grid container direction="column" wrap={"nowrap"} style={{ gap: 16 }}>
            {filteredProposals && filteredProposals.length && filteredProposals.length > 0 ? (
              <Grid item container wrap={"nowrap"} direction="column">
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
            ) : (
              <Typography color="textPrimary">No proposals found</Typography>
            )}
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
        </>
      )}
    </TableContainer>
  )
}
