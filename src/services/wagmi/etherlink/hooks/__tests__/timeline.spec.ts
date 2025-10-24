import dayjs from "dayjs"
import { computeTimeline } from "../../hooks/timeline"

describe("computeTimeline", () => {
  const baseDao = { votingDelay: 10, votingDuration: 30, executionDelay: 60 }

  it("returns 'Voting starts in' when current time is before activeStart", () => {
    const createdAt = dayjs()
    const proposal: any = { createdAt }
    const now = createdAt.add(5, "minutes")
    const res = computeTimeline(proposal, baseDao as any, now)
    expect(res.isTimerActive).toBe(true)
    expect(res.timerLabel).toBe("Voting starts in")
  })

  it("returns 'Time left to vote' during voting period", () => {
    const createdAt = dayjs()
    const proposal: any = { createdAt }
    const now = createdAt.add(15, "minutes")
    const res = computeTimeline(proposal, baseDao as any, now)
    expect(res.isTimerActive).toBe(true)
    expect(res.timerLabel).toBe("Time left to vote")
  })

  it("returns 'Execution available in' when queued and within execution delay", () => {
    const createdAt = dayjs().subtract(1, "hour")
    const queuedTs = dayjs().unix()
    const proposal: any = {
      createdAt,
      status: "queued",
      statusHistoryMap: [{ status: "queued", timestamp: queuedTs, timestamp_human: "" }]
    }
    const now = dayjs.unix(queuedTs).add(30, "seconds")
    const res = computeTimeline(proposal, baseDao as any, now)
    expect(res.isTimerActive).toBe(true)
    expect(res.timerLabel).toBe("Execution available in")
  })

  it("handles 0-minute voting delay - proposal should be active immediately", () => {
    const daoWithZeroDelay = { votingDelay: 0, votingDuration: 30, executionDelay: 60 }
    const createdAt = dayjs()
    const proposal: any = { createdAt }
    // Current time is exactly at creation time
    const now = createdAt
    const res = computeTimeline(proposal, daoWithZeroDelay as any, now)
    // With 0 delay, voting should be active immediately (not pending)
    expect(res.phase).toBe("voting")
    expect(res.effectiveDisplayStatus).toBe("Active")
    expect(res.isTimerActive).toBe(true)
    expect(res.timerLabel).toBe("Time left to vote")
  })

  it("handles 0-minute voting delay - no pre-voting phase", () => {
    const daoWithZeroDelay = { votingDelay: 0, votingDuration: 30, executionDelay: 60 }
    const createdAt = dayjs()
    const proposal: any = { createdAt }
    // Even 1 second after creation, should still be in voting phase
    const now = createdAt.add(1, "second")
    const res = computeTimeline(proposal, daoWithZeroDelay as any, now)
    expect(res.phase).toBe("voting")
    expect(res.effectiveDisplayStatus).toBe("Active")
  })
})
