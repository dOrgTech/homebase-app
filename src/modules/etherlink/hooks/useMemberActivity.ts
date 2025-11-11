import { useMemo, useContext } from "react"

import { EtherlinkContext } from "services/wagmi/context"

import { IEvmProposal } from "modules/etherlink/types"

export const useMemberActivity = (userAddress?: string) => {
  const { daoProposals, daoMembers } = useContext(EtherlinkContext)

  const selectedUser = useMemo(() => {
    if (!userAddress || !daoMembers) return null
    return daoMembers.find((member: any) => member.address?.toLowerCase() === userAddress.toLowerCase())
  }, [userAddress, daoMembers])

  const proposalsCreatedIds = useMemo(() => {
    return new Set(selectedUser?.proposalsCreated || [])
  }, [selectedUser])

  const proposalsVotedIds = useMemo(() => {
    return new Set(selectedUser?.proposalsVoted || [])
  }, [selectedUser])

  const createdProposals = useMemo(() => {
    if (!daoProposals || !proposalsCreatedIds.size) return []
    return daoProposals.filter((proposal: IEvmProposal) => proposalsCreatedIds.has(proposal.id))
  }, [daoProposals, proposalsCreatedIds])

  const votedProposals = useMemo(() => {
    if (!daoProposals || !proposalsVotedIds.size) return []
    return daoProposals.filter((proposal: IEvmProposal) => proposalsVotedIds.has(proposal.id))
  }, [daoProposals, proposalsVotedIds])

  return {
    proposalsCreated: createdProposals,
    proposalsVoted: votedProposals,
    proposalsCreatedCount: proposalsCreatedIds.size,
    proposalsVotedCount: proposalsVotedIds.size,
    isLoading: !daoProposals || !daoMembers
  }
}
