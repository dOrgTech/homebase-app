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

interface TableProps {
  rows: RowData[]
  tezosBalance: BigNumber
  openXTZTransferModal: () => void
  openTokenTransferModal: (tokenAddress: string) => void
  shouldDisable: boolean
  isMobileSmall: boolean
}

const BalancesList: React.FC<TableProps> = ({
  rows,
  openTokenTransferModal,
  openXTZTransferModal,
  shouldDisable,
  isMobileSmall
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const value = isMobileSmall ? 6 : 5
  const [list, setList] = useState(rows)

  useEffect(() => {
    setList(rows)
  }, [rows])

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
      {list && list.length > 0 ? (
        <>
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
                      onClick={() =>
                        row.symbol === "XTZ" ? openXTZTransferModal() : openTokenTransferModal(row.address)
                      }
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
              nextClassName="nextButton"
              previousClassName="nextButton"
            />
          </Grid>
        </>
      ) : (
        <Typography color="textPrimary">No items</Typography>
      )}
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

  const filterByName = (text: string) => {
    setSearchText(text.trim())
  }

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
      holdings = holdings.filter(
        holding => holding.token && holding.token.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    return holdings.map(createData)
  }, [tokenHoldings, searchText, filters, tezosBalance])

  return (
    <>
      <Grid item>
        <Grid container style={{ marginBottom: 32 }} direction="row" justifyContent="space-between">
          <FiltersContainer
            onClick={() => setOpenFiltersDialog(true)}
            xs={isSmall ? 6 : 2}
            item
            container
            direction="row"
            alignItems="center"
          >
            <FilterAltIcon style={{ color: theme.palette.secondary.main, marginRight: 6 }} fontSize="small" />
            <Typography color="secondary">Filter & Sort</Typography>
          </FiltersContainer>
          <Grid item xs={isSmall ? 6 : 4}>
            <SearchInput search={filterByName} />
          </Grid>
        </Grid>
        <BalancesList
          rows={rows}
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
