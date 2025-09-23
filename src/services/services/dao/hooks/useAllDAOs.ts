import { useQuery } from "react-query"
import { Network } from "services/beacon"
import { getDAOs } from "services/services/dao/services"
import { getLiteDAOs } from "../../lite/lite-services"
import { useContext } from "react"
import { EtherlinkContext } from "services/wagmi/context"

export const useAllDAOs = (network: Network) => {
  const {
    daos: etherinkDaos,
    isLoadingDaos,
    signerTokenBalances,
    myDaoAddresses,
    isLoadingMyDaos
  } = useContext(EtherlinkContext)

  const queryData = useQuery(
    ["daos", network],
    async () => {
      let homebase_daos = [] as any[]
      let lite_daos = [] as any[]

      // Skip Hasura when on Etherlink; otherwise, fetch and swallow errors
      try {
        homebase_daos = await getDAOs(network)
      } catch (e) {
        console.error("getDAOs failed", e)
        homebase_daos = []
      }

      try {
        lite_daos = await getLiteDAOs(network)
      } catch (e) {
        console.error("getLiteDAOs failed", e)
        lite_daos = []
      }
      const evm_daos =
        etherinkDaos?.map((dao: any) => ({
          ...dao,
          dao_type: {
            badge: "v4",
            name: "etherlink_onchain"
          },
          token: {
            id: NaN,
            name: dao.name,
            contract: dao.token,
            symbol: dao.symbol,
            standard: "ERC20"
          },
          holders_count: dao.holders,
          ledgers: [],
          network: "Etherlink"
        })) || []

      if (network.includes("etherlink")) {
        // Do not include Homebase DAOs on Etherlink networks
        return [...lite_daos, ...evm_daos]
      }

      return [...homebase_daos, ...lite_daos]
    },
    {
      enabled: !!(network && !isLoadingDaos)
    }
  )

  return {
    ...queryData,
    signerTokenBalances,
    isLoadingWithFirebase: isLoadingDaos,
    myEtherlinkDaoAddresses: myDaoAddresses || [],
    isLoadingMyDaos
  }
}
