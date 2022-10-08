import { useQuery } from "react-query";
import { BaseDAO } from "services/contracts/baseDAO";
import {
  Proposal,
  RegistryProposal,
  TreasuryProposal,
} from "../mappers/proposal/types";
import { getProposal } from "../services";
import { useDAO } from "./useDAO";

export const useProposal = (contractAddress: string, proposalKey: string) => {
  const {
    data: daoData,
    isLoading,
    error,
    cycleInfo,
  } = useDAO(contractAddress);

  const queryResults = useQuery(
    ["proposal", contractAddress, proposalKey],
    async () => {
      const dao = daoData as BaseDAO;
      const response = await getProposal(
        contractAddress as string,
        proposalKey
      );

      const fetched = response.daos[0];
      let proposal: Proposal;

      switch (dao.data.type) {
        case "treasury":
          proposal = new TreasuryProposal(fetched.proposals[0], dao);

          break;
        case "registry":
          proposal = new RegistryProposal(fetched.proposals[0], dao);

          break;
        default:
          throw new Error(
            `DAO with address '${dao.data.address}' has an unrecognized type '${dao.data.type}'`
          );
      }

      return proposal;
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
