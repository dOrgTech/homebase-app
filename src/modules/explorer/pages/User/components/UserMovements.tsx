import React from "react"
import { Button, Grid, Theme, Typography, styled } from "@material-ui/core"
import { ReactComponent as VotingInactiveIcon } from "assets/logos/voting_inactive.svg"
import { ReactComponent as VotingActiveIcon } from "assets/logos/voting_active.svg"
import { ReactComponent as VotesActiveIcon } from "assets/logos/votes_active.svg"
import { ReactComponent as VotesInactiveIcon } from "assets/logos/votes_inactive.svg"
import { ReactComponent as TransactionsInactiveIcon } from "assets/logos/transactions_inactive.svg"
import { ReactComponent as TransactionsActiveIcon } from "assets/logos/transactions_active.svg"
import { TabPanel } from "modules/explorer/components/TabPanel"
import { ProposalsList } from "../../../components/ProposalsList"
import { CycleInfo } from "services/contracts/baseDAO"
import { Proposal } from "services/services/dao/mappers/proposal/types"
import { Poll } from "models/Polls"

const TabsContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  gap: 16
}))

const VotedText = styled(Typography)({
  fontSize: 18
})

const StatusText = styled(Typography)({
  textTransform: "uppercase",
  marginLeft: 10,
  fontSize: 18,
  marginRight: 30
})

const StyledTab = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "fontSize": 18,
  "height": 40,
  "fontWeight": 400,
  "paddingLeft": 20,
  "paddingRight": 20,
  "paddingTop": 0,
  "paddingBottom": 0,
  "borderRadius": 8,
  "color": isSelected ? theme.palette.secondary.main : "#fff",
  "backgroundColor": isSelected ? "#24282D" : "inherit",
  "&:hover": {
    backgroundColor: isSelected ? "#24282D" : theme.palette.secondary.dark,
    borderRadius: 8,
    borderTopLeftRadius: "8px !important",
    borderTopRightRadius: "8px !important",
    borderBottomLeftRadius: "8px !important",
    borderBottomRightRadius: "8px !important"
  }
}))

const StyledTabInner = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "fontSize": 16,
  "height": 32,
  "fontWeight": 500,
  "paddingLeft": 20,
  "paddingRight": 20,
  "paddingTop": 0,
  "paddingBottom": 0,
  "borderRadius": 50,
  "color": isSelected ? theme.palette.secondary.main : "#bfc5ca",
  "backgroundColor": isSelected ? "#24282D" : "#2F3438",
  "&:hover": {
    backgroundColor: isSelected ? "#24282D" : theme.palette.secondary.dark,
    borderRadius: 50,
    borderTopLeftRadius: "50px !important",
    borderTopRightRadius: "50px !important",
    borderBottomLeftRadius: "50px !important",
    borderBottomRightRadius: "50px !important"
  }
}))

export const UserMovements: React.FC<{
  proposalsCreated: Proposal[]
  cycleInfo: CycleInfo | undefined
  pollsPosted: Poll[] | undefined
  proposalsVoted: Proposal[] | undefined
  getVoteDecision: (proposal: any) => boolean
}> = ({ proposalsCreated, cycleInfo, pollsPosted, proposalsVoted, getVoteDecision }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [selectedTabProposals, setSelectedTabProposals] = React.useState(0)
  const [selectedTabVotes, setSelectedTabVotes] = React.useState(0)

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }

  const handleChangeTabProposals = (newValue: number) => {
    setSelectedTabProposals(newValue)
  }

  const handleChangeTabVotes = (newValue: number) => {
    setSelectedTabVotes(newValue)
  }

  return (
    <Grid item>
      <Grid container style={{ marginTop: 8 }}>
        <Grid item>
          <TabsContainer container>
            <Grid item>
              <StyledTab
                startIcon={selectedTab === 0 ? <VotingActiveIcon /> : <VotingInactiveIcon />}
                variant="contained"
                disableElevation={true}
                onClick={() => handleChangeTab(0)}
                isSelected={selectedTab === 0}
              >
                Proposals
              </StyledTab>
            </Grid>
            <Grid item>
              <StyledTab
                startIcon={selectedTab === 1 ? <VotesActiveIcon /> : <VotesInactiveIcon />}
                disableElevation={true}
                variant="contained"
                onClick={() => handleChangeTab(1)}
                isSelected={selectedTab === 1}
              >
                Votes
              </StyledTab>
            </Grid>

            <Grid item>
              <StyledTab
                startIcon={selectedTab === 2 ? <TransactionsActiveIcon /> : <TransactionsInactiveIcon />}
                disableElevation={true}
                variant="contained"
                onClick={() => handleChangeTab(2)}
                isSelected={selectedTab === 2}
              >
                Transactions
              </StyledTab>
            </Grid>
          </TabsContainer>
        </Grid>
      </Grid>

      <Grid item style={{ marginTop: 38 }}>
        <TabPanel value={selectedTab} index={0}>
          <Grid container>
            <Grid item>
              <TabsContainer container>
                <Grid item>
                  <StyledTabInner
                    variant="contained"
                    disableElevation={true}
                    onClick={() => handleChangeTabProposals(0)}
                    isSelected={selectedTabProposals === 0}
                  >
                    All
                  </StyledTabInner>
                </Grid>
                <Grid item>
                  <StyledTabInner
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTabProposals(1)}
                    isSelected={selectedTabProposals === 1}
                  >
                    On-Chain
                  </StyledTabInner>
                </Grid>

                <Grid item>
                  <StyledTabInner
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTabProposals(2)}
                    isSelected={selectedTabProposals === 2}
                  >
                    Off-Chain
                  </StyledTabInner>
                </Grid>
              </TabsContainer>
            </Grid>
          </Grid>

          <TabPanel value={selectedTabProposals} index={0}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsCreated && cycleInfo && (
                <ProposalsList
                  currentLevel={cycleInfo.currentLevel}
                  proposals={proposalsCreated}
                  title={"Proposals Posted"}
                  liteProposals={pollsPosted}
                />
              )}
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTabProposals} index={1}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsCreated && cycleInfo && (
                <ProposalsList
                  currentLevel={cycleInfo.currentLevel}
                  proposals={proposalsCreated}
                  title={"Proposals Posted"}
                  liteProposals={[]}
                />
              )}
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTabProposals} index={2}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsCreated && cycleInfo && (
                <ProposalsList
                  currentLevel={cycleInfo.currentLevel}
                  proposals={[]}
                  title={"Proposals Posted"}
                  liteProposals={pollsPosted}
                />
              )}
            </Grid>
          </TabPanel>
        </TabPanel>

        {/* TAB VOTES CONTENT */}
        <TabPanel value={selectedTab} index={1}>
          <Grid container>
            <Grid item>
              <TabsContainer container>
                <Grid item>
                  <StyledTabInner
                    variant="contained"
                    disableElevation={true}
                    onClick={() => handleChangeTabVotes(0)}
                    isSelected={selectedTabVotes === 0}
                  >
                    All
                  </StyledTabInner>
                </Grid>
                <Grid item>
                  <StyledTabInner
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTabVotes(1)}
                    isSelected={selectedTabVotes === 1}
                  >
                    On-Chain
                  </StyledTabInner>
                </Grid>

                <Grid item>
                  <StyledTabInner
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTabVotes(2)}
                    isSelected={selectedTabVotes === 2}
                  >
                    Off-Chain
                  </StyledTabInner>
                </Grid>
              </TabsContainer>
            </Grid>
          </Grid>

          <TabPanel value={selectedTabVotes} index={0}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsVoted && cycleInfo && (
                <ProposalsList
                  title={"Voting History"}
                  currentLevel={cycleInfo.currentLevel}
                  proposals={proposalsVoted}
                  rightItem={proposal => {
                    const voteDecision = getVoteDecision(proposal)
                    return (
                      <Grid container>
                        <Grid item>
                          <VotedText color="textPrimary">Voted</VotedText>
                        </Grid>
                        <Grid item>
                          <StatusText color={voteDecision ? "secondary" : "error"}>
                            {voteDecision ? "YES" : "NO"}
                          </StatusText>
                        </Grid>
                      </Grid>
                    )
                  }}
                  liteProposals={pollsPosted}
                />
              )}
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTabVotes} index={1}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsCreated && cycleInfo && (
                <ProposalsList
                  currentLevel={cycleInfo.currentLevel}
                  proposals={proposalsCreated}
                  title={"Proposals Posted"}
                  liteProposals={[]}
                />
              )}
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTabVotes} index={2}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsCreated && cycleInfo && (
                <ProposalsList
                  currentLevel={cycleInfo.currentLevel}
                  proposals={[]}
                  title={"Proposals Posted"}
                  liteProposals={pollsPosted}
                />
              )}
            </Grid>
          </TabPanel>
        </TabPanel>
      </Grid>
    </Grid>
  )
}
