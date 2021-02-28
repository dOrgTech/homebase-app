import { useQuery } from "react-query";
import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { BaseDAO } from "..";

export const useProposals = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);

  const result = useQuery<ProposalWithStatus[], Error>(
    ["proposals", contractAddress],
    () => (dao as BaseDAO).proposals(),
    {
      enabled: !!dao,
    }
  );

  return result;
};
