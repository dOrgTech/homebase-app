import React, { useEffect, useMemo, useState } from "react"
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
import { TransferWithBN, useTransfers } from "services/contracts/baseDAO/hooks/useTransfers"
import { TransactionItem } from "./TransactionItem"
import { useTezos } from "services/beacon/hooks/useTezos"
import ReactPaginate from "react-paginate"
import "../../DAOList/styles.css"

const TabsContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  gap: 16
}))

const TransactionsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

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
  daoId: string
  proposalsCreated: Proposal[]
  cycleInfo: CycleInfo | undefined
  pollsPosted: Poll[] | undefined
  proposalsVoted: Proposal[] | undefined
  getVoteDecision: (proposal: any) => boolean
}> = ({ proposalsCreated, cycleInfo, pollsPosted, proposalsVoted, getVoteDecision, daoId }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [selectedTabProposals, setSelectedTabProposals] = React.useState(0)
  const [selectedTabVotes, setSelectedTabVotes] = React.useState(0)
  const [selectedTabTransactions, setSelectedTabTransactions] = React.useState(0)
  const [filteredTransactions, setFilteredTransactions] = React.useState<TransferWithBN[] | undefined>()
  const { account } = useTezos()

  const useUserTransfers = (): TransferWithBN[] | undefined => {
    const { data: transfers } = useTransfers(daoId)

    return useMemo(() => {
      const filteredTransfers = transfers?.filter(item => item.recipient === account || item.sender === account)
      return filteredTransfers
    }, [transfers])
  }

  const transfers = useUserTransfers()

  useEffect(() => {
    setFilteredTransactions(transfers)
  }, [transfers])

  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const count = Math.ceil(transfers ? transfers.length / 2 : 0)

  const [pageCount, setPageCount] = React.useState(count)

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }

  const handleChangeTabProposals = (newValue: number) => {
    setSelectedTabProposals(newValue)
  }

  const handleChangeTabVotes = (newValue: number) => {
    setSelectedTabVotes(newValue)
  }

  const handleChangeTabTransactions = (newValue: number) => {
    if (newValue === 0) {
      setFilteredTransactions(transfers)
      setPageCount(Math.ceil(transfers ? transfers.length / 2 : 0))
    }
    if (newValue === 1) {
      const newArray = transfers?.filter(item => item.type === "Withdrawal")
      setFilteredTransactions(newArray)
      setPageCount(Math.ceil(newArray ? newArray.length / 2 : 1))
    }
    if (newValue === 2) {
      const newArray = transfers?.filter(item => item.type === "Deposit")
      setFilteredTransactions(newArray)
      setPageCount(Math.ceil(newArray ? newArray.length / 2 : 1))
    }
    setSelectedTabTransactions(newValue)
  }

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (transfers) {
      const newOffset = (event.selected * 2) % (filteredTransactions ? filteredTransactions.length : 1)
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
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
                  liteProposals={[]}
                />
              )}
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTabVotes} index={2}>
            <Grid item style={{ marginTop: 38 }}>
              {pollsPosted && cycleInfo && (
                <ProposalsList
                  title={"Voting History"}
                  currentLevel={cycleInfo.currentLevel}
                  proposals={[]}
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
        </TabPanel>

        {/* TAB TRANSACTIONS CONTENT */}
        <TabPanel value={selectedTab} index={2}>
          <Grid container>
            <Grid item>
              <TabsContainer container>
                <Grid item>
                  <StyledTabInner
                    variant="contained"
                    disableElevation={true}
                    onClick={() => handleChangeTabTransactions(0)}
                    isSelected={selectedTabTransactions === 0}
                  >
                    All
                  </StyledTabInner>
                </Grid>
                <Grid item>
                  <StyledTabInner
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTabTransactions(1)}
                    isSelected={selectedTabTransactions === 1}
                  >
                    Withdrawals
                  </StyledTabInner>
                </Grid>

                <Grid item>
                  <StyledTabInner
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTabTransactions(2)}
                    isSelected={selectedTabTransactions === 2}
                  >
                    Deposits
                  </StyledTabInner>
                </Grid>
              </TabsContainer>
            </Grid>
          </Grid>

          <TabPanel value={selectedTabTransactions} index={0}>
            {transfers && transfers.length > 0 ? (
              <Grid container item style={{ marginTop: 38, gap: 16 }}>
                {filteredTransactions &&
                  filteredTransactions
                    .slice(offset, offset + 2)
                    .map((transfer, i) => <TransactionItem key={i} item={transfer}></TransactionItem>)}
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
              </Grid>
            ) : (
              <TransactionsFooter item container direction="column" justifyContent="center">
                <Grid item>
                  <Typography color="textPrimary" align="center">
                    No items
                  </Typography>
                </Grid>
              </TransactionsFooter>
            )}
          </TabPanel>
          <TabPanel value={selectedTabTransactions} index={1}>
            {transfers && transfers.length > 0 ? (
              <Grid container item style={{ marginTop: 38, gap: 16 }}>
                {filteredTransactions &&
                  filteredTransactions
                    .slice(offset, offset + 2)
                    .map((transfer, i) => <TransactionItem key={i} item={transfer}></TransactionItem>)}
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
              </Grid>
            ) : (
              <TransactionsFooter item container direction="column" justifyContent="center">
                <Grid item>
                  <Typography color="textPrimary" align="center">
                    No items
                  </Typography>
                </Grid>
              </TransactionsFooter>
            )}
          </TabPanel>
          <TabPanel value={selectedTabTransactions} index={2}>
            {transfers && transfers.length > 0 ? (
              <Grid container item style={{ marginTop: 38, gap: 16 }}>
                {filteredTransactions &&
                  filteredTransactions
                    .slice(offset, offset + 2)
                    .map((transfer, i) => <TransactionItem key={i} item={transfer}></TransactionItem>)}
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
              </Grid>
            ) : (
              <TransactionsFooter item container direction="column" justifyContent="center">
                <Grid item>
                  <Typography color="textPrimary" align="center">
                    No items
                  </Typography>
                </Grid>
              </TransactionsFooter>
            )}
          </TabPanel>
        </TabPanel>
      </Grid>
    </Grid>
  )
}
