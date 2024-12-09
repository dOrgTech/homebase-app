import { Grid } from "@mui/material"
import { TitleText } from "components/ui/TitleText"
import { EvmMembersTable } from "modules/etherlink/components/EvmMembersTable"
import { EtherlinkContext } from "services/wagmi/context"
import { useContext } from "react"

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
      <Grid item xs={12}>
        <TitleText color="textPrimary">Members</TitleText>
      </Grid>

      <Grid item style={{ width: "inherit", marginTop: 20 }}>
        <EvmMembersTable data={daoMemberData} symbol={""} />
      </Grid>
    </Grid>
  )
}
