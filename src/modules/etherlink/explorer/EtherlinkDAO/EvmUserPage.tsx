import React, { useContext } from "react"
import { Box, Grid, styled, Typography } from "@material-ui/core"
import { Button } from "components/ui/Button"
import { HowToVote, People } from "@material-ui/icons"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"

const StatsContainer = styled(Grid)({
  marginBottom: "40px",
  display: "flex",
  gap: "20px"
})

const StatBox = styled(Box)({
  padding: "20px",
  background: "#2F3438",
  borderRadius: "8px",
  flex: 1,
  minWidth: 0
})

const StatLabel = styled(Typography)({
  color: "#9E9E9E",
  fontSize: "14px",
  marginBottom: "8px"
})

const StatValue = styled(Typography)({
  color: "#fff",
  fontSize: "24px",
  fontWeight: 500
})

const DelegationBox = styled(Box)(({ theme }) => ({
  background: "#2F3438",
  borderRadius: "8px",
  padding: "32px",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "16px"
}))

const AddressDisplay = styled(Typography)({
  color: "#fff",
  fontSize: "14px",
  fontFamily: "monospace",
  marginBottom: "20px"
})

const DelegationTitle = styled(Typography)({
  fontSize: "24px",
  color: "#fff",
  marginBottom: "16px"
})

const DelegationDescription = styled(Typography)({
  color: "#9E9E9E",
  fontSize: "16px",
  marginBottom: "24px"
})

export const EvmUserPage = () => {
  const { daoSelected } = useContext(EtherlinkContext)
  const { daoDelegate, signer, userTokenBalance, userVotingWeight, proposalCreatedCount, proposalVotedCount } =
    useEvmDaoOps()
  const userAddress = signer?.address
  const votingWeight = userVotingWeight
  const personalBalance = userTokenBalance

  return (
    <Box>
      <AddressDisplay>{userAddress}</AddressDisplay>

      <StatsContainer container>
        <StatBox>
          <StatLabel>Voting Weight</StatLabel>
          <StatValue>{votingWeight}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>Personal {daoSelected?.symbol} Balance</StatLabel>
          <StatValue>{personalBalance}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>Proposals Created</StatLabel>
          <StatValue>{proposalCreatedCount}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>Votes Cast</StatLabel>
          <StatValue>{proposalVotedCount}</StatValue>
        </StatBox>
      </StatsContainer>

      <Typography variant="h5" style={{ marginBottom: "24px", color: "#fff" }}>
        Delegation settings
      </Typography>
      <Typography style={{ marginBottom: "16px", color: "#9E9E9E" }}>
        You can either delegate your vote or accept delegations, but not both at the same time.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DelegationBox>
            <People style={{ fontSize: 48, color: "#fff", marginBottom: "16px" }} />
            <DelegationTitle>DELEGATE YOUR VOTE</DelegationTitle>
            <DelegationDescription>
              If you can't or don't want to take part in the governance process, your voting privilege may be forwarded
              to another member of your choosing.
            </DelegationDescription>
            <Button variant="outlined" style={{ width: "fit-content" }}>
              Set Delegate
            </Button>
          </DelegationBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <DelegationBox>
            <HowToVote style={{ fontSize: 48, color: "#fff", marginBottom: "16px" }} />
            <DelegationTitle>VOTE DIRECTLY</DelegationTitle>
            <DelegationDescription>
              This also allows other members to delegate their vote to you, so that you may participate in the
              governance process on their behalf.
            </DelegationDescription>
            <Typography style={{ color: "#9E9E9E" }}>Only voting on your behalf</Typography>
          </DelegationBox>
        </Grid>
      </Grid>
    </Box>
  )
}
