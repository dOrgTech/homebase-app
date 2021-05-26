import { useMemo } from "react";
import {
  ProposalStatus,
  ProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "services/contracts/baseDAO";

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
      dao.storage.guardian.toLowerCase() === account.toLowerCase();

    const isNotExecutedOrDropped = dao.storage.proposalsToFlush.find(
      (id) => id.toLowerCase() === proposal.id.toLowerCase()
    );

    return isNotExecutedOrDropped && (isProposer || hasExpired || isGuardian);
  }, [account, dao, proposal]);
};
