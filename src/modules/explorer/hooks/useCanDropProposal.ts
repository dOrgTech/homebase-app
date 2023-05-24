import { useMemo } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useProposal } from "services/services/dao/hooks/useProposal"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

export const useCanDropProposal = (daoId: string, proposalId: string) => {
  const { account } = useTezos()
  const { data: dao, cycleInfo } = useDAO(daoId)
  const { data: proposal } = useProposal(daoId, proposalId)

  return useMemo(() => {
    if (!proposal || !dao) {
      return false
    }

    const isProposer = proposal.proposer.toLowerCase() === account.toLowerCase()

    const hasExpired = cycleInfo && proposal.getStatus(cycleInfo.currentLevel).status === ProposalStatus.EXPIRED

    const isGuardian = dao.data.guardian.toLowerCase() === account.toLowerCase()

    const isNotExecutedOrDropped =
      (cycleInfo && proposal.getStatus(cycleInfo.currentLevel).status === ProposalStatus.DROPPED) ||
      (cycleInfo && proposal.getStatus(cycleInfo.currentLevel).status === ProposalStatus.EXECUTED)

    // dao.data.proposalsToFlush.find(
    //   (id) => id.toLowerCase() === proposal.id.toLowerCase()
    // );

    return !isNotExecutedOrDropped && (isProposer || hasExpired || isGuardian)
  }, [account, cycleInfo, dao, proposal])
}
