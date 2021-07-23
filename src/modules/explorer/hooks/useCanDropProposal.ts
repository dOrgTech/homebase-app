import { useMemo } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "services/contracts/baseDAO";
import { ProposalStatus, ProposalWithStatus } from "services/indexer/dao/mappers/proposal/types";

export const useCanDropProposal = (
  dao?: BaseDAO,
  proposal?: ProposalWithStatus
) => {
  const { account } = useTezos();

  return useMemo(() => {
    if (!proposal || !dao) {
      return false;
    }

    const isProposer =
      proposal.proposer.toLowerCase() === account.toLowerCase();

    const hasExpired = proposal.status === ProposalStatus.EXPIRED;

    const isGuardian =
      dao.data.guardian.toLowerCase() === account.toLowerCase();

    const isNotExecutedOrDropped = true
    
    // dao.data.proposalsToFlush.find(
    //   (id) => id.toLowerCase() === proposal.id.toLowerCase()
    // );

    return isNotExecutedOrDropped && (isProposer || hasExpired || isGuardian);
  }, [account, dao, proposal]);
};
