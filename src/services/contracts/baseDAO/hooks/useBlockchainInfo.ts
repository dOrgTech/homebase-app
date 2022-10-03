import { getNetworkStats } from "../../../bakingBad/stats"
import { useQuery } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BlockchainStats } from "../../../bakingBad/stats/types"

export const useBlockchainInfo = () => {
  const { network } = useTezos()
  return useQuery<BlockchainStats, Error>(["blockchainStats", network], () => getNetworkStats(network))
}
