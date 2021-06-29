import { useMemo } from "react";
import { useQuery } from "react-query";
import {
  ProposalStatus,
  ProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { addStatusToProposal, BaseDAO, CycleInfo } from "..";
import { useCycleInfo } from "./useCycleInfo";
import { useTezos } from "services/beacon/hooks/useTezos";
import {
  getDroppedProposals,
  getOperationTimestampsByEntrypoint,
} from "services/bakingBad/operations";

export const useProposalsWithStatus = (
  contractAddress: string | undefined,
  status?: ProposalStatus
) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos();

  const cycleInfo = useCycleInfo(contractAddress);

  const proposalsWithStatus = useQuery<ProposalWithStatus[], Error>(
    ["proposalsWithStatus", contractAddress],
    async () => {
      const result = await (dao as BaseDAO).proposals(network);
      const dropProposalOps = await getDroppedProposals(
        (dao as BaseDAO).address,
        network
      );
      const flushOps = await getOperationTimestampsByEntrypoint(
        (dao as BaseDAO).address,
        "flush",
        network
      );

      return result?.map((proposal) => addStatusToProposal({
        dao: dao as BaseDAO,
        proposal,
        dropProposalOps,
        flushOps,
        cycleInfo: cycleInfo as CycleInfo
      }));
    },
    {
      enabled: !!cycleInfo && !!dao,
    }
  );

  const filteredData: ProposalWithStatus[] = useMemo(() => {
    if (!proposalsWithStatus.data) {
      return [];
    }

    if (!status) {
      return proposalsWithStatus.data;
    }

    return proposalsWithStatus.data.filter(
      (proposalData) => proposalData.status === status
    );
  }, [proposalsWithStatus, status]);

  return {
    ...proposalsWithStatus,
    data: filteredData,
  };
};
