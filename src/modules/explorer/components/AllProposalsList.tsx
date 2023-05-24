import { Collapse, Grid, IconButton, Typography } from "@material-ui/core"
import { styled } from "@material-ui/styles"
import { ProposalItem } from "modules/explorer/pages/User"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Proposal, ProposalStatus } from "services/indexer/dao/mappers/proposal/types"
import { ContentContainer } from "./ContentContainer"
import { Dropdown } from "./Dropdown"

const TableContainer = styled(ContentContainer)({
  width: "100%"
})

const TableHeader = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

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
  const [filter, setFilter] = useState("All")

  const filterProposals = useCallback(
    (status?: any) => {
      if (status === "All") {
        return setFilteredProposals(proposals)
      } else if (status !== "All" && status !== undefined) {
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
            <Typography variant="body2" style={{ fontWeight: "500" }} color="textPrimary">
              {title}
            </Typography>
          </Grid>
          {proposals.length ? (
            <Grid item>
              <IconButton aria-label="expand row" size="small">
                <Dropdown
                  options={[
                    { name: "All", value: "All" },
                    { name: ProposalStatus.ACTIVE, value: ProposalStatus.ACTIVE },
                    { name: ProposalStatus.DROPPED, value: ProposalStatus.DROPPED },
                    { name: ProposalStatus.EXECUTABLE, value: ProposalStatus.EXECUTABLE },
                    { name: ProposalStatus.EXECUTED, value: ProposalStatus.EXECUTED },
                    { name: ProposalStatus.EXPIRED, value: ProposalStatus.EXPIRED },
                    { name: ProposalStatus.NO_QUORUM, value: ProposalStatus.NO_QUORUM },
                    { name: ProposalStatus.PASSED, value: ProposalStatus.PASSED },
                    { name: ProposalStatus.PENDING, value: ProposalStatus.PENDING },
                    { name: ProposalStatus.REJECTED, value: ProposalStatus.REJECTED }
                  ]}
                  value={"All"}
                  onSelected={filterProposalByStatus}
                />{" "}
              </IconButton>
            </Grid>
          ) : null}
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
