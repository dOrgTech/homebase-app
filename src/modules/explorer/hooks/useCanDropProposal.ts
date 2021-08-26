import { useMemo } from "react";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "services/contracts/baseDAO";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import {
  Proposal,
  ProposalStatus,
} from "services/indexer/dao/mappers/proposal/types";

export const useCanDropProposal = (dao?: BaseDAO, proposal?: Proposal) => {
  const { account } = useTezos();
  const { cycleInfo } = useDAO(dao?.data.address);

  return useMemo(() => {
    if (!proposal || !dao) {
      return false;
    }

    const isProposer =
      proposal.proposer.toLowerCase() === account.toLowerCase();

    const hasExpired =
      cycleInfo &&
      proposal.getStatus(cycleInfo.currentLevel).status ===
        ProposalStatus.EXPIRED;

    const isGuardian =
      dao.data.guardian.toLowerCase() === account.toLowerCase();

    const isNotExecutedOrDropped = true;

    // dao.data.proposalsToFlush.find(
    //   (id) => id.toLowerCase() === proposal.id.toLowerCase()
    // );

    return isNotExecutedOrDropped && (isProposer || hasExpired || isGuardian);
  }, [account, cycleInfo, dao, proposal]);
};
