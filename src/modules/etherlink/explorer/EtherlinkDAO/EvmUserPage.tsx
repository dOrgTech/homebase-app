import React, { useContext, useEffect, useMemo, useState } from "react"
import { ethers } from "ethers"
import { Box, Grid, styled, Typography } from "components/ui"
import { Button } from "components/ui/Button"
import { HowToVote, People } from "@material-ui/icons"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { StyledTextField } from "components/ui/StyledTextField"
import { useHistory } from "react-router-dom"
import { EvmDaoProposalList } from "modules/etherlink/components/EvmDaoProposalList"
import { TokenBridge } from "modules/etherlink/bridge/TokenBridge"

const StatsContainer = styled(Grid)({
  marginBottom: "40px",
  display: "flex",
  gap: "20px"
})

const StatBox = styled(Box)({
  padding: "20px",
  background: "#1c2024",
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

const DelegationBox = styled(Box)(() => ({
  background: "#1c2024",
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

const ENABLE_DELEGATION = false

export const EvmUserPage = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [delegateToAddress, setDelegateToAddress] = useState("")
  const [delegateDialogOpen, setDelegateDialogOpen] = useState(false)
  const [isValidDelegateAddress, setIsValidDelegateAddress] = useState(false)

  const { daoMembers, daoSelected, daoProposals } = useContext(EtherlinkContext)

  const { daoDelegate, signer, userTokenBalance, userVotingWeight, proposalCreatedCount, proposalVotedCount } =
    useEvmDaoOps()
  const selfMember = daoMembers?.find((member: any) => member.address === signer?.address)
  console.log("selfMember", selfMember)
  console.log("daoSelected[EvmUserPage]", daoSelected)
  const userAddress = signer?.address
  const votingWeight = userVotingWeight
  const personalBalance = userTokenBalance
  const userDelegate = selfMember?.delegate
  const isSelfDelegated = userDelegate === signer?.address
  // const isDelegatedToOther = userDelegate?.length > 0 && userDelegate !== signer?.address

  const proposalByAuthor = useMemo(() => {
    return daoProposals?.filter((proposal: any) => proposal.author === userAddress)
  }, [daoProposals, userAddress])

  useEffect(() => {
    if (ethers.isAddress(delegateToAddress)) {
      setIsValidDelegateAddress(true)
    } else {
      setIsValidDelegateAddress(false)
    }
  }, [delegateToAddress, setIsValidDelegateAddress])

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
        <StatBox
          style={{ cursor: "pointer" }}
          onClick={() =>
            history.push("/explorer/etherlink/dao/" + daoSelected?.id + "/proposals?author=" + userAddress)
          }
        >
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
            <Button
              variant="outlined"
              style={{ width: "fit-content" }}
              onClick={() => setDelegateDialogOpen(true)}
              disabled={!ENABLE_DELEGATION}
            >
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

            {isSelfDelegated ? (
              <Typography style={{ color: "#9E9E9E" }}>Only voting on your behalf</Typography>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  daoDelegate(userAddress).finally(() => {
                    setIsLoading(false)
                  })
                }}
                style={{ width: "fit-content" }}
              >
                Claim Voting Power
              </Button>
            )}
          </DelegationBox>

          <ResponsiveDialog
            open={delegateDialogOpen}
            onClose={() => {
              setDelegateDialogOpen(false)
            }}
            title="Delegate Voting Power"
          >
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography>Delegate your voting power to another member of the DAO.</Typography>
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Delegate to"
                  onChange={e => setDelegateToAddress(e.target.value)}
                  value={delegateToAddress}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  style={{ width: "fit-content" }}
                  disabled={!isValidDelegateAddress || isLoading}
                  onClick={() => {
                    setIsLoading(true)
                    daoDelegate(delegateToAddress)
                      .then(() => {
                        setDelegateDialogOpen(false)
                      })
                      .finally(() => {
                        setIsLoading(false)
                      })
                  }}
                >
                  {isLoading ? "Delegating..." : "Delegate"}
                </Button>
              </Grid>
            </Grid>
          </ResponsiveDialog>
        </Grid>

        <Grid item xs={12}>
          <TokenBridge />
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography variant="h5" style={{ color: "#fff" }}>
            Proposals Created
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <EvmDaoProposalList proposals={proposalByAuthor} />
        </Grid>
      </Grid>
    </Box>
  )
}
