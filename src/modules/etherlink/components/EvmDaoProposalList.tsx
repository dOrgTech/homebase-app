/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { CircularProgress, Collapse, Grid, Typography, styled } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import { Link } from "react-router-dom"
import { Proposal, ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { ProposalTableRow } from "modules/lite/explorer/components/ProposalTableRow"
import { Poll } from "models/Polls"
import ReactPaginate from "react-paginate"
import { EvmProposalItem } from "./EvmProposalItem"

const TableContainer = styled(Grid)({
  width: "100%"
})

const CustomGrid = styled(Grid)({
  "&:not(:last-child)": {
    marginBottom: 16
  }
})

const LoaderContainer = styled(Grid)({
  paddingTop: 40,
  paddingBottom: 40
})

interface Props {
  proposals: Proposal[] | undefined
  showFooter?: boolean
  rightItem?: (proposal: Proposal) => React.ReactElement
  showFullList?: boolean
}

interface ProposalObj {
  type: string
  proposal: Proposal | Poll
}

export const EvmDaoProposalList: React.FC<Props> = ({ proposals, showFullList = true }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const offsetLimit = 50
  const [filteredProposals, setFilteredProposals] = useState<ProposalObj[]>([])

  const [isLoading, setIsLoading] = useState(false)

  console.log("EvmDaoProposalList", proposals)
  console.log(
    "EvmDaoProposalListX",
    proposals?.filter((p: any) => p.proposalData?.length > 0).map((p: any) => p.type)
  )

  const pageCount = Math.ceil(proposals ? proposals.length / offsetLimit : 0)

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (filteredProposals) {
      setOffset((event.selected * offsetLimit) % filteredProposals.length)
      setCurrentPage(event.selected)
    }
  }

  useEffect(() => {
    setIsLoading(false)
    setFilteredProposals(
      proposals?.map((proposal: any) => ({
        id: proposal?.id,
        title: proposal?.title,
        proposer: proposal?.proposer || (proposal?.author as string),
        type: "lambda",
        proposal: proposal
      })) ?? []
    )
  }, [proposals])

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
                {filteredProposals.slice(offset, offset + offsetLimit).map((p, i) => (
                  <CustomGrid item key={`proposal-${i}`} style={{ width: "100%" }}>
                    <Link to={`proposal/${p.proposal.id}`}>
                      <EvmProposalItem proposal={p.proposal}></EvmProposalItem>
                    </Link>
                  </CustomGrid>
                ))}
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
