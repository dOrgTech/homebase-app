import dayjs from "dayjs";
import { useQuery } from "react-query";
import { BaseDAO, CycleInfo } from "services/contracts/baseDAO";
import {
  Proposal,
  ProposalStatus,
  RegistryProposal,
  TreasuryProposal,
} from "../mappers/proposal/types";
import { getProposals } from "../services";
import { useDAO } from "./useDAO";

export const useProposals = (
  contractAddress: string | undefined,
  status?: ProposalStatus
) => {
  const {
    data: daoData,
    isLoading,
    error,
    cycleInfo,
  } = useDAO(contractAddress);

  const queryResults = useQuery(
    ["proposals", contractAddress, status],
    async () => {
      const dao = daoData as BaseDAO;
      const response = await getProposals(contractAddress as string);

      const fetched = response.daos[0];
      let proposals: Proposal[];

      switch (dao.data.type) {
        case "treasury":
          proposals = fetched.proposals.map(
            (proposal) => new TreasuryProposal(proposal, dao)
          );

          break;
        case "registry":
          proposals = fetched.proposals.map(
            (proposal) => new RegistryProposal(proposal, dao)
          );

          break;
        default:
          throw new Error(
            `DAO with address '${dao.data.address}' has an unrecognized type '${dao.data.type}'`
          );
      }

      const proposalsWithVoters = proposals.sort((a, b) =>
        dayjs(b.startDate).isAfter(dayjs(a.startDate)) ? 1 : -1
      );

      if (!status) {
        return proposalsWithVoters;
      }

      return proposalsWithVoters.filter(
        (proposalData) =>
          proposalData.getStatus((cycleInfo as CycleInfo).currentLevel)
            .status === status
      );
    },
    {
      refetchInterval: 30000,
      enabled: !!daoData && !!cycleInfo,
    }
  );

  return {
    data: queryResults.data,
    isLoading: isLoading || queryResults.isLoading,
    error: error || queryResults.error,
  };
};
