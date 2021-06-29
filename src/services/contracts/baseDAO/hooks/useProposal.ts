import { useQuery } from "react-query";
import { getDroppedProposals, getOperationTimestampsByEntrypoint } from "services/bakingBad/operations";

import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { useTezos } from "services/beacon/hooks/useTezos";
import { addStatusToProposal, BaseDAO, CycleInfo } from "..";
import { useCycleInfo } from "./useCycleInfo";
import { useDAO } from "./useDAO";

export const useProposal = (
  daoAddress: string | undefined,
  proposalKey: string
) => {
  const { data: dao } = useDAO(daoAddress);
  const { network } = useTezos();

  const cycleInfo = useCycleInfo(daoAddress);

  return useQuery<ProposalWithStatus, Error>(
    ["proposal", proposalKey],
    async () => {
      const proposal = await (dao as BaseDAO).proposal(proposalKey, network)

      const dropProposalOps = await getDroppedProposals(
        (dao as BaseDAO).address,
        network
      );
      const flushOps = await getOperationTimestampsByEntrypoint(
        (dao as BaseDAO).address,
        "flush",
        network
      );

      return addStatusToProposal({
        dao: dao as BaseDAO,
        proposal,
        dropProposalOps,
        flushOps,
        cycleInfo: cycleInfo as CycleInfo
      });
    },
    {
      enabled: !!cycleInfo && !!dao,
    }
  );
};
