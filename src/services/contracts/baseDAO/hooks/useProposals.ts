import { useMemo } from "react";
import { useQuery } from "react-query";
import {
  ProposalStatus,
  ProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { BaseDAO } from "..";

export const useProposals = (
  contractAddress: string | undefined,
  status?: ProposalStatus
) => {
  const { data: dao } = useDAO(contractAddress);

  const result = useQuery<ProposalWithStatus[], Error>(
    ["proposals", contractAddress],
    () => (dao as BaseDAO).proposals(),
    {
      enabled: !!dao,
    }
  );

  const filteredData = useMemo(() => {
    if (!result.data) {
      return [];
    }

    if (!status) {
      return result.data;
    }

    return result.data.filter((proposalData) => proposalData.status === status);
  }, [result.data, status]);

  return {
    ...result,
    data: filteredData,
  };
};
