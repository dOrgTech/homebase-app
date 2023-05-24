import { useQuery } from "react-query"
import { Network } from "services/beacon"
import { getDAOs } from "services/services/dao/services"
import { getLiteDAOs } from "../../lite/lite-services"

export const useAllDAOs = (network: Network) => {
  return useQuery(
    ["daos", network],
    async () => {
      const homebase_daos = await getDAOs(network)
      const lite_daos = await getLiteDAOs(network)

      return [...homebase_daos, ...lite_daos]
    },
    {
      enabled: !!network
    }
  )
}
