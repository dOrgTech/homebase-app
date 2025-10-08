import { IEvmDAO } from "modules/etherlink/types"

export type DaoConfigDefaults = {
  quorumNumerator: string
  votingDelay: string // seconds
  votingPeriod: string // seconds
  proposalThreshold: string
}

export const computeDaoConfigDefaults = (dao: Partial<IEvmDAO> | null | undefined): DaoConfigDefaults => {
  const quorum = Number(dao?.quorum ?? 0)
  const votingDelayMin = Number(dao?.votingDelay ?? 0)
  const votingDurationMin = Number(dao?.votingDuration ?? 0)
  const threshold = String(dao?.proposalThreshold ?? "0")

  return {
    quorumNumerator: Number.isFinite(quorum) ? String(quorum) : "0",
    votingDelay: Number.isFinite(votingDelayMin) ? String(votingDelayMin * 60) : "0",
    votingPeriod: Number.isFinite(votingDurationMin) ? String(votingDurationMin * 60) : "0",
    proposalThreshold: threshold
  }
}
