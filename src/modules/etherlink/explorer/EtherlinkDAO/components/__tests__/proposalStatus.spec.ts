/**
 * @jest-environment node
 */
import dayjs from "dayjs"
import { computeTimeline } from "services/wagmi/etherlink/hooks/timeline"

describe("Proposal Status Display Logic", () => {
  const baseDao = {
    votingDelay: 10, // minutes
    votingDuration: 30, // minutes
    executionDelay: 60 // seconds
  }

  describe("Pending Status", () => {
    it("should show 'Voting starts in' when proposal is pending", () => {
      const createdAt = dayjs()
      const proposal: any = { createdAt }
      const now = createdAt.add(5, "minutes")

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Pending")
      expect(result.timerLabel).toBe("Voting starts in")
      expect(result.isTimerActive).toBe(true)
      expect(result.phase).toBe("preVoting")
    })

    it("should have correct timer target date for pending proposals", () => {
      const createdAt = dayjs()
      const proposal: any = { createdAt }
      const now = createdAt.add(5, "minutes")

      const result = computeTimeline(proposal, baseDao as any, now)
      const expectedTarget = createdAt.add(10, "minutes")

      expect(result.timerTargetDate.unix()).toBe(expectedTarget.unix())
    })
  })

  describe("Active Status", () => {
    it("should show 'Time left to vote' when voting is active", () => {
      const createdAt = dayjs()
      const proposal: any = { createdAt }
      const now = createdAt.add(15, "minutes") // After delay, before voting ends

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Active")
      expect(result.timerLabel).toBe("Time left to vote")
      expect(result.isTimerActive).toBe(true)
      expect(result.phase).toBe("voting")
    })

    it("should have correct timer target for active proposals", () => {
      const createdAt = dayjs()
      const proposal: any = { createdAt }
      const now = createdAt.add(15, "minutes")

      const result = computeTimeline(proposal, baseDao as any, now)
      const expectedTarget = createdAt.add(10, "minutes").add(30, "minutes")

      expect(result.timerTargetDate.unix()).toBe(expectedTarget.unix())
    })
  })

  describe("Succeeded Status", () => {
    it("should show 'Succeeded' when proposal passes after voting ends", () => {
      const createdAt = dayjs().subtract(1, "hour")
      const proposal: any = {
        createdAt,
        inFavor: "1000000",
        against: "100000",
        statusHistoryMap: []
      }
      const now = dayjs()
      const daoWithQuorum = {
        ...baseDao,
        totalSupply: "2000000",
        quorum: "10" // 10% quorum
      }

      const result = computeTimeline(proposal, daoWithQuorum as any, now)

      expect(result.effectiveDisplayStatus).toBe("Succeeded")
      expect(result.phase).toBe("postVoting")
      expect(result.isTimerActive).toBe(false)
    })
  })

  describe("Defeated Status", () => {
    it("should show 'Defeated' when proposal fails", () => {
      const createdAt = dayjs().subtract(1, "hour")
      const proposal: any = {
        createdAt,
        inFavor: "100000",
        against: "1000000",
        statusHistoryMap: []
      }
      const now = dayjs()
      const daoWithQuorum = {
        ...baseDao,
        totalSupply: "2000000",
        quorum: "10"
      }

      const result = computeTimeline(proposal, daoWithQuorum as any, now)

      expect(result.effectiveDisplayStatus).toBe("Defeated")
      expect(result.phase).toBe("postVoting")
      expect(result.isTimerActive).toBe(false)
    })

    it("should default to 'Defeated' when voting ends without quorum data", () => {
      const createdAt = dayjs().subtract(1, "hour")
      const proposal: any = {
        createdAt,
        statusHistoryMap: []
      }
      const now = dayjs()

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Defeated")
      expect(result.phase).toBe("postVoting")
    })
  })

  describe("NoQuorum Status", () => {
    it("should show 'NoQuorum' when proposal doesn't meet quorum threshold", () => {
      const createdAt = dayjs().subtract(1, "hour")
      const proposal: any = {
        createdAt,
        inFavor: "50000",
        against: "40000",
        statusHistoryMap: []
      }
      const now = dayjs()
      const daoWithQuorum = {
        ...baseDao,
        totalSupply: "2000000",
        quorum: "10" // Requires 200000, only got 90000
      }

      const result = computeTimeline(proposal, daoWithQuorum as any, now)

      expect(result.effectiveDisplayStatus).toBe("NoQuorum")
      expect(result.phase).toBe("postVoting")
    })
  })

  describe("Queued Status", () => {
    it("should show 'Queued' with timer when proposal is queued but execution delay hasn't passed", () => {
      const createdAt = dayjs().subtract(1, "hour")
      const queuedTs = dayjs().unix()
      const proposal: any = {
        createdAt,
        status: "queued",
        statusHistoryMap: [{ status: "queued", timestamp: queuedTs, timestamp_human: "" }]
      }
      const now = dayjs.unix(queuedTs).add(30, "seconds") // Halfway through execution delay

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Queued")
      expect(result.timerLabel).toBe("Execution available in")
      expect(result.isTimerActive).toBe(true)
      expect(result.phase).toBe("queuedWait")
    })

    it("should calculate correct execution time for queued proposals", () => {
      const createdAt = dayjs().subtract(1, "hour")
      const queuedTs = dayjs().unix()
      const proposal: any = {
        createdAt,
        status: "queued",
        statusHistoryMap: [{ status: "queued", timestamp: queuedTs, timestamp_human: "" }]
      }
      const now = dayjs.unix(queuedTs).add(30, "seconds")

      const result = computeTimeline(proposal, baseDao as any, now)
      const expectedTarget = dayjs.unix(queuedTs).add(60, "seconds")

      expect(result.timerTargetDate.unix()).toBe(expectedTarget.unix())
    })
  })

  describe("Executable Status", () => {
    it("should show 'Executable' when queued proposal execution delay has passed", () => {
      const createdAt = dayjs().subtract(1, "hour")
      const queuedTs = dayjs().subtract(2, "minutes").unix()
      const proposal: any = {
        createdAt,
        status: "queued",
        statusHistoryMap: [{ status: "queued", timestamp: queuedTs, timestamp_human: "" }]
      }
      const now = dayjs()

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Executable")
      expect(result.phase).toBe("executable")
      expect(result.isTimerActive).toBe(false)
    })
  })

  describe("Executed Status", () => {
    it("should show 'Executed' when proposal has been executed", () => {
      const createdAt = dayjs().subtract(2, "hours")
      const proposal: any = {
        createdAt,
        status: "executed",
        statusHistoryMap: [
          { status: "queued", timestamp: dayjs().subtract(1, "hour").unix(), timestamp_human: "" },
          { status: "executed", timestamp: dayjs().subtract(30, "minutes").unix(), timestamp_human: "" }
        ]
      }
      const now = dayjs()

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Executed")
      expect(result.phase).toBe("executed")
      expect(result.isTimerActive).toBe(false)
    })

    it("should prioritize executed status from history map", () => {
      const createdAt = dayjs().subtract(2, "hours")
      const proposal: any = {
        createdAt,
        status: "queued",
        statusHistoryMap: [{ status: "executed", timestamp: dayjs().unix(), timestamp_human: "" }]
      }
      const now = dayjs()

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Executed")
      expect(result.phase).toBe("executed")
    })
  })

  describe("Edge Cases", () => {
    it("should handle null proposal", () => {
      const result = computeTimeline(null, baseDao as any)

      expect(result.isTimerActive).toBe(false)
      expect(result.timerLabel).toBe("")
      expect(result.phase).toBe("unknown")
      expect(result.effectiveDisplayStatus).toBeUndefined()
    })

    it("should handle null dao", () => {
      const createdAt = dayjs()
      const proposal: any = { createdAt }

      const result = computeTimeline(proposal, null)

      expect(result.isTimerActive).toBe(false)
      expect(result.timerLabel).toBe("")
      expect(result.phase).toBe("unknown")
      expect(result.effectiveDisplayStatus).toBeUndefined()
    })

    it("should handle proposal without createdAt", () => {
      const proposal: any = {}

      const result = computeTimeline(proposal, baseDao as any)

      expect(result.isTimerActive).toBe(false)
      expect(result.timerLabel).toBe("")
      expect(result.phase).toBe("unknown")
      expect(result.effectiveDisplayStatus).toBeUndefined()
    })
  })

  describe("Status Priority", () => {
    it("should prioritize executed status over any other status", () => {
      const createdAt = dayjs()
      const proposal: any = {
        createdAt,
        status: "queued",
        statusHistoryMap: [{ status: "executed", timestamp: dayjs().unix(), timestamp_human: "" }]
      }
      // Even though we're in the middle of voting period
      const now = createdAt.add(20, "minutes")

      const result = computeTimeline(proposal, baseDao as any, now)

      expect(result.effectiveDisplayStatus).toBe("Executed")
      expect(result.phase).toBe("executed")
    })

    it("should handle transition from pending to active correctly", () => {
      const createdAt = dayjs()
      const proposal: any = { createdAt }

      // Just before voting starts
      const beforeActive = createdAt.add(9, "minutes").add(59, "seconds")
      let result = computeTimeline(proposal, baseDao as any, beforeActive)
      expect(result.effectiveDisplayStatus).toBe("Pending")

      // Just after voting starts
      const afterActive = createdAt.add(10, "minutes").add(1, "seconds")
      result = computeTimeline(proposal, baseDao as any, afterActive)
      expect(result.effectiveDisplayStatus).toBe("Active")
    })

    it("should handle transition from active to post-voting correctly", () => {
      const createdAt = dayjs()
      const proposal: any = { createdAt }

      // Just before voting ends
      const beforeEnd = createdAt.add(39, "minutes").add(59, "seconds")
      let result = computeTimeline(proposal, baseDao as any, beforeEnd)
      expect(result.effectiveDisplayStatus).toBe("Active")

      // Just after voting ends
      const afterEnd = createdAt.add(40, "minutes").add(1, "seconds")
      result = computeTimeline(proposal, baseDao as any, afterEnd)
      expect(result.phase).toBe("postVoting")
    })
  })
})
