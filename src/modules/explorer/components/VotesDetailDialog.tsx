import React, { useMemo } from "react"
import { Button, Grid, styled, Theme, Typography } from "@material-ui/core"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { useVotesStats } from "../hooks/useVotesStats"
import { BigNumber } from "bignumber.js"
import { useProposal } from "../../../services/services/dao/hooks/useProposal"
import { VotesTable } from "./VotesTable"
import { roundNumber } from "../../../utils"
import { ReactComponent as TabsIcon } from "assets/img/tabs-icon.svg"
import { ReactComponent as TabsSelectedIcon } from "assets/img/tabs-icon-selected.svg"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { Blockie } from "modules/common/Blockie"

const StyledTab = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "fontSize": 18,
  "height": 40,
  "fontWeight": 400,
  "paddingLeft": 20,
  "paddingRight": 20,
  "paddingTop": 0,
  "paddingBottom": 0,
  "borderRadius": 8,
  "backgroundColor": isSelected ? "#2B3036" : "inherit",
  "color": isSelected ? theme.palette.secondary.main : "#fff",
  "&:hover": {
    backgroundColor: isSelected ? "#24282D" : theme.palette.secondary.dark,
    borderRadius: 8,
    borderTopLeftRadius: "8px !important",
    borderTopRightRadius: "8px !important",
    borderBottomLeftRadius: "8px !important",
    borderBottomRightRadius: "8px !important"
  }
}))

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
        <Grid item container direction={"column"} style={{ gap: 40 }}>
          <Grid item container spacing={2}>
            <Grid item>
              <StyledTab
                disableElevation={true}
                variant="contained"
                isSelected={selectedTab === SelectedVotes.ALL}
                onClick={() => handleChangeTab(SelectedVotes.ALL)}
                startIcon={selectedTab === SelectedVotes.ALL ? <TabsSelectedIcon /> : <TabsIcon />}
              >
                All
              </StyledTab>
            </Grid>
            <Grid item>
              <StyledTab
                variant="contained"
                disableElevation={true}
                isSelected={selectedTab === SelectedVotes.SUPPORT}
                onClick={() => handleChangeTab(SelectedVotes.SUPPORT)}
                startIcon={<ThumbUpIcon style={{ fontSize: 18 }} />}
              >
                Support
              </StyledTab>
            </Grid>
            <Grid item>
              <StyledTab
                variant="contained"
                disableElevation={true}
                isSelected={selectedTab === SelectedVotes.OPPOSE}
                onClick={() => handleChangeTab(SelectedVotes.OPPOSE)}
                startIcon={<ThumbDownIcon style={{ fontSize: 18 }} />}
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
