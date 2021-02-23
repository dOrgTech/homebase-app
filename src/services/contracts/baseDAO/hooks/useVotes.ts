import { useQuery } from "react-query";

import { Vote } from "services/bakingBad/operations/types";
import { getProposalVotes } from "services/bakingBad/operations/index";
import { useTezos } from "services/beacon/hooks/useTezos";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";

export const useVotes = (
  proposalKey: string | undefined,
  contractAddress: string | undefined
) => {
  const { network } = useTezos();
  const { data: daoData } = useDAO(contractAddress);

  const result = useQuery<Vote[], Error>(
    ["votes", contractAddress, proposalKey],
    () =>
      getProposalVotes(
        contractAddress as string,
        network,
        proposalKey as string
      ),
    {
      enabled: !!daoData && !!proposalKey,
    }
  );

  return result;
};
