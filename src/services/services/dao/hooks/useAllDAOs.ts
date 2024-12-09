import { useQuery } from "react-query"
import { Network } from "services/beacon"
import { getDAOs } from "services/services/dao/services"
import { getLiteDAOs } from "../../lite/lite-services"
import { useContext, useEffect } from "react"
import { EtherlinkContext } from "services/wagmi/context"

export const useAllDAOs = (network: Network) => {
  const { daos: etherinkDaos, isLoadingDaos } = useContext(EtherlinkContext)

  return useQuery(
    ["daos", network],
    async () => {
      const homebase_daos = await getDAOs(network)
      const lite_daos = await getLiteDAOs(network)
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

      return [...homebase_daos, ...lite_daos, ...evm_daos]
    },
    {
      enabled: !!(network && !isLoadingDaos)
    }
  )
}
