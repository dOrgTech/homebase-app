import { Collapse, Grid, IconButton, styled, Typography } from "@material-ui/core"
import { ProposalItem } from "modules/explorer/pages/User"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { ContentContainer } from "./ContentContainer"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import { ProposalTableRow } from "modules/lite/explorer/components/ProposalTableRow"
import { StyledDivider } from "modules/lite/explorer/components/ProposalList"
import { Poll } from "models/Polls"

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
  liteProposals: Poll[]
}

export const ProposalsList: React.FC<Props> = ({
  currentLevel,
  proposals,
  title,
  showFooter,
  rightItem,
  liteProposals
}) => {
  const [open, setopen] = useState(true)

  return (
    <TableContainer item>
      <Grid container direction="column" wrap={"nowrap"}>
        <TableHeader item container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" style={{ fontWeight: "500" }} color="textPrimary">
              {title}
            </Typography>
          </Grid>
          {proposals.length && proposals.length > 0 ? (
            <Grid item>
              <IconButton aria-label="expand row" size="small" onClick={() => setopen(!open)}>
                {open ? <KeyboardArrowUpIcon htmlColor="#FFF" /> : <KeyboardArrowDownIcon htmlColor="#FFF" />}
              </IconButton>
            </Grid>
          ) : null}
        </TableHeader>
        {proposals.length && proposals.length > 0 ? (
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
        ) : null}
        {liteProposals && liteProposals.length > 0
          ? liteProposals.map((poll, i) => {
              return (
                <div key={`poll-${i}`}>
                  <ProposalTableRow poll={poll} />
                  {liteProposals.length - 1 !== i ? <StyledDivider key={`divider-${i}`} /> : null}
                </div>
              )
            })
          : null}

        {!(proposals.length && proposals.length > 0) && !(liteProposals && liteProposals.length > 0) ? (
          <ProposalsFooter item container direction="column" justifyContent="center">
            <Grid item>
              <Typography color="textPrimary" align="center">
                No items
              </Typography>
            </Grid>
          </ProposalsFooter>
        ) : null}
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
