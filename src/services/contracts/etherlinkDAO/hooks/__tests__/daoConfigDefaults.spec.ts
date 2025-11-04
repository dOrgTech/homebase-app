import { computeDaoConfigDefaults } from "../daoConfigDefaults"

describe("computeDaoConfigDefaults", () => {
  it("computes defaults from a populated DAO", () => {
    const dao = {
      quorum: 15,
      votingDelay: 30, // minutes
      votingDuration: 1440, // minutes (1 day)
      proposalThreshold: "1000000000000000000"
    } as any

    const res = computeDaoConfigDefaults(dao)
    expect(res).toEqual({
      quorumNumerator: "15",
      votingDelay: String(30 * 60),
      votingPeriod: String(1440 * 60),
      proposalThreshold: "1000000000000000000"
    })
  })

  it("returns zero-like defaults safely when DAO is missing", () => {
    const res = computeDaoConfigDefaults(undefined)
    expect(res).toEqual({
      quorumNumerator: "0",
      votingDelay: "0",
      votingPeriod: "0",
      proposalThreshold: "0"
    })
  })
})
