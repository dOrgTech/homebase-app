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

type TimerFields = {
  isTimerActive: boolean
  timerLabel: string
  timerTargetDate: dayjs.Dayjs | undefined
  effectiveDisplayStatus?:
    | "Pending"
    | "Active"
    | "Succeeded"
    | "Defeated"
    | "NoQuorum"
    | "Queued"
    | "Executable"
    | "Executed"
}

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
      const t = computeTimeline(p, daoSelected, now)
      return { ...(p as any), ...t } as T & TimerFields
    })
  }, [proposals, daoSelected, now])
}
