import React, { useEffect, useMemo, useState } from "react"
import { Button, Grid, Theme, Typography, styled, useMediaQuery, useTheme } from "@material-ui/core"
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
import { ReactComponent as TabsSelectedIcon } from "assets/img/tabs-icon-selected.svg"
import FilterAltIcon from "@mui/icons-material/FilterAlt"

const TabsContainer = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  gap: 16
}))

const ProposalsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

const TransactionsFooter = styled(Grid)({
  padding: "16px 46px",
  minHeight: 34
})

const TitleText = styled(Typography)({
  fontWeight: 600,
  fontSize: 24
})

const SubtitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 18,
  color: theme.palette.primary.light
}))

const StyledTab = styled(Button)(({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
  "fontSize": 18,
  "height": 40,
  "fontWeight": 600,
  "paddingLeft": 20,
  "paddingRight": 20,
  "paddingTop": 0,
  "paddingBottom": 0,
  "borderRadius": 8,
  "color": isSelected ? theme.palette.secondary.main : "#fff",
  "backgroundColor": isSelected ? "#2B3036" : "inherit",
  "&:hover": {
    backgroundColor: isSelected ? "#2B3036" : theme.palette.secondary.dark,
    borderRadius: 8,
    borderTopLeftRadius: "8px !important",
    borderTopRightRadius: "8px !important",
    borderBottomLeftRadius: "8px !important",
    borderBottomRightRadius: "8px !important"
  }
}))

const ActivityContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.primary.contrastText,
  padding: "40px 56px",
  borderRadius: 8,
  marginTop: 32,
  [theme.breakpoints.down("sm")]: {
    padding: "30px 36px"
  }
}))

const ViewAll = styled(Grid)(({ theme }) => ({
  "cursor": "pointer",
  "width": "fit-content",
  "marginTop": 45,
  "& svg": {
    marginRight: 10,
    color: theme.palette.secondary.main
  }
}))

export const UserMovements: React.FC<{
  daoId: string
  proposalsCreated: Proposal[]
  cycleInfo: CycleInfo | undefined
  pollsPosted: Poll[] | undefined
  proposalsVoted: Proposal[] | undefined
  pollsVoted: any
}> = ({ proposalsCreated, cycleInfo, pollsPosted, proposalsVoted, daoId, pollsVoted }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [filteredTransactions, setFilteredTransactions] = React.useState<TransferWithBN[] | undefined>()
  const [showFullList, setShowFullList] = useState(false)
  const { account } = useTezos()
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const useUserTransfers = (): TransferWithBN[] | undefined => {
    const { data: transfers } = useTransfers(daoId)

    return useMemo(() => {
      const filteredTransfers = transfers?.filter(item => item.recipient === account || item.sender === account)
      return filteredTransfers
    }, [transfers])
  }

  const transfers = useUserTransfers()

  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const count = 4

  const [pageCount, setPageCount] = React.useState(count)

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }

  useEffect(() => {
    setFilteredTransactions(transfers)
    setPageCount(Math.ceil(transfers ? transfers.length / count : 0))
  }, [transfers])

  // const handleChangeTabTransactions = (newValue: number) => {
  //   if (newValue === 0) {
  //     setFilteredTransactions(transfers)
  //     setPageCount(Math.ceil(transfers ? transfers.length / 2 : 0))
  //   }
  //   if (newValue === 1) {
  //     const newArray = transfers?.filter(item => item.type === "Withdrawal")
  //     setFilteredTransactions(newArray)
  //     setPageCount(Math.ceil(newArray ? newArray.length / 2 : 1))
  //   }
  //   if (newValue === 2) {
  //     const newArray = transfers?.filter(item => item.type === "Deposit")
  //     setFilteredTransactions(newArray)
  //     setPageCount(Math.ceil(newArray ? newArray.length / 2 : 1))
  //   }
  //   setSelectedTabTransactions(newValue)
  // }

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (transfers) {
      const newOffset = (event.selected * count) % (filteredTransactions ? filteredTransactions.length : 1)
      setOffset(newOffset)
      setCurrentPage(event.selected)
    }
  }

  return (
    <Grid item>
      <Grid container direction="column">
        <Grid item>
          <TitleText color="textPrimary">My Activity</TitleText>
        </Grid>
        <Grid item>
          <SubtitleText>View your proposal and transaction activity</SubtitleText>
        </Grid>
      </Grid>
      <ActivityContainer>
        <Grid container>
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

        {!showFullList ? (
          <ViewAll item xs={isMobileSmall ? 12 : 2} onClick={() => setShowFullList(true)}>
            <Grid item container direction="row" alignItems="center">
              <TabsSelectedIcon />
              <Typography color="secondary">View All</Typography>
            </Grid>
          </ViewAll>
        ) : (
          <ViewAll item xs={isMobileSmall ? 12 : 2}>
            <Grid item container direction="row" alignItems="center">
              <FilterAltIcon color="secondary" />
              <Typography color="secondary">Filter & Sort</Typography>
            </Grid>
          </ViewAll>
        )}

        <Grid item style={{ marginTop: 38 }}>
          <TabPanel value={selectedTab} index={0}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsCreated && cycleInfo && (
                <ProposalsList
                  currentLevel={cycleInfo.currentLevel}
                  proposals={showFullList ? proposalsCreated : proposalsCreated.slice(0, 2)}
                  liteProposals={showFullList ? pollsPosted : pollsPosted?.slice(0, 2)}
                  showFullList={showFullList}
                />
              )}
              {!(proposalsCreated && proposalsCreated.length > 0) && !(pollsPosted && pollsPosted.length > 0) ? (
                <ProposalsFooter item container direction="column" justifyContent="center">
                  <Grid item>
                    <Typography color="textPrimary" align="center">
                      No items
                    </Typography>
                  </Grid>
                </ProposalsFooter>
              ) : null}
            </Grid>
          </TabPanel>

          {/* TAB VOTES CONTENT */}
          <TabPanel value={selectedTab} index={1}>
            <Grid item style={{ marginTop: 38 }}>
              {proposalsVoted && cycleInfo && (
                <ProposalsList
                  currentLevel={cycleInfo.currentLevel}
                  proposals={showFullList ? proposalsVoted : proposalsVoted.slice(0, 2)}
                  showFullList={showFullList}
                  liteProposals={showFullList ? pollsVoted : pollsVoted.slice(0, 2)}
                />
              )}
              {!(proposalsVoted && proposalsVoted.length > 0) && !(pollsVoted && pollsVoted.length > 0) ? (
                <ProposalsFooter item container direction="column" justifyContent="center">
                  <Grid item>
                    <Typography color="textPrimary" align="center">
                      No items
                    </Typography>
                  </Grid>
                </ProposalsFooter>
              ) : null}
            </Grid>
          </TabPanel>

          {/* TAB TRANSACTIONS CONTENT */}
          <TabPanel value={selectedTab} index={2}>
            {transfers && transfers.length > 0 ? (
              <Grid container item style={{ marginTop: 38, gap: 16 }}>
                {transfers &&
                  transfers
                    .slice(showFullList ? offset : 0, showFullList ? offset + count : count)
                    .map((transfer, i) => <TransactionItem key={i} item={transfer}></TransactionItem>)}
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
        </Grid>
      </ActivityContainer>
    </Grid>
  )
}
