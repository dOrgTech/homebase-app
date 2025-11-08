import React, { useContext, useEffect, useMemo, useState } from "react"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import { Box, Grid, Typography, styled } from "components/ui"
import { Button } from "components/ui/Button"
import { HowToVote, People } from "@material-ui/icons"
import { EtherlinkContext } from "services/wagmi/context"
import { useEvmDaoOps } from "services/contracts/etherlinkDAO/hooks/useEvmDaoOps"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { formatNumber } from "modules/explorer/utils/FormatNumber"
import { FormField, FormTextField } from "components/ui"
import { useHistory } from "react-router-dom"
import { EvmDaoProposalList } from "modules/etherlink/components/EvmDaoProposalList"
import { TokenBridge } from "modules/etherlink/bridge/TokenBridge"
import { StatsContainer, Item, ItemContent, ItemTitle, ItemValue } from "components/ui/etherlink/Stats"
import { DelegationBox, AddressDisplay, DelegationTitle, DelegationDescription } from "components/ui/etherlink/styled"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"

const UserProfileCard = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 8,
  padding: "32px",
  marginBottom: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "32px"
}))

const UserInfoSection = styled(Grid)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "16px"
})

const UserAddress = styled(Typography)({
  color: "#fff",
  fontSize: "14px",
  fontFamily: "monospace",
  wordBreak: "break-all"
})

const StatsGrid = styled(Grid)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr"
  }
}))

// Enable on-chain delegation UI for Etherlink ERC20Votes tokens
const ENABLE_DELEGATION = true

export const EvmUserPage = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [delegateToAddress, setDelegateToAddress] = useState("")
  const [delegateDialogOpen, setDelegateDialogOpen] = useState(false)
  const [isValidDelegateAddress, setIsValidDelegateAddress] = useState(false)

  const { daoMembers, daoSelected, daoProposals } = useContext(EtherlinkContext)

  const {
    daoDelegate,
    signer,
    userTokenBalance,
    userVotingWeight,
    userDelegateAddress,
    proposalCreatedCount,
    proposalVotedCount,
    refreshTokenStats
  } = useEvmDaoOps()
  const selfMember = daoMembers?.find((member: any) => member.address === signer?.address)
  console.log("selfMember", selfMember)
  console.log("daoSelected[EvmUserPage]", daoSelected)
  const userAddress = signer?.address
  const votingWeight = userVotingWeight
  const personalBalance = userTokenBalance
  const formattedVotingWeight = useMemo(() => String(formatNumber(new BigNumber(votingWeight ?? 0))), [votingWeight])
  const formattedPersonalBalance = useMemo(
    () => String(formatNumber(new BigNumber(personalBalance ?? 0))),
    [personalBalance]
  )
  const userAddrLc = (signer?.address || "").toLowerCase()
  const zeroAddress = "0x0000000000000000000000000000000000000000"
  // Determine delegation state strictly from on-chain assigned delegate
  const delegateLc = (userDelegateAddress || "").toLowerCase()
  const isNotDelegatingNotClaimed = delegateLc === zeroAddress && !!userDelegateAddress
  const isNotDelegatingClaimed = !!userAddrLc && delegateLc === userAddrLc
  const isDelegating = !!delegateLc && delegateLc !== zeroAddress && delegateLc !== userAddrLc
  // Human-readable status for current delegation mode
  const delegationStatusText = userDelegateAddress
    ? isNotDelegatingNotClaimed
      ? "not delegating - not claimed"
      : isNotDelegatingClaimed
      ? "not delegating - claimed"
      : isDelegating
      ? "delegating"
      : ""
    : ""
  // For vote-directly label, compare voting weight vs personal balance
  const EPS = 1e-9
  const onlyVotingOnOwnBehalf = Math.abs((userVotingWeight || 0) - (userTokenBalance || 0)) < EPS
  const canShowBridge = !!daoSelected?.underlyingToken && ethers.isAddress(daoSelected.underlyingToken)
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
      <UserProfileCard>
        <UserInfoSection>
          <ProfileAvatar address={userAddress || ""} size={50} />
          <UserAddress>{userAddress}</UserAddress>
        </UserInfoSection>

        <StatsGrid>
          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Voting Weight</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{formattedVotingWeight}</ItemValue>
            </Grid>
          </Item>

          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">{daoSelected?.symbol} Balance</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{formattedPersonalBalance}</ItemValue>
            </Grid>
          </Item>

          <Item
            style={{ cursor: "pointer" }}
            onClick={() =>
              history.push("/explorer/etherlink/dao/" + daoSelected?.id + "/proposals?author=" + userAddress)
            }
          >
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Proposals Created</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{proposalCreatedCount}</ItemValue>
            </Grid>
          </Item>

          <Item>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">Votes Cast</ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="textPrimary">{proposalVotedCount}</ItemValue>
            </Grid>
          </Item>
        </StatsGrid>
      </UserProfileCard>

      <Typography variant="h5" style={{ marginBottom: "8px", color: "#fff" }}>
        Delegation settings
      </Typography>

      <Typography color="textSecondary" style={{ marginBottom: "16px" }}>
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
            {delegationStatusText && <Typography color="textSecondary">{delegationStatusText}</Typography>}
            {isDelegating && (
              <Typography color="textSecondary" style={{ fontFamily: "monospace" }}>
                Currently delegated to: {delegateLc}
              </Typography>
            )}
            <Button
              variant="outlined"
              style={{ width: "fit-content" }}
              onClick={() => setDelegateDialogOpen(true)}
              disabled={!ENABLE_DELEGATION}
            >
              {isNotDelegatingNotClaimed || !userDelegateAddress ? "Set Delegate" : "Change Delegate"}
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
            {delegationStatusText && <Typography color="textSecondary">{delegationStatusText}</Typography>}

            {isNotDelegatingClaimed ? (
              <Typography color="textSecondary">
                {onlyVotingOnOwnBehalf ? "only voting on your behalf" : "representing multiple accounts"}
              </Typography>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    daoDelegate(userAddress).finally(() => {
                      setIsLoading(false)
                      // Refresh on-chain stats so the UI reflects new voting power immediately
                      try {
                        refreshTokenStats()
                      } catch (_) {}
                    })
                  }}
                  style={{ width: "fit-content" }}
                  disabled={!ENABLE_DELEGATION || !userAddress}
                >
                  Claim Voting Power
                </Button>
              </>
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
                <FormField
                  label="Delegate To"
                  labelStyle={{ fontSize: 16 }}
                  containerStyle={{ gap: 12 }}
                  errorText={delegateToAddress && !isValidDelegateAddress ? "Enter a valid address (0x…)" : ""}
                >
                  <FormTextField
                    value={delegateToAddress}
                    placeholder="0x..."
                    onChange={e => setDelegateToAddress(e.target.value)}
                    inputProps={{
                      style: { fontSize: 14, fontFamily: "monospace" },
                      autoComplete: "off",
                      spellCheck: false
                    }}
                  />
                </FormField>
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
                        // Best-effort refresh so balances/weight update without waiting for indexers
                        try {
                          refreshTokenStats()
                        } catch (_) {}
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

        {canShowBridge && (
          <Grid item xs={12}>
            <TokenBridge />
          </Grid>
        )}

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
