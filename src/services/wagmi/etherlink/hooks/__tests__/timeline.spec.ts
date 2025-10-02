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
})
