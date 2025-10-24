import dayjs from "dayjs"
import BigNumber from "bignumber.js"

type DaoSelectedLike = {
  votingDelay: number
  votingDuration: number
  executionDelay: number
}
type ProposalLike = {
  createdAt: any
  status?: string
  statusHistoryMap?: { status: string; timestamp: number | dayjs.Dayjs; timestamp_human: string }[]
  inFavor?: string | number
  against?: string | number
}

export function computeTimeline(
  proposal?: ProposalLike | null,
  daoSelected?: DaoSelectedLike | null,
  now: any = dayjs()
) {
  if (!proposal || !daoSelected || !proposal.createdAt) {
    return {
      isTimerActive: false,
      timerLabel: "",
      timerTargetDate: null as any,
      phase: "unknown" as "preVoting" | "voting" | "postVoting" | "queuedWait" | "executable" | "executed" | "unknown",
      effectiveDisplayStatus: undefined as
        | "Pending"
        | "Active"
        | "Succeeded"
        | "Defeated"
        | "NoQuorum"
        | "Queued"
        | "Executable"
        | "Executed"
        | undefined
    }
  }
  const createdAt = dayjs.isDayjs(proposal.createdAt)
    ? proposal.createdAt
    : dayjs.unix((proposal as any)?.createdAt?.seconds || 0)
  const activeStart = createdAt.add(daoSelected.votingDelay || 0, "minutes")
  const votingExpiresAt = activeStart.add(daoSelected.votingDuration || 0, "minutes")

  let isTimerActive = false
  let timerLabel = ""
  let timerTargetDate: any = null
  let phase: "preVoting" | "voting" | "postVoting" | "queuedWait" | "executable" | "executed" | "unknown" = "unknown"
  let effectiveDisplayStatus:
    | "Pending"
    | "Active"
    | "Succeeded"
    | "Defeated"
    | "NoQuorum"
    | "Queued"
    | "Executable"
    | "Executed"
    | undefined

  // Executed first (if present in status or history)
  const executedEntry = proposal.status === "executed" || proposal.statusHistoryMap?.some(x => x.status === "executed")
  if (executedEntry) {
    phase = "executed"
    effectiveDisplayStatus = "Executed"
  } else if (activeStart.isAfter(now)) {
    isTimerActive = true
    timerLabel = "Voting starts in"
    timerTargetDate = activeStart
    phase = "preVoting"
    effectiveDisplayStatus = "Pending"
  } else if (votingExpiresAt.isAfter(now)) {
    isTimerActive = true
    timerLabel = "Time left to vote"
    timerTargetDate = votingExpiresAt
    phase = "voting"
    effectiveDisplayStatus = "Active"
  } else {
    // Check for queued status if statusHistoryMap exists
    if (Array.isArray(proposal.statusHistoryMap)) {
      const queued = proposal.statusHistoryMap.find(x => x.status === "queued")
      if (queued) {
        const ts = dayjs.isDayjs(queued.timestamp) ? queued.timestamp : dayjs.unix(queued.timestamp || 0)
        const execAt = ts.add(daoSelected.executionDelay || 0, "seconds")
        if (execAt.isAfter(now)) {
          isTimerActive = true
          timerLabel = "Execution available in"
          timerTargetDate = execAt
          phase = "queuedWait"
          effectiveDisplayStatus = "Queued"
        } else {
          phase = "executable"
          effectiveDisplayStatus = "Executable"
        }
      }
    }

    // If voting has ended and not queued/executed yet, compute immediate outcome
    // This calculation should run regardless of statusHistoryMap presence
    if (!effectiveDisplayStatus && now.isAfter(votingExpiresAt)) {
      phase = "postVoting"
      try {
        const inFavor = new BigNumber((proposal as any)?.inFavor ?? 0)
        const against = new BigNumber((proposal as any)?.against ?? 0)
        const totalCast = inFavor.plus(against)
        const totalSupply = new BigNumber(((daoSelected as any)?.totalSupply ?? 0) as any)
        const quorumPct = new BigNumber(((daoSelected as any)?.quorum ?? 0) as any)

        if (totalSupply.gt(0) && quorumPct.gte(0)) {
          const pct = totalCast.div(totalSupply).times(100)
          const meetsQuorum = pct.gte(quorumPct)
          if (!meetsQuorum) effectiveDisplayStatus = "NoQuorum"
          else effectiveDisplayStatus = inFavor.gt(against) ? "Succeeded" : "Defeated"
        }
      } catch (_) {
        // fall back below
      }
    }
  }

  // Final fallbacks
  if (!effectiveDisplayStatus) {
    if (now.isAfter(votingExpiresAt)) {
      effectiveDisplayStatus = "Defeated"
      phase = "postVoting"
    } else if (now.isBefore(activeStart)) {
      effectiveDisplayStatus = "Pending"
      phase = "preVoting"
    } else {
      effectiveDisplayStatus = "Active"
      phase = "voting"
    }
  }

  return { isTimerActive, timerLabel, timerTargetDate, phase, effectiveDisplayStatus }
}
