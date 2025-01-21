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
import { IEvmProposal } from "../types"
import { TableContainerGrid } from "components/ui/Table"
import { LoaderContainer } from "components/ui/Containers"

const CustomGrid = styled(Grid)({
  "&:not(:last-child)": {
    marginBottom: 16
  }
})

interface ProposalObj {
  type: string
  proposal: IEvmProposal | Poll
}

export const EvmDaoProposalList: React.FC<{
  proposals: IEvmProposal[] | undefined
  showFooter?: boolean
  rightItem?: (proposal: Proposal) => React.ReactElement
  showFullList?: boolean
}> = ({ proposals, showFullList = true }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const offsetLimit = 50
  const [filteredProposals, setFilteredProposals] = useState<ProposalObj[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
        type: proposal?.type,
        proposal: proposal
      })) ?? []
    )
  }, [proposals])

  return (
    <TableContainerGrid item>
      {isLoading ? (
        <LoaderContainer container direction="row" justifyContent="center">
          <CircularProgress color="secondary" />
        </LoaderContainer>
      ) : (
        <>
          <Grid container direction="column" wrap={"nowrap"} style={{ gap: 16 }}>
            {filteredProposals && filteredProposals.length && filteredProposals.length > 0 ? (
              <Grid item container wrap={"nowrap"} direction="column">
                {filteredProposals.slice(offset, offset + offsetLimit).map((p, i) => {
                  const proposalLink =
                    p.type == "offchain" ? `offchain-proposal/${p.proposal.id}` : `proposal/${p.proposal.id}`
                  return (
                    <CustomGrid item key={`proposal-${i}`} style={{ width: "100%" }}>
                      <Link to={proposalLink}>
                        <EvmProposalItem proposal={p.proposal}></EvmProposalItem>
                      </Link>
                    </CustomGrid>
                  )
                })}
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
    </TableContainerGrid>
  )
}
