import React, { useMemo, useState } from "react"
import { Button, Grid, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useDAOID } from "../DAO/router"
import { BalancesTable } from "./components/BalancesTable"
import { TransfersTable } from "./components/TransfersTable"
import { TransferWithBN, useTransfers } from "../../../../services/contracts/baseDAO/hooks/useTransfers"
import { useIsProposalButtonDisabled } from "../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { styled } from "@mui/material"
import { TabPanel } from "modules/explorer/components/TabPanel"
import { NFTs } from "../NFTs"
import TollIcon from "@mui/icons-material/Toll"
import PaletteIcon from "@mui/icons-material/Palette"
import ReceiptIcon from "@mui/icons-material/Receipt"
import { SmallButton } from "modules/common/SmallButton"
import { TreasuryDialog } from "./components/TreasuryDialog"
import { SearchInput } from "../DAOList/components/Searchbar"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import { FilterTransactionsDialog } from "modules/explorer/components/FiltersTransactionsDialog"
import { StatusOption } from "../../types"

const FiltersContainer = styled(Grid)({
  cursor: "pointer"
})

const ItemGrid = styled(Grid)({
  width: "inherit"
})

const TabsBox = styled(Grid)(({ theme }) => ({
  background: "#24282D",
  borderRadius: 8,
  padding: "40px 56px",
  minHeight: 300,
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    padding: "30px 36px"
  }
}))

const TabsContainer = styled(Grid)({
  borderRadius: 8,
  gap: 16
})

export interface TransactionsFilters {
  token: string | null
  sender: string | null
  receiver: string | null
  status: StatusOption | undefined
}

export interface TokensFilters {
  token: string | null
  balanceMin: string | undefined
  balanceMax: string | undefined
}

const StyledTab = styled(({ isSelected, ...other }: any) => <Button {...other} />)(
  ({ theme, isSelected }: { theme: Theme; isSelected: boolean }) => ({
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
  })
)

export const Treasury: React.FC = () => {
  const theme = useTheme()
  const isMobileSmall = useMediaQuery(theme.breakpoints.down("lg"))
  const daoId = useDAOID()
  const [openTransfer, setOpenTransfer] = useState(false)
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<TransactionsFilters>()
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)

  const { data: transfers } = useTransfers(daoId)

  const shouldDisable = useIsProposalButtonDisabled(daoId)

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue)
  }
  const onCloseTransfer = () => {
    setOpenTransfer(false)
  }

  const currentTransfers = useMemo(() => {
    const handleFilterData = (allTransfers: TransferWithBN[]) => {
      let data = allTransfers.slice()
      if (filters?.receiver && filters.receiver !== "") {
        data = allTransfers.filter(trx => trx.recipient === filters.receiver)
      }
      if (filters?.sender && filters.sender !== "") {
        data = allTransfers.filter(trx => trx.sender === filters.sender)
      }
      if (filters?.token && filters.token !== "") {
        data = allTransfers.filter(trx => trx.token?.symbol.toLocaleLowerCase() === filters.token?.toLocaleLowerCase())
      }
      if (filters?.status && filters.status.label !== "") {
        data = allTransfers.filter(trx => trx.status === filters.status?.label)
      }
      return data
    }

    if (transfers) {
      let allTransfers = transfers.slice()
      if (filters) {
        allTransfers = handleFilterData(allTransfers)
      }

      if (searchText) {
        return allTransfers.filter(
          formattedDao => formattedDao.name && formattedDao.name.toLowerCase().includes(searchText.toLowerCase())
        )
      }

      return allTransfers
    }

    return []
  }, [searchText, transfers, filters])

  const filterByName = (filter: string) => {
    setSearchText(filter.trim())
  }

  const handleFilters = (filters: TransactionsFilters) => {
    setFilters(filters)
  }

  const handleCloseFiltersModal = () => {
    setOpenFiltersDialog(false)
  }

  return (
    <>
      <Grid container direction="column" style={{ gap: 42 }}>
        <TabsBox item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            direction={isMobileSmall ? "column" : "row"}
            style={{ gap: 15, marginBottom: 32 }}
          >
            <Grid item>
              <TabsContainer container>
                <Grid item>
                  <StyledTab
                    startIcon={
                      <TollIcon style={{ color: "inherit" }} color={selectedTab === 0 ? "secondary" : "inherit"} />
                    }
                    variant="contained"
                    disableElevation={true}
                    onClick={() => handleChangeTab(0)}
                    isSelected={selectedTab === 0}
                  >
                    Tokens
                  </StyledTab>
                </Grid>
                <Grid item>
                  <StyledTab
                    startIcon={
                      <PaletteIcon style={{ color: "inherit" }} color={selectedTab === 1 ? "secondary" : "inherit"} />
                    }
                    disableElevation={true}
                    variant="contained"
                    onClick={() => handleChangeTab(1)}
                    isSelected={selectedTab === 1}
                  >
                    NFTs
                  </StyledTab>
                </Grid>
                <Grid item>
                  <StyledTab
                    startIcon={
                      <ReceiptIcon style={{ color: "inherit" }} color={selectedTab === 2 ? "secondary" : "inherit"} />
                    }
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
            <Grid item>
              {shouldDisable ? (
                <Tooltip placement="bottom" title="Not on proposal creation period">
                  <span>
                    <SmallButton variant="contained" color="secondary" disabled>
                      New Transfer
                    </SmallButton>
                  </span>
                </Tooltip>
              ) : (
                <SmallButton variant="contained" color="secondary" onClick={() => setOpenTransfer(true)}>
                  New Transfer
                </SmallButton>
              )}
            </Grid>
          </Grid>

          <ItemGrid item>
            <TabPanel value={selectedTab} index={0}>
              <BalancesTable />
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <NFTs />
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              <Grid container style={{ marginBottom: 32 }} direction="row" justifyContent="space-between">
                <FiltersContainer
                  onClick={() => setOpenFiltersDialog(true)}
                  xs={isMobileSmall ? 6 : 2}
                  item
                  container
                  direction="row"
                  alignItems="center"
                >
                  <FilterAltIcon style={{ color: theme.palette.secondary.main, marginRight: 6 }} fontSize="small" />
                  <Typography color="secondary">Filter & Sort</Typography>
                </FiltersContainer>
                <Grid item xs={isMobileSmall ? 6 : 4}>
                  <SearchInput search={filterByName} />
                </Grid>
              </Grid>
              <TransfersTable transfers={currentTransfers || []} />
            </TabPanel>
          </ItemGrid>
        </TabsBox>
      </Grid>
      <TreasuryDialog
        shouldDisable={shouldDisable}
        handleChangeTab={handleChangeTab}
        open={openTransfer}
        handleClose={onCloseTransfer}
      />
      <FilterTransactionsDialog
        currentFilters={filters}
        saveFilters={handleFilters}
        open={openFiltersDialog}
        handleClose={handleCloseFiltersModal}
      />
    </>
  )
}
