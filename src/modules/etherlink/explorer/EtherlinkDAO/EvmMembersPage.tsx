import { Grid } from "@mui/material"
import { TitleText } from "components/ui/TitleText"
import { EvmMembersTable } from "modules/etherlink/components/EvmMembersTable"
import { EtherlinkContext } from "services/wagmi/context"
import { useContext } from "react"
import { VotingPowerWidget } from "modules/etherlink/components/VotingPowerWidget"

export const EvmMembersPage = () => {
  const { daoMembers } = useContext(EtherlinkContext)
  const daoMemberData = daoMembers?.map((member: any) => ({
    address: member.address,
    votingWeight: member.votingWeight,
    personalBalance: member.personalBalance,
    proposalsCreated: member.proposalsCreated,
    proposalsVoted: member.proposalsVoted
  }))
  console.log("daoMemberData", daoMemberData, daoMembers)
  return (
    <Grid container>
      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <TitleText color="textPrimary">Members</TitleText>
      </Grid>

      {/* uncommented on andrei recommendation */}
      {/* <Grid item xs={12}>
        <VotingPowerWidget tokenSymbol="MTD" />
      </Grid> */}

      <Grid item style={{ width: "inherit", marginTop: 20 }}>
        <EvmMembersTable data={daoMemberData} symbol={""} />
      </Grid>
    </Grid>
  )
}
