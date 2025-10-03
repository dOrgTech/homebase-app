import { Grid } from "components/ui"
import { TitleText } from "components/ui/TitleText"
import { EvmMembersTable } from "modules/etherlink/components/EvmMembersTable"
import { EtherlinkContext } from "services/wagmi/context"
import { useContext, useEffect, useMemo, useState } from "react"
import { ethers } from "ethers"
import HbTokenAbi from "assets/abis/hb_evm.json"

export const EvmMembersPage = () => {
  const { daoMembers, daoSelected, provider } = useContext(EtherlinkContext)

  const decimals = daoSelected?.decimals || 0

  // Fallback data from Firestore (normalized by decimals if needed)
  const fallbackData = useMemo(
    () =>
      (daoMembers || []).map((member: any) => ({
        address: member.address,
        votingWeight: Number(member.votingWeight || 0) / Math.pow(10, decimals),
        personalBalance: Number(member.personalBalance || 0) / Math.pow(10, decimals),
        proposalsCreated: member.proposalsCreated,
        proposalsVoted: member.proposalsVoted
      })),
    [daoMembers, decimals]
  )

  const [daoMemberData, setDaoMemberData] = useState<any[]>(fallbackData)

  // Keep state in sync when members list changes while on-chain refresh is pending
  useEffect(() => {
    setDaoMemberData(fallbackData)
  }, [fallbackData])

  // Refresh voting weights and balances from on-chain to ensure accuracy
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        if (!provider || !daoSelected?.token) return
        const token = new ethers.Contract(daoSelected.token, HbTokenAbi.abi, provider)

        const results = await Promise.all(
          (daoMembers || []).map(async (member: any) => {
            try {
              const [weightRaw, balanceRaw] = await Promise.all([
                token.getVotes(member.address),
                token.balanceOf(member.address)
              ])
              const votingWeight = Number(weightRaw) / Math.pow(10, decimals)
              const personalBalance = Number(balanceRaw) / Math.pow(10, decimals)
              return {
                address: member.address,
                votingWeight,
                personalBalance,
                proposalsCreated: member.proposalsCreated,
                proposalsVoted: member.proposalsVoted
              }
            } catch (_) {
              // Fallback to Firestore-derived values for this member if on-chain read fails
              return {
                address: member.address,
                votingWeight: Number(member.votingWeight || 0) / Math.pow(10, decimals),
                personalBalance: Number(member.personalBalance || 0) / Math.pow(10, decimals),
                proposalsCreated: member.proposalsCreated,
                proposalsVoted: member.proposalsVoted
              }
            }
          })
        )

        if (!cancelled) setDaoMemberData(results)
      } catch (_) {
        // Ignore and keep fallback values
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [provider, daoSelected?.token, daoMembers, decimals])

  return (
    <Grid container>
      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <TitleText color="textPrimary">Members</TitleText>
      </Grid>

      {/* commented on andrei recommendation */}
      {/* <Grid item xs={12}>
        <VotingPowerWidget tokenSymbol="MTD" />
      </Grid> */}

      <Grid item style={{ width: "inherit", marginTop: 20 }}>
        <EvmMembersTable data={daoMemberData} symbol={daoSelected?.symbol ?? ""} />
      </Grid>
    </Grid>
  )
}
