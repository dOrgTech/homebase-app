import React, { useContext, useMemo, useEffect, useState } from "react"
import { ethers } from "ethers"
import { Box, Grid, Typography, styled } from "components/ui"
import { ResponsiveDialog } from "modules/explorer/components/ResponsiveDialog"
import { ProfileAvatar } from "modules/explorer/components/styled/ProfileAvatar"
import { TransparentItem, ItemContent, ItemTitle, ItemValue } from "components/ui/etherlink/Stats"
import { EvmActivityHistory } from "./EvmActivityHistory"
import { useMemberActivity } from "../hooks/useMemberActivity"
import { EtherlinkContext } from "services/wagmi/context"
import { formatNumber } from "modules/explorer/utils/FormatNumber"
import BigNumber from "bignumber.js"
import HbTokenAbi from "assets/abis/hb_evm.json"

const ModalContent = styled(Box)({
  padding: "0 25px 24px 25px",
  maxHeight: "calc(100vh - 200px)",
  overflowY: "auto"
})

const ProfileHeader = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  marginBottom: "24px"
})

const MemberAddress = styled(Typography)({
  color: "#fff",
  fontSize: "14px",
  fontFamily: "monospace",
  wordBreak: "break-all"
})

const StatsGrid = styled(Grid)(({ theme }) => ({
  "display": "grid",
  "gridTemplateColumns": "repeat(4, 1fr)",
  "gap": "16px",
  "marginBottom": "24px",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr"
  },
  "& > div": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "80px"
  }
}))

interface MemberProfileModalProps {
  open: boolean
  onClose: () => void
  memberAddress: string
  memberBalance: number
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  open,
  onClose,
  memberAddress,
  memberBalance
}) => {
  const { daoSelected, provider } = useContext(EtherlinkContext)
  const [votingWeight, setVotingWeight] = useState<number | null>(null)

  const { proposalsCreatedCount, proposalsVotedCount } = useMemberActivity(memberAddress)

  // Fetch voting weight from contract
  useEffect(() => {
    const fetchVotingWeight = async () => {
      if (!provider || !daoSelected?.token || !memberAddress || !open) {
        setVotingWeight(null)
        return
      }

      try {
        const tokenContract = new ethers.Contract(daoSelected.token, HbTokenAbi.abi, provider)
        const votes = await tokenContract.getVotes(memberAddress)
        const decimals = daoSelected.decimals || 18
        const weight = Number(votes) / Math.pow(10, decimals)
        setVotingWeight(weight)
      } catch (error) {
        console.debug("Failed to fetch voting weight:", error)
        setVotingWeight(null)
      }
    }

    fetchVotingWeight()
  }, [provider, daoSelected?.token, daoSelected?.decimals, memberAddress, open])

  const formattedVotingWeight = useMemo(
    () => (votingWeight !== null ? String(formatNumber(new BigNumber(votingWeight))) : "-"),
    [votingWeight]
  )

  const formattedBalance = useMemo(() => String(formatNumber(new BigNumber(memberBalance))), [memberBalance])

  return (
    <ResponsiveDialog open={open} onClose={onClose} title="" template="md">
      <ModalContent>
        <ProfileHeader>
          <ProfileAvatar address={memberAddress} size={50} />
          <MemberAddress>{memberAddress}</MemberAddress>
        </ProfileHeader>

        <StatsGrid>
          <TransparentItem>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">
                Voting
                <br />
                Weight
              </ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="secondary">{formattedVotingWeight}</ItemValue>
            </Grid>
          </TransparentItem>

          <TransparentItem>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">
                {daoSelected?.symbol}
                <br />
                Balance
              </ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="secondary">{formattedBalance}</ItemValue>
            </Grid>
          </TransparentItem>

          <TransparentItem>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">
                Proposals
                <br />
                Created
              </ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="secondary">{proposalsCreatedCount}</ItemValue>
            </Grid>
          </TransparentItem>

          <TransparentItem>
            <ItemContent item container direction="row" alignItems="center">
              <ItemTitle color="textPrimary">
                Votes
                <br />
                Cast
              </ItemTitle>
            </ItemContent>
            <Grid item>
              <ItemValue color="secondary">{proposalsVotedCount}</ItemValue>
            </Grid>
          </TransparentItem>
        </StatsGrid>

        <EvmActivityHistory userAddress={memberAddress} />
      </ModalContent>
    </ResponsiveDialog>
  )
}
