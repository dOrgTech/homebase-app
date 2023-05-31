import React, { useCallback, useEffect, useMemo } from "react"
import { Grid, Typography, TextField, Button, useTheme, styled } from "@material-ui/core"
import { useParams } from "react-router-dom"
import { useVote } from "services/contracts/baseDAO/hooks/useVote"
import BigNumber from "bignumber.js"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useDAOID } from "../pages/DAO/router"
import { ResponsiveDialog } from "./ResponsiveDialog"
import { useAgoraTopic } from "../../../services/agora/hooks/useTopic"
import { useProposal } from "../../../services/services/dao/hooks/useProposal"
import { parseUnits, toShortAddress } from "../../../services/contracts/utils"
import { ProposalFormInput } from "./ProposalFormInput"
import { getUserTokenBalance } from "services/bakingBad/tokenBalances"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useTezosBalance } from "services/contracts/baseDAO/hooks/useTezosBalance"

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

const ErrorText = styled(Typography)({
  fontSize: 13,
  marginTop: 8,
  color: "red"
})

export const VoteDialog: React.FC<{
  support: boolean
  open: boolean
  onClose: () => void
}> = ({ support, onClose, open }) => {
  const [amount, setAmount] = React.useState<string>("0")
  const { proposalId } = useParams<{
    proposalId: string
  }>()
  const daoId = useDAOID()
  const { data: dao, ledger } = useDAO(daoId)
  const { data: proposal } = useProposal(daoId, proposalId)
  const { data: agoraPost } = useAgoraTopic(Number(proposal?.metadata.agoraPostId))

  const { mutate } = useVote()
  const theme = useTheme()
  const { data: tezosBalance } = useTezosBalance(daoId)
  const [max, setMax] = React.useState(0)
  const [error, setError] = React.useState(false)

  const validate = useCallback(() => {
    if (Number(amount) > max) {
      setError(true)
      return true
    }
    setError(false)
    return false
  }, [amount, max, setError])

  const onSubmit = useCallback(async () => {
    if (!validate()) {
      if (dao) {
        mutate({
          proposalKey: proposalId,
          dao,
          amount: new BigNumber(amount),
          support
        })

        onClose()
      }
    }
  }, [amount, dao, mutate, onClose, proposalId, support, validate])

  const { account } = useTezos()

  useMemo(() => {
    const found = ledger?.find(l => l.holder.address.toLowerCase() === account.toLowerCase())

    const value = found || {
      available_balance: new BigNumber(0)
    }

    setMax(value.available_balance.toNumber())
    return value
  }, [account, ledger])

  useEffect(() => {
    if (!open) {
      setAmount("0")
      setError(false)
    }
  }, [open])

  return (
    <>
      <ResponsiveDialog
        open={open}
        onClose={onClose}
        title={support ? "Support" : "Oppose"}
        customTitleColor={support ? theme.palette.secondary.main : "#FF5555"}
      >
        <Grid container direction={"column"} style={{ gap: 36 }}>
          <Grid item>
            <Typography variant="body2" color="textPrimary">
              Confirm your vote to {support ? "support" : "oppose"} Proposal #{toShortAddress(proposalId)}
            </Typography>
          </Grid>

          {agoraPost && (
            <Grid item>
              <Typography color="textPrimary" variant="body2">
                {agoraPost.title}
              </Typography>
            </Grid>
          )}

          <Grid item container direction="row">
            <Grid item xs>
              <CustomLabelsContainer item container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item xs={3}>
                  <CustomAmountLabel>Amount</CustomAmountLabel>
                </Grid>
                <Grid item container direction="row" xs={9} justifyContent="flex-end">
                  <Typography>
                    {max} {dao?.data.token.symbol}
                  </Typography>
                  <CustomMaxLabel color="secondary" onClick={() => setAmount(String(max))}>
                    Use Max
                  </CustomMaxLabel>
                </Grid>
              </CustomLabelsContainer>

              <ProposalFormInput>
                <TextField
                  type="number"
                  value={amount}
                  placeholder="Type an Amount"
                  inputProps={{ min: 0, max: max }}
                  InputProps={{ disableUnderline: true }}
                  onChange={newValue => {
                    setError(false)
                    setAmount(newValue.target.value)
                  }}
                  onKeyPress={e => {
                    e.key === "-" ? e.preventDefault() : null
                  }}
                />
              </ProposalFormInput>
              {error ? <ErrorText>Amount cannot be greater than max available</ErrorText> : null}
            </Grid>
          </Grid>

          <Grid item container direction="row" alignItems="center" justifyContent="center">
            <Button variant="contained" color={"secondary"} disabled={!amount || error} onClick={onSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </ResponsiveDialog>
    </>
  )
}
