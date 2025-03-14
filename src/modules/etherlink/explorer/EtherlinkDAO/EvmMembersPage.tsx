import { Grid } from "@mui/material"
import { TitleText } from "components/ui/TitleText"
import { EvmMembersTable } from "modules/etherlink/components/EvmMembersTable"
import { EtherlinkContext } from "services/wagmi/context"
import { useContext } from "react"
import { VotingPowerWidget } from "modules/etherlink/components/VotingPowerWidget"

interface EvmDaoMember {
  address: string
  votingWeight: number
  personalBalance: number
  proposalsCreated: number
  proposalsVoted: number
}

export const EvmMembersPage = () => {
  const { daoMembers, daoSelected } = useContext(EtherlinkContext)
  const decimals = daoSelected?.decimals || 0
  const daoMemberData = daoMembers?.map((member: EvmDaoMember) => ({
    address: member.address,
    votingWeight: member.votingWeight,
    personalBalance: member.personalBalance / 10 ** decimals,
    proposalsCreated: member.proposalsCreated,
    proposalsVoted: member.proposalsVoted
  }))

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
