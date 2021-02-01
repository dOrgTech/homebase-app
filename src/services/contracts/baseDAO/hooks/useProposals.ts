import { useQuery } from "react-query";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { getProposals } from "../../../bakingBad/proposals"

export const useProposals = (proposalId: string) => {
  const { tezos, connect } = useTezos()

  const result = useQuery(["proposals", proposalId], async () => getProposals)
}
