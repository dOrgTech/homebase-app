import React, { useCallback, useMemo } from "react"
import { Grid, styled, Typography, TextField, InputAdornment, Button } from "@material-ui/core"
import { useFreeze } from "services/contracts/baseDAO/hooks/useFreeze"
import BigNumber from "bignumber.js"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { useDAOID } from "../pages/DAO/router"
import { ProposalFormInput } from "./ProposalFormInput"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getUserTokenBalance } from "services/bakingBad/tokenBalances"
import { parseUnits, xtzToMutez } from "services/contracts/utils"

const CustomDialog = styled(ResponsiveDialog)({
  "& .MuiDialog-paperWidthSm": {
    minHeight: "400px !important"
  }
})

const CustomInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: theme.palette.secondary.main
  }
}))

const CustomLabelsContainer = styled(Grid)({
  marginBottom: 12
})

const CustomAmountLabel = styled(Typography)({
  fontWeight: 500
})

const CustomMaxLabel = styled(Typography)({
  fontSize: 16,
  paddingBottom: 5,
  textDecoration: "underline",
  textUnderlineOffset: 6,
  cursor: "pointer",
  marginLeft: 12
})

export const FreezeDialog: React.FC<{ freeze: boolean }> = ({ freeze }) => {
  const [open, setOpen] = React.useState(false)
  const [amount, setAmount] = React.useState<number | "">(0)
  const daoId = useDAOID()
  const { mutate } = useFreeze()
  const { data: dao, ledger } = useDAO(daoId)
  const { account } = useTezos()

  const [showMax, setShowMax] = React.useState<boolean>(false)
  const [maxDeposit, setMaxDeposit] = React.useState(0)
  const [maxWithdraw, setMaxWithdraw] = React.useState(0)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setAmount(0)
  }

  const onSubmit = useCallback(async () => {
    if (dao) {
      mutate({
        dao,
        amount: new BigNumber(amount),
        freeze
      })

      handleClose()
    }
  }, [amount, dao, mutate, freeze])

  useMemo(async () => {
    if (!ledger) {
      return setShowMax(false)
    } else {
      if (account && dao) {
        const availableBalance = await getUserTokenBalance(
          account.toString(),
          dao.data.network,
          dao.data.token.contract
        )
        setShowMax(true)
        if (availableBalance) {
          const formattedBalance = parseUnits(new BigNumber(availableBalance), dao.data.token.decimals)
            .dp(10, 1)
            .toNumber()
          setMaxDeposit(formattedBalance)
        }

        const userLedger = ledger.find(l => l.holder.address.toLowerCase() === account.toLowerCase())
        if (userLedger) {
          if (userLedger.available_balance) {
            setMaxWithdraw(userLedger.available_balance.dp(10, 1).toNumber())
          }
        }
      }
    }
  }, [ledger, account, dao])

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained" color="secondary">
        {freeze ? "Deposit" : "Withdraw"}
      </Button>
      <CustomDialog open={open} onClose={handleClose} title={freeze ? "DEPOSIT" : "WITHDRAW"}>
        <Grid container direction={"column"} style={{ gap: 36 }}>
          <Grid item>
            <Typography variant="body2" color="textPrimary">
              Confirm the {freeze ? "deposit" : "withdrawal"} of your tokens
            </Typography>
          </Grid>
          <Grid item>
            <CustomLabelsContainer item container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item xs={3}>
                <CustomAmountLabel>Amount</CustomAmountLabel>
              </Grid>
              <Grid item container direction="row" xs={9} justifyContent="flex-end">
                {showMax && freeze ? (
                  <>
                    <Typography>
                      {maxDeposit} {dao?.data.token.symbol}
                    </Typography>
                    <CustomMaxLabel color="secondary" onClick={() => setAmount(maxDeposit)}>
                      Use Max
                    </CustomMaxLabel>
                  </>
                ) : null}
                {showMax && !freeze ? (
                  <>
                    <Typography>
                      {maxWithdraw} {dao?.data.token.symbol}
                    </Typography>
                    <CustomMaxLabel color="secondary" onClick={() => setAmount(maxWithdraw)}>
                      Use Max
                    </CustomMaxLabel>
                  </>
                ) : null}
              </Grid>
            </CustomLabelsContainer>
            <ProposalFormInput>
              <CustomInput
                value={amount}
                type="number"
                placeholder="0"
                onChange={(newValue: any) => setAmount(newValue.target.value)}
                onClick={(newValue: any) => {
                  if (amount === 0) {
                    setAmount("")
                  }
                  return
                }}
                inputProps={{ min: 0 }}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography color="secondary">{dao?.data.token.symbol}</Typography>
                    </InputAdornment>
                  )
                }}
              />
            </ProposalFormInput>
          </Grid>
          <Grid item container direction="row" alignItems="center" justifyContent="center">
            <Button variant="contained" color={"secondary"} disabled={!amount} onClick={onSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </CustomDialog>
    </div>
  )
}
