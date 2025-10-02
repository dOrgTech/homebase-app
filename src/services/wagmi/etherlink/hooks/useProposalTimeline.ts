import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import { computeTimeline } from "./timeline"

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

export const useProposalTimeline = (proposal?: ProposalLike | null, daoSelected?: DaoSelectedLike | null) => {
  const [now, setNow] = useState(() => dayjs())

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => computeTimeline(proposal, daoSelected, now), [proposal, daoSelected, now])
}

type TimerFields = { isTimerActive: boolean; timerLabel: string; timerTargetDate: dayjs.Dayjs | undefined }

export function useTimelineForProposals<T extends ProposalLike>(
  proposals: T[] = [],
  daoSelected?: DaoSelectedLike | null
): Array<T & TimerFields> {
  const [now, setNow] = useState(() => dayjs())
  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    if (!daoSelected) return proposals as Array<T & TimerFields>
    return proposals.map(p => {
      const createdAt = dayjs.isDayjs((p as any).createdAt)
        ? ((p as any).createdAt as dayjs.Dayjs)
        : dayjs.unix(((p as any)?.createdAt?.seconds as number) || 0)
      const activeStart = createdAt.add(daoSelected.votingDelay || 0, "minutes")
      const votingExpiresAt = activeStart.add(daoSelected.votingDuration || 0, "minutes")

      let isTimerActive = (p as any).isTimerActive ?? false
      let timerLabel: string = (p as any).timerLabel ?? ""
      let timerTargetDate: dayjs.Dayjs | undefined = (p as any).timerTargetDate

      if (activeStart.isAfter(now)) {
        isTimerActive = true
        timerLabel = "Voting starts in"
        timerTargetDate = activeStart
      } else if (votingExpiresAt.isAfter(now)) {
        isTimerActive = true
        timerLabel = "Time left to vote"
        timerTargetDate = votingExpiresAt
      } else if ((p as any).status === "queued" && Array.isArray((p as any).statusHistoryMap)) {
        const queued = (p as any).statusHistoryMap.find((x: any) => x.status === "queued")
        if (queued) {
          const execAt = dayjs.unix(queued.timestamp).add(daoSelected.executionDelay || 0, "seconds")
          if (execAt.isAfter(now)) {
            isTimerActive = true
            timerLabel = "Execution available in"
            timerTargetDate = execAt
          }
        }
      }

      return { ...(p as any), isTimerActive, timerLabel, timerTargetDate } as T & TimerFields
    })
  }, [proposals, daoSelected, now])
}
