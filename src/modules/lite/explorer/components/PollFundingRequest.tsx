import React, { useMemo, useState } from "react"
import { Grid, styled, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { Link as RouterLink } from "react-router-dom"
import { Poll } from "models/Polls"
import { Community } from "models/Community"
import { SmallButton } from "modules/common/SmallButton"
import { useNotification } from "modules/common/hooks/useNotification"
import { ProposalFormContainer } from "modules/explorer/components/ProposalForm"
import { DAOProvider } from "modules/explorer/pages/DAO/router"
import { Network } from "services/beacon"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getSignature } from "services/lite/utils"
import { useIsProposalButtonDisabled } from "services/contracts/baseDAO/hooks/useCycleInfo"
import { getEthSignature } from "services/utils/utils"
import { linkPollToOnchainProposal } from "services/services/lite/lite-services"
import { useDAOTreasuryBalance } from "../hooks/useDAOTreasuryBalance"
import { useNewestOwnProposalKey } from "../hooks/useNewestOwnProposalKey"

const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.secondary.light,
  borderRadius: 8
}))

const CardContent = styled(Grid)(({ theme }) => ({
  padding: "40px 48px 42px 48px",
  gap: 20,
  [theme.breakpoints.down("lg")]: {
    padding: "18px 25px"
  }
}))

const TitleText = styled(Typography)({
  fontSize: 24,
  fontWeight: 600
})

const RowLabel = styled(Typography)({
  fontSize: 18,
  fontWeight: 600
})

const RowValue = styled(Typography)({
  fontSize: 18,
  fontWeight: 300,
  wordBreak: "break-all"
})

const WarningText = styled(Typography)({
  fontSize: 16,
  fontWeight: 300,
  color: "#ED254E"
})

const HintText = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 300,
  marginTop: 8,
  color: theme.palette.primary.light
}))

const ProposalLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: 18,
  fontWeight: 300
}))

interface Props {
  poll: Poll
  community: Community | undefined
  onLinked: () => void
}

/**
 * Renders a poll's optional funding request and offers to promote it to an
 * on-chain transfer proposal on the community's linked baseDAO.
 */
export const PollFundingRequest: React.FC<Props> = ({ poll, community, onLinked }) => {
  const { network, account, wallet, etherlink } = useTezos()
  const openNotification = useNotification()
  const daoContract = community?.daoContract
  const { data: treasuryBalance } = useDAOTreasuryBalance(daoContract, (community?.network || network) as Network)

  const [isProposalFormOpen, setProposalFormOpen] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const { startWatching, isWatching } = useNewestOwnProposalKey(daoContract)
  // Same gate the explorer's own transfer entry points use: proposals can only
  // be created during the proposing phase.
  const isOutsideProposingPeriod = useIsProposalButtonDisabled(daoContract || "")

  const fundingRequest = poll.fundingRequest

  const requestedAmount = useMemo(() => {
    if (!fundingRequest?.amount) {
      return undefined
    }
    const amount = new BigNumber(fundingRequest.amount)
    return amount.isFinite() ? amount : undefined
  }, [fundingRequest])

  const exceedsBalance = Boolean(requestedAmount && treasuryBalance && requestedAmount.gt(treasuryBalance))

  // No outcome gate on purpose: an off-chain poll carries no authority, so the
  // app only offers the shortcut and leaves the decision to the proposer.
  const canPropose = Boolean(daoContract && (wallet || etherlink.isConnected) && !poll.onchainProposal)

  const linkProposal = async (proposalKey: string) => {
    if (!daoContract || !poll._id) {
      return
    }

    const payload = {
      daoAddress: daoContract,
      proposalKey,
      network: community?.network || network,
      pollID: poll._id
    }

    try {
      setIsLinking(true)

      let signature: string | undefined
      let payloadBytes: string
      let publicKey: string | undefined

      if (wallet) {
        const signed = await getSignature(account, wallet, JSON.stringify(payload))
        signature = signed.signature
        payloadBytes = signed.payloadBytes
        publicKey = (await wallet?.client.getActiveAccount())?.publicKey
      } else {
        publicKey = etherlink.account.address
        const signed = await getEthSignature(publicKey, JSON.stringify(payload))
        signature = signed.signature
        payloadBytes = signed.payloadBytes
      }

      if (!signature) {
        openNotification({
          message: `Issue with Signature`,
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }

      const resp = await linkPollToOnchainProposal(poll._id, signature, publicKey, payloadBytes, network)

      if (!resp.ok) {
        const respData = await resp.json().catch(() => ({}))
        openNotification({
          message: respData?.message || "Could not link the on-chain proposal",
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }

      openNotification({
        message: "On-chain proposal linked to this poll",
        autoHideDuration: 5000,
        variant: "success"
      })
      onLinked()
    } catch (error) {
      console.log("error: ", error)
      openNotification({
        message: "Could not link the on-chain proposal",
        autoHideDuration: 3000,
        variant: "error"
      })
    } finally {
      setIsLinking(false)
    }
  }

  // The proposal form fires and forgets, so watch the indexer for the proposal
  // this account just created and link it once its key shows up.
  const onProposalSubmitted = () => {
    startWatching(linkProposal)
  }

  if (!fundingRequest) {
    return null
  }

  const proposalFormDefaultValues = {
    transferForm: {
      transfers: [
        {
          recipient: fundingRequest.recipient,
          amount: Number(fundingRequest.amount),
          asset: { symbol: "XTZ" as const }
        }
      ],
      isBatch: false
    }
  }

  return (
    <Container container>
      <CardContent container direction="column">
        <Grid item>
          <TitleText color="textPrimary">Funding request</TitleText>
        </Grid>
        <Grid item container direction="row" style={{ gap: 10 }}>
          <RowLabel color="textPrimary">Recipient:</RowLabel>
          <RowValue color="textPrimary">{fundingRequest.recipient}</RowValue>
        </Grid>
        <Grid item container direction="row" style={{ gap: 10 }}>
          <RowLabel color="textPrimary">Amount:</RowLabel>
          <RowValue color="textPrimary">{fundingRequest.amount} XTZ</RowValue>
        </Grid>
        {treasuryBalance ? (
          <Grid item container direction="row" style={{ gap: 10 }}>
            <RowLabel color="textPrimary">DAO treasury balance:</RowLabel>
            <RowValue color="textPrimary">{treasuryBalance.dp(6, BigNumber.ROUND_DOWN).toString()} XTZ</RowValue>
          </Grid>
        ) : null}
        {exceedsBalance ? (
          <Grid item>
            <WarningText>Requested amount exceeds the DAO treasury balance</WarningText>
          </Grid>
        ) : null}

        {poll.onchainProposal ? (
          <Grid item>
            <ProposalLink
              to={`/explorer/dao/${poll.onchainProposal.daoAddress}/proposal/${poll.onchainProposal.proposalKey}`}
            >
              On-chain proposal
            </ProposalLink>
          </Grid>
        ) : canPropose ? (
          <Grid item>
            <SmallButton
              variant="contained"
              color="secondary"
              disabled={isLinking || isWatching || isOutsideProposingPeriod}
              onClick={() => setProposalFormOpen(true)}
            >
              {isLinking || isWatching ? "Linking proposal..." : "Create on-chain transfer proposal"}
            </SmallButton>
            {isOutsideProposingPeriod ? <HintText>Not on proposal creation period</HintText> : null}
          </Grid>
        ) : null}
      </CardContent>

      {daoContract ? (
        <DAOProvider daoId={daoContract}>
          <ProposalFormContainer
            open={isProposalFormOpen}
            handleClose={() => setProposalFormOpen(false)}
            defaultValues={proposalFormDefaultValues}
            defaultTab={0}
            onSubmitted={onProposalSubmitted}
          />
        </DAOProvider>
      ) : null}
    </Container>
  )
}
