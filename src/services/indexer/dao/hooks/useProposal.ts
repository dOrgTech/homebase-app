import { useQuery } from "react-query";
import { BaseDAO, CycleInfo } from "services/contracts/baseDAO";
import { useCycleInfo } from "services/contracts/baseDAO/hooks/useCycleInfo";
import { addStatusToProposal } from "../mappers/proposal";
import { useDAO } from "./useDAO";

export const useProposal = (
  contractAddress: string | undefined,
  proposalId: string
) => {
  const { data: dao, isLoading, error } = useDAO(contractAddress);
  const cycleInfo = useCycleInfo(dao?.data.address)

  const queryResults = useQuery(
    ["proposalWithStatus", contractAddress, proposalId],
    () => {
      const proposal = (dao as BaseDAO).data.proposals.find(
        (proposal) => proposal.id.toLowerCase() === proposalId.toLowerCase()
      );

      if (!proposal) {
        throw new Error(
          `Proposal with id '${proposalId}' not found in DAO with address '${
            (dao as BaseDAO).data.address
          }'`
        );
      }

      return addStatusToProposal({
        dao: dao as BaseDAO,
        proposal,
        currentLevel: (cycleInfo as CycleInfo).currentLevel
      });
    },
    {
      refetchInterval: 30000,
      enabled: !!dao && !!proposalId && !!cycleInfo,
    }
  );

  return {
    data: queryResults.data,
    isLoading: queryResults.isLoading || isLoading,
    error: error || queryResults.error,
  };
};
