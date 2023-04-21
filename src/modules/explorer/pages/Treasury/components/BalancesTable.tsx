import React, { useMemo, useState } from "react"
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
  tezosBalance: BigNumber
  openXTZTransferModal: () => void
  openTokenTransferModal: (tokenAddress: string) => void
  shouldDisable: boolean
  isMobileSmall: boolean
}

const BalancesList: React.FC<TableProps> = ({
  rows,
  tezosBalance,
  openTokenTransferModal,
  openXTZTransferModal,
  shouldDisable,
  isMobileSmall
}) => {
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item xs={isMobileSmall ? 12 : 3}>
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
      </Grid>

      {rows.map((row, i) => (
        <Grid key={`token-` + i} item xs={isMobileSmall ? 12 : 3}>
          <TokenCard>
            <CustomCardContent>
              <TokenSymbol>{row.symbol}</TokenSymbol>
              <Grid container item direction="row" alignItems="center">
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

  const rows = useMemo(() => {
    if (!tokenHoldings) {
      return []
    }

    return tokenHoldings.map(createData)
  }, [tokenHoldings])

  return (
    <>
      <Grid item>
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
    </>
  )
}
