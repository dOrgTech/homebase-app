import dayjs from "dayjs";
import { useQuery } from "react-query";
import { BaseDAO } from "services/contracts/baseDAO";
import { addStatusToProposal } from "../mappers/proposal";
import { ProposalStatus } from "../mappers/proposal/types";
import { useDAO } from "./useDAO";

export const useProposals = (
  contractAddress: string | undefined,
  status?: ProposalStatus
) => {
  const { data: dao, isLoading, error } = useDAO(contractAddress);

  const queryResults = useQuery(
    ["proposalsWithStatus", contractAddress, status],
    () => {
      const proposalsWithStatus = (dao as BaseDAO).data.proposals
        .map((proposal) =>
          addStatusToProposal({
            dao: dao as BaseDAO,
            proposal,
          })
        )
        .sort((a, b) =>
          dayjs(b.startDate).isAfter(dayjs(a.startDate)) ? 1 : -1
        );

      if (!status) {
        return proposalsWithStatus;
      }

      return proposalsWithStatus.filter(
        (proposalData) => proposalData.status === status
      );
    },
    {
      refetchInterval: 30000,
      enabled: !!dao,
    }
  );

  return {
    data: queryResults.data,
    isLoading: isLoading || queryResults.isLoading,
    error: error || queryResults.error,
  };
};
