import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, Grid, styled, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { ProposalFormContainer, ProposalFormDefaultValues } from "modules/explorer/components/ProposalForm"
import { DAOHolding } from "services/bakingBad/tokenBalances"
import { useDAOHoldings } from "services/contracts/baseDAO/hooks/useDAOHoldings"
import { useTezosBalance } from "services/contracts/baseDAO/hooks/useTezosBalance"
import { useDAOID } from "../../DAO/router"
import BigNumber from "bignumber.js"
import { useIsProposalButtonDisabled } from "../../../../../services/contracts/baseDAO/hooks/useCycleInfo"
import { SmallButton } from "../../../../common/SmallButton"
import { toShortAddress } from "services/contracts/utils"
import { CopyButton } from "modules/common/CopyButton"
import ReactPaginate from "react-paginate"
import "../../DAOList/styles.css"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import CloseIcon from "@mui/icons-material/Close"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"

import { SearchInput } from "../../DAOList/components/Searchbar"
import { TokensFilters } from ".."
import { FilterTokenDialog } from "modules/explorer/components/FiltersTokensDialog"

const FiltersContainer = styled(Grid)({
  cursor: "pointer"
})

const TokenSymbol = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  boxSizing: "border-box",
  width: "min-content",
  fontSize: 24
}))

const MobileTableHeader = styled(Grid)({
  width: "100%",
  padding: 20,
  borderBottom: "0.3px solid #3D3D3D"
})

const MobileTableRow = styled(Grid)({
  padding: "30px",
  borderBottom: "0.3px solid #3D3D3D"
})

interface RowData {
  symbol: string
  address: string
  amount: string
}

const AddressText = styled(Typography)({
  marginTop: 8
})

const TokenCard = styled(Card)(({ theme }) => ({
  height: 200,
  background: theme.palette.primary.main,
  borderRadius: 8,
  padding: "32px 36px"
}))

const CustomCardContent = styled(CardContent)({
  padding: 0
})

const BalanceText = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 300,
  marginBottom: 16,
  [theme.breakpoints.down("sm")]: {
    fontSize: "24px !important"
  }
}))

const BalanceTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px !important"
  }
}))

const createData = (daoHolding: DAOHolding): RowData => {
  return {
    symbol: daoHolding.token.symbol,
    address: daoHolding.token.contract,
    amount: daoHolding.balance.dp(10, 1).toString()
  }
}

const titles = ["Token Balances", "Address", "Balance"] as const

const titleDataMatcher = (title: (typeof titles)[number], rowData: RowData) => {
  switch (title) {
    case "Token Balances":
      return rowData.symbol
    case "Address":
      return rowData.address
    case "Balance":
      return rowData.amount
  }
}

interface TableProps {
  rows: RowData[]
  searchText?: string
  tezosBalance: BigNumber
  openXTZTransferModal: () => void
  openTokenTransferModal: (tokenAddress: string) => void
  shouldDisable: boolean
  isMobileSmall: boolean
}

const BalancesList: React.FC<TableProps> = ({
  rows,
  searchText,
  tezosBalance,
  openTokenTransferModal,
  openXTZTransferModal,
  shouldDisable,
  isMobileSmall
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const value = 6
  const [list, setList] = useState(rows)

  useEffect(() => {
    setList(rows)
  }, [rows])

  useEffect(() => {
    if (searchText && searchText.length > 0) {
      setOffset(0)
      setCurrentPage(0)
    }
  }, [searchText])

  // useEffect(() => {
  //   if (list) {
  //     const val = list.findIndex(row => row.symbol === "XTZ")
  //     if (val === -1) {
  //       const xtz: RowData = {
  //         symbol: "XTZ",
  //         address: "",
  //         amount: tezosBalance.toString()
  //       }
  //       const updatedList = rows.slice()
  //       updatedList.unshift(xtz)
  //       setList(updatedList)
  //     }
  //   }
  // }, [tezosBalance, list, rows])
  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    if (rows) {
      const newOffset = (event.selected * value) % rows.length
      setOffset(newOffset)
      setCurrentPage(event.selected)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const pageCount = Math.ceil(rows ? rows.length / value : 0)
  return (
    <Grid container direction="row" spacing={2}>
      {/* <Grid item xs={isMobileSmall ? 12 : 4}>
        <TokenCard>
          <CustomCardContent>
            <TokenSymbol>XTZ</TokenSymbol>

            <BalanceTitle variant="body1" color="secondary" style={{ marginTop: 49 }}>
              Balance
            </BalanceTitle>
            <BalanceText>{tezosBalance.toString()}</BalanceText>
            <Grid container item direction="row" alignItems="center" justifyContent="center">
              <SmallButton
                variant="contained"
                color="secondary"
                onClick={() => openXTZTransferModal()}
                disabled={shouldDisable}
              >
                Transfer
              </SmallButton>
            </Grid>
          </CustomCardContent>
        </TokenCard>
      </Grid> */}

      {list.slice(offset, offset + value).map((row, i) => (
        <Grid key={`token-` + i} item xs={isMobileSmall ? 12 : 4}>
          <TokenCard>
            <CustomCardContent>
              <TokenSymbol>{row.symbol}</TokenSymbol>
              <Grid
                container
                item
                direction="row"
                alignItems="center"
                style={row.symbol === "XTZ" ? { visibility: "hidden" } : {}}
              >
                <AddressText variant="subtitle2">{toShortAddress(row.address)}</AddressText>
                <CopyButton text={row.address} style={{ height: 15 }}></CopyButton>
              </Grid>
              <BalanceTitle color="secondary" style={{ marginTop: 16 }}>
                Balance
              </BalanceTitle>
              <BalanceText>{row.amount}</BalanceText>
              <Grid container item direction="row" alignItems="center" justifyContent="center">
                <SmallButton
                  variant="contained"
                  color="secondary"
                  onClick={() => openTokenTransferModal(row.address)}
                  disabled={shouldDisable}
                >
                  Transfer
                </SmallButton>
              </Grid>
            </CustomCardContent>
          </TokenCard>
        </Grid>
      ))}
      <Grid container direction="row" justifyContent="flex-end">
        <ReactPaginate
          previousLabel={<NavigateBeforeIcon />}
          breakLabel="..."
          nextLabel={<NavigateNextIcon />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage}
          nextClassName="nextButton"
          previousClassName="nextButton"
        />
      </Grid>
    </Grid>
  )
}

export const BalancesTable: React.FC = () => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const daoId = useDAOID()
  const shouldDisable = useIsProposalButtonDisabled(daoId)
  const { tokenHoldings } = useDAOHoldings(daoId)
  const { data: tezosBalance } = useTezosBalance(daoId)
  const [openTransfer, setOpenTransfer] = useState(false)
  const [defaultValues, setDefaultValues] = useState<ProposalFormDefaultValues>()
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState<TokensFilters>()
  const filtersEnabled = Object.values(filters || {}).some(value => !!value)

  const onCloseTransfer = () => {
    setOpenTransfer(false)
    setDefaultValues(undefined)
  }

  const onOpenXTZTransferModal = () => {
    setDefaultValues({
      transferForm: {
        isBatch: false,
        transfers: [
          {
            recipient: "",
            amount: 1,
            asset: {
              symbol: "XTZ"
            }
          }
        ]
      }
    })

    setOpenTransfer(true)
  }

  const onOpenTokenTransferModal = (tokenAddress: string) => {
    const selectedToken = tokenHoldings.find(
      holding => holding.token.contract.toLowerCase() === tokenAddress.toLowerCase()
    ) as DAOHolding

    setDefaultValues({
      transferForm: {
        transfers: [
          {
            recipient: "",
            amount: 1,
            asset: selectedToken.token
          }
        ]
      }
    })

    setOpenTransfer(true)
  }

  const handleFilters = (filters: TokensFilters) => {
    setFilters(filters)
  }

  const handleCloseFiltersModal = () => {
    setOpenFiltersDialog(false)
  }

  const rows = useMemo(() => {
    const handleFilterData = (holdings: DAOHolding[]) => {
      let data = holdings.slice()
      if (filters?.token && filters.token !== "") {
        data = holdings.filter(trx => trx.token?.symbol.toLowerCase() === filters.token?.toLocaleLowerCase())
      }
      if (filters?.balanceMin && filters.balanceMin !== "") {
        data = holdings.filter(trx => trx.balance.isGreaterThanOrEqualTo(filters.balanceMin!))
      }
      if (filters?.balanceMax && filters.balanceMax !== "") {
        data = holdings.filter(trx => trx.balance.isLessThanOrEqualTo(filters.balanceMax!))
      }
      return data
    }

    if (!tokenHoldings) {
      return []
    }
    let holdings = tokenHoldings.slice()
    const xtz: DAOHolding = {
      token: {
        symbol: "XTZ",
        id: "XTZ",
        contract: "",
        token_id: 0,
        name: "",
        decimals: 6,
        network: "mainnet",
        supply: tezosBalance || new BigNumber(0),
        standard: ""
      },
      balance: tezosBalance || new BigNumber(0)
    }
    holdings.unshift(xtz)

    if (filters) {
      holdings = handleFilterData(holdings)
    }

    if (searchText) {
      console.log({ holdings })
      holdings = holdings.filter(holding => {
        const query = searchText.toLowerCase()
        if (holding.token?.name.toLowerCase().includes(query)) return true
        if (holding.token?.id.toLowerCase().includes(query)) return true
        if (holding.token?.symbol.toLowerCase().includes(query)) return true
        return false
      })
    }

    return holdings.map(createData)
  }, [tokenHoldings, searchText, filters, tezosBalance])

  return (
    <>
      <Grid item>
        <Grid container style={{ marginBottom: 32 }} direction="row" justifyContent="space-between">
          <FiltersContainer
            onClick={() => setOpenFiltersDialog(true)}
            xs={isSmall ? 12 : 2}
            item
            container
            direction="row"
            alignItems="center"
          >
            <FilterAltIcon style={{ color: theme.palette.secondary.main, marginRight: 6 }} fontSize="small" />
            <Typography color="secondary">Filter & Sort</Typography>
          </FiltersContainer>
          {filtersEnabled && (
            <FiltersContainer
              onClick={() => setFilters({ token: "", balanceMax: "", balanceMin: "" })}
              xs={isSmall ? 12 : 2}
              item
              container
              direction="row"
              alignItems="center"
            >
              <CloseIcon style={{ color: theme.palette.secondary.main, marginRight: 6 }} fontSize="small" />
              <Typography color="secondary">Clear Filters</Typography>
            </FiltersContainer>
          )}
          <Grid item xs={4}>
            <SearchInput
              search={(text: string) => {
                setSearchText(text.trim())
              }}
            />
          </Grid>
        </Grid>
        <BalancesList
          rows={rows}
          searchText={searchText}
          tezosBalance={tezosBalance || new BigNumber(0)}
          openTokenTransferModal={onOpenTokenTransferModal}
          openXTZTransferModal={onOpenXTZTransferModal}
          shouldDisable={shouldDisable}
          isMobileSmall={isSmall}
        />
      </Grid>

      <ProposalFormContainer
        open={openTransfer}
        handleClose={onCloseTransfer}
        defaultValues={defaultValues}
        defaultTab={0}
      />
      <FilterTokenDialog
        currentFilters={filters}
        saveFilters={handleFilters}
        open={openFiltersDialog}
        handleClose={handleCloseFiltersModal}
      />
    </>
  )
}
