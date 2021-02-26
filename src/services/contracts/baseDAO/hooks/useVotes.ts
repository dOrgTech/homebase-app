import { Vote } from "./../../../bakingBad/operations/types";
import { useQuery } from "react-query";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { BaseDAO } from "..";

export const useVotes = (
  proposalKey: string | undefined,
  contractAddress: string | undefined
) => {
  const { data: dao } = useDAO(contractAddress);

  const result = useQuery<Vote[], Error>(
    ["votes", contractAddress, proposalKey],
    () => (dao as BaseDAO).votes(proposalKey as string),
    {
      enabled: !!dao && !!proposalKey,
    }
  );

  return result;
};
