import React, { useState } from "react"
import { Grid, Typography, styled } from "components/ui"
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab"
import { makeStyles } from "@material-ui/core/styles"
import { useMemberActivity } from "../hooks/useMemberActivity"
import { EvmDaoProposalList } from "./EvmDaoProposalList"

const ActivityContainer = styled(Grid)(({ theme }) => ({
  background: "#24282D",
  borderRadius: 8,
  padding: "24px 56px 16px",
  width: "100%",
  marginTop: "12px",
  [theme.breakpoints.down("sm")]: {
    padding: "20px 32px 16px"
  }
}))

const useStyles = makeStyles({
  toggleGroup: {
    marginBottom: 0
  }
})

const SeparatorLine = styled(Grid)({
  width: "100%",
  height: "1px",
  background: "#2b3030",
  marginTop: "16px",
  marginBottom: "16px"
})

interface EvmActivityHistoryProps {
  userAddress?: string
}

export const EvmActivityHistory: React.FC<EvmActivityHistoryProps> = ({ userAddress }) => {
  const classes = useStyles()
  const [view, setView] = useState("created")

  const { proposalsCreated, proposalsVoted, isLoading } = useMemberActivity(userAddress)

  if (isLoading) {
    return (
      <ActivityContainer item>
        <Typography color="textSecondary">Loading activity...</Typography>
      </ActivityContainer>
    )
  }

  return (
    <ActivityContainer item>
      <Grid item container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h2" style={{ color: "#fff" }}>
            Activity History
          </Typography>
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newValue) => newValue && setView(newValue)}
            className={classes.toggleGroup}
          >
            <ToggleButton value="created">PROPOSALS CREATED</ToggleButton>
            <ToggleButton value="voted">VOTING RECORD</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid item>
        <SeparatorLine />
      </Grid>
      <Grid item style={{ paddingBottom: 0, marginBottom: 0 }}>
        {view === "created" ? (
          proposalsCreated.length === 0 ? (
            <Typography color="textSecondary" style={{ padding: "24px", textAlign: "center" }}>
              No proposals created yet.
            </Typography>
          ) : (
            <EvmDaoProposalList proposals={proposalsCreated} />
          )
        ) : proposalsVoted.length === 0 ? (
          <Typography color="textSecondary" style={{ padding: "24px", textAlign: "center" }}>
            No voting history found.
          </Typography>
        ) : (
          <EvmDaoProposalList proposals={proposalsVoted} />
        )}
      </Grid>
    </ActivityContainer>
  )
}
