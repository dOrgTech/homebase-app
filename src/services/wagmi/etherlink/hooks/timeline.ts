import dayjs from "dayjs"

type DaoSelectedLike = {
  votingDelay: number
  votingDuration: number
  executionDelay: number
}
type ProposalLike = {
  createdAt: any
  status?: string
  statusHistoryMap?: { status: string; timestamp: number | dayjs.Dayjs; timestamp_human: string }[]
}

export function computeTimeline(
  proposal?: ProposalLike | null,
  daoSelected?: DaoSelectedLike | null,
  now: any = dayjs()
) {
  if (!proposal || !daoSelected || !proposal.createdAt) {
    return { isTimerActive: false, timerLabel: "", timerTargetDate: null as any }
  }
  const createdAt = dayjs.isDayjs(proposal.createdAt)
    ? proposal.createdAt
    : dayjs.unix((proposal as any)?.createdAt?.seconds || 0)
  const activeStart = createdAt.add(daoSelected.votingDelay || 0, "minutes")
  const votingExpiresAt = activeStart.add(daoSelected.votingDuration || 0, "minutes")

  let isTimerActive = false
  let timerLabel = ""
  let timerTargetDate: any = null

  if (activeStart.isAfter(now)) {
    isTimerActive = true
    timerLabel = "Voting starts in"
    timerTargetDate = activeStart
  } else if (votingExpiresAt.isAfter(now)) {
    isTimerActive = true
    timerLabel = "Time left to vote"
    timerTargetDate = votingExpiresAt
  } else if (proposal.status === "queued" && Array.isArray(proposal.statusHistoryMap)) {
    const queued = proposal.statusHistoryMap.find(x => x.status === "queued")
    if (queued) {
      const ts = dayjs.isDayjs(queued.timestamp) ? queued.timestamp : dayjs.unix(queued.timestamp || 0)
      const execAt = ts.add(daoSelected.executionDelay || 0, "seconds")
      if (execAt.isAfter(now)) {
        isTimerActive = true
        timerLabel = "Execution available in"
        timerTargetDate = execAt
      }
    }
  }

  return { isTimerActive, timerLabel, timerTargetDate }
}
