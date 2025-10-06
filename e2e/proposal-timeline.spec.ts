import { test, expect } from "@playwright/test"
import dayjs from "dayjs"
import { computeTimeline } from "../src/services/wagmi/etherlink/hooks/timeline"

test.describe("proposal timeline transitions (logic)", () => {
  test("pending → active → voting end; queued → executable label", async () => {
    const daoSelected = { votingDelay: 1, votingDuration: 2, executionDelay: 60 } // minutes, minutes, seconds
    const createdAt = dayjs("2025-01-01T00:00:00Z")

    // Before active start
    let res = computeTimeline({ createdAt, status: "pending", statusHistoryMap: [] } as any, daoSelected as any, createdAt.subtract(10, "second"))
    expect(res.isTimerActive).toBeTruthy()
    expect(res.timerLabel).toBe("Voting starts in")

    // During voting window
    const duringVoting = createdAt.add(1, "minute").add(10, "second")
    res = computeTimeline({ createdAt, status: "active", statusHistoryMap: [] } as any, daoSelected as any, duringVoting)
    expect(res.isTimerActive).toBeTruthy()
    expect(res.timerLabel).toBe("Time left to vote")

    // After voting ended; no queued status → no timer
    const afterEnd = createdAt.add(3, "minute").add(1, "second")
    res = computeTimeline({ createdAt, status: "passed", statusHistoryMap: [] } as any, daoSelected as any, afterEnd)
    expect(res.isTimerActive).toBeFalsy()

    // If queued with execution delay in the future → show execution countdown
    const queuedTs = createdAt.add(3, "minute").unix()
    const nowBeforeExec = createdAt.add(3, "minute").add(30, "second")
    res = computeTimeline(
      { createdAt, status: "queued", statusHistoryMap: [{ status: "queued", timestamp: queuedTs, timestamp_human: "" }] } as any,
      daoSelected as any,
      nowBeforeExec
    )
    expect(res.isTimerActive).toBeTruthy()
    expect(res.timerLabel).toBe("Execution available in")
  })
})

