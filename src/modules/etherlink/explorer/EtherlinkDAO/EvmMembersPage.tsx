import { Grid } from "components/ui"
import { TitleText } from "components/ui/TitleText"
import { EvmMembersTable } from "modules/etherlink/components/EvmMembersTable"
import { EtherlinkContext } from "services/wagmi/context"
import { useContext, useState } from "react"
import { SearchInput } from "modules/explorer/pages/DAOList/components/Searchbar"
import { Typography, CircularProgress } from "components/ui"
import { useDaoMembers } from "modules/etherlink/hooks/useDaoMembers"

export const EvmMembersPage = () => {
  const { daoSelected, provider, network } = useContext(EtherlinkContext)
  const [searchText, setSearchText] = useState("")

  const decimals = daoSelected?.decimals || 0

  const {
    data: daoMemberData = [],
    isLoading,
    error
  } = useDaoMembers(network || "", daoSelected?.token || "", decimals, provider)

  // Filter members by address
  const filteredMembers = daoMemberData.filter(member =>
    member.address.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <Grid container>
      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <SearchInput search={setSearchText} defaultValue="" placeholder="Find member by address..." />
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Typography color="textPrimary" variant="body2">
              {filteredMembers.length} Members
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item style={{ width: "inherit", marginTop: 10 }}>
        {isLoading ? (
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
            <CircularProgress color="secondary" />
          </Grid>
        ) : error ? (
          <Typography color="error" variant="body2" style={{ textAlign: "center" }}>
            Failed to load members: {error.message}
          </Typography>
        ) : (
          <EvmMembersTable data={filteredMembers} symbol={daoSelected?.symbol ?? ""} />
        )}
      </Grid>
    </Grid>
  )
}
