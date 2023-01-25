import { Collapse, Grid, IconButton, Typography } from "@material-ui/core"
import { styled } from "@material-ui/styles"
import { ProposalItem } from "modules/explorer/pages/User"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Proposal } from "services/indexer/dao/mappers/proposal/types"
import { ContentContainer } from "./ContentContainer"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"

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
  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"}>
        <TableHeader item container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" style={{ fontWeight: "500" }} color="textPrimary">
              {title}
            </Typography>
          </Grid>
          {proposals.length ? (
            <Grid item>
              <IconButton aria-label="expand row" size="small">
                <KeyboardArrowUpIcon htmlColor="#FFF" />
              </IconButton>
            </Grid>
          ) : null}
        </TableHeader>
        {proposals.length ? (
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
