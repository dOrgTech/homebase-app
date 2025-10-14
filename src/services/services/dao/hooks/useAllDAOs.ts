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

  // Always derive Etherlink DAOs from live context state so they react to
  // network changes and Firestore updates without being captured by a
  // react-query fetcher closure.
  const evmDaos =
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

  // Tezos sources via react-query. Keep hook order stable across network switches.
  const queryData = useQuery(
    ["daos", network],
    async () => {
      // On Etherlink networks, do not fetch/merge Tezos data.
      if (String(network).includes("etherlink")) {
        return [] as any[]
      }

      let homebase_daos = [] as any[]
      let lite_daos = [] as any[]

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

      return [...homebase_daos, ...lite_daos]
    },
    {
      // Always create the hook; let the fetcher short-circuit for Etherlink networks.
      keepPreviousData: true
    }
  )

  // Compose final list based on network.
  const isEtherlink = String(network).includes("etherlink")
  const combinedData = isEtherlink ? evmDaos : queryData.data || []
  const isLoading = isEtherlink ? Boolean(isLoadingDaos) : Boolean(queryData.isLoading)

  return {
    data: combinedData,
    isLoading,
    signerTokenBalances,
    isLoadingWithFirebase: isEtherlink ? Boolean(isLoadingDaos) : false,
    myEtherlinkDaoAddresses: myDaoAddresses || [],
    isLoadingMyDaos
  }
}
