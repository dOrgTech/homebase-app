import { Collapse, Grid, styled, Theme, Typography } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import React, { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Proposal, ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { ContentContainer } from "./ContentContainer"
import { ProposalFilter } from "./ProposalsFilter"

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const TableHeader = styled(Grid)(({ theme }: { theme: Theme }) => ({
  padding: "16px 46px",
  minHeight: 34,
  [theme.breakpoints.down("sm")]: {
    gap: 10
  }
}))

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  borderTop: ".6px solid rgba(125,140,139, 0.2)",
  minHeight: 34
})

interface Props {
  currentLevel: number
  proposals: Proposal[]
  title: string
  showFooter?: boolean
  rightItem?: (proposal: Proposal) => React.ReactElement
}

export const AllProposalsList: React.FC<Props> = ({ currentLevel, proposals, title, showFooter, rightItem }) => {
  const [filteredProposal, setFilteredProposals] = useState(proposals)
  const [filter, setFilter] = useState("all")

  const filterProposals = useCallback(
    (status?: any) => {
      if (status === "all") {
        return setFilteredProposals(proposals)
      } else if (status !== "all" && status !== undefined) {
        const filtered = proposals.filter(proposal => proposal["cachedStatus"]?.status === status)
        setFilteredProposals(filtered)
      } else {
        return setFilteredProposals(proposals)
      }
    },
    [proposals]
  )

  useEffect(() => {
    filterProposals(filter)
  }, [filter, filterProposals])

  useEffect(() => {
    setFilteredProposals(proposals)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filterProposalByStatus = (status: any) => {
    setFilter(status)
  }

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"}>
        <TableHeader item container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body1" style={{ fontWeight: "500" }} color="textPrimary">
              {title}
            </Typography>
          </Grid>
          {proposals.length ? <ProposalFilter filterProposalByStatus={filterProposalByStatus} /> : null}
        </TableHeader>
        {filteredProposal.length ? (
          <Grid
            item
            container
            wrap={"nowrap"}
            component={Collapse}
            in={true}
            timeout="auto"
            unmountOnExit
            direction="column"
          >
            {filteredProposal.map((p, i) => (
              <Grid item key={`proposal-${i}`}>
                <Link to={`proposal/${p.id}`}>
                  <ProposalItem proposal={p} status={p.getStatus(currentLevel).status}>
                    {rightItem ? rightItem(p) : null}
                  </ProposalItem>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <ProposalsFooter item container direction="column" justifyContent="center">
            <Grid item>
              <Typography color="textPrimary" align="center">
                No items
              </Typography>
            </Grid>
          </ProposalsFooter>
        )}
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
    </TableContainer>
  )
}
