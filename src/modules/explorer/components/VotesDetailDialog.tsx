import React, { useMemo } from "react"
import { Button, Grid, styled, Typography } from "@material-ui/core"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { useVotesStats } from "../hooks/useVotesStats"
import { BigNumber } from "bignumber.js"
import { useProposal } from "../../../services/services/dao/hooks/useProposal"
import { VotesTable } from "./VotesTable"
import { roundNumber } from "../../../utils"
import { VotersProgress } from "./VotersProgress"

const StyledTab = styled(Button)({
  fontSize: 16
})

interface Props {
  open: boolean
  onClose: () => void
  daoAddress: string
  proposalAddress: string
}

enum SelectedVotes {
  ALL,
  SUPPORT,
  OPPOSE
}

export const VotesDetailDialog = ({ open, onClose, daoAddress, proposalAddress }: Props) => {
  const [selectedTab, setSelectedTab] = React.useState(SelectedVotes.ALL)

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }

  const { data: proposal } = useProposal(daoAddress, proposalAddress)

  const quorumThreshold = proposal?.quorumThreshold || new BigNumber(0)
  const votesData = proposal?.voters

  const { votesSum } = useVotesStats({
    quorumThreshold,
    upVotes: proposal?.upVotes || new BigNumber(0),
    downVotes: proposal?.downVotes || new BigNumber(0)
  })

  const { supportVotes, againstVotes, allVotes } = useMemo(() => {
    if (!votesData) {
      return {
        supportVotes: [],
        againstVotes: [],
        allVotes: []
      }
    }

    const allVotes = votesData.map(voter => ({
      address: voter.address,
      votes: roundNumber({ number: Number(voter.value.toString()), decimals: 2 }).toString(),
      support: voter.support
    }))

    const supportVotes = allVotes.filter(voter => voter.support)
    const againstVotes = allVotes.filter(voter => !voter.support)

    return {
      allVotes,
      supportVotes,
      againstVotes
    }
  }, [votesData])

  const votesToShow =
    selectedTab == SelectedVotes.ALL ? allVotes : selectedTab == SelectedVotes.SUPPORT ? supportVotes : againstVotes

  return (
    <ResponsiveDialog open={open} onClose={onClose} title={"Votes"}>
      <Grid container direction={"column"} style={{ gap: 58 }}>
        <Grid item container direction={"column"} style={{ gap: 16 }}>
          <Grid item>
            <Typography variant={"h2"} color={"textPrimary"} style={{ fontWeight: "bold" }}>
              {votesSum.toString()}
            </Typography>
          </Grid>
          <Grid item>
            <VotersProgress wrapAll={true} showButton={false} daoId={daoAddress} proposalId={proposalAddress} />
          </Grid>
        </Grid>
        <Grid item container direction={"column"} style={{ gap: 40 }}>
          <Grid item container>
            <Grid item>
              <StyledTab
                variant="contained"
                color={selectedTab !== SelectedVotes.ALL ? "primary" : "secondary"}
                disableRipple={true}
                disableElevation={true}
                onClick={() => handleChangeTab(SelectedVotes.ALL)}
              >
                All
              </StyledTab>
            </Grid>
            <Grid item>
              <StyledTab
                disableRipple={true}
                disableElevation={true}
                variant="contained"
                color={selectedTab !== SelectedVotes.SUPPORT ? "primary" : "secondary"}
                onClick={() => handleChangeTab(SelectedVotes.SUPPORT)}
              >
                Support
              </StyledTab>
            </Grid>
            <Grid item>
              <StyledTab
                disableRipple={true}
                disableElevation={true}
                variant="contained"
                color={selectedTab !== SelectedVotes.OPPOSE ? "primary" : "secondary"}
                onClick={() => handleChangeTab(SelectedVotes.OPPOSE)}
              >
                Oppose
              </StyledTab>
            </Grid>
          </Grid>
          <Grid item>
            <VotesTable data={votesToShow} />
          </Grid>
        </Grid>
      </Grid>
    </ResponsiveDialog>
  )
}
