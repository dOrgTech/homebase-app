import {
  canonicalPtypes,
  canonicalStatuses,
  canonicalType,
  displayStatusFromKey,
  parseFiltersFromSearch,
  serializeFiltersToSearch
} from "modules/etherlink/explorer/filters/queryFilters"

describe("queryFilters helpers", () => {
  test("canonical type", () => {
    expect(canonicalType(undefined)).toBe("onchain")
    expect(canonicalType("OFFCHAIN")).toBe("offchain")
    expect(canonicalType("something")).toBe("onchain")
  })

  test("canonical statuses (onchain)", () => {
    expect(canonicalStatuses(undefined, "onchain")).toEqual(["all"])
    expect(canonicalStatuses("active", "onchain")).toEqual(["active"])
    expect(canonicalStatuses("passed,failed,no quorum", "onchain")).toEqual(["succeeded", "defeated", "no-quorum"])
    expect(canonicalStatuses("noquorum", "onchain")).toEqual(["no-quorum"])
  })

  test("canonical statuses (offchain)", () => {
    expect(canonicalStatuses("active", "offchain")).toEqual(["active"])
    // unknown offchain values collapse to 'closed'
    expect(canonicalStatuses("executed", "offchain")).toEqual(["closed"])
    expect(canonicalStatuses("closed,active", "offchain")).toEqual(["active", "closed"])
  })

  test("canonical ptypes and alias expansion", () => {
    expect(canonicalPtypes(undefined)).toEqual([])
    expect(canonicalPtypes("registry,contract_call,voting period")).toEqual([
      "contract-call",
      "registry",
      "voting-period"
    ]) // sorted later when serializing
    expect(canonicalPtypes("token")).toEqual(["mint", "burn"])
  })

  test("display mapping", () => {
    expect(displayStatusFromKey("succeeded")).toBe("Succeeded")
    expect(displayStatusFromKey("no-quorum")).toBe("NoQuorum")
  })

  test("parse and serialize roundtrip", () => {
    const search = "type=onchain&status=active,queued&ptype=transfer,contract-call&author=0xabc"
    const parsed = parseFiltersFromSearch(search)
    expect(parsed.type).toBe("onchain")
    expect(parsed.status).toEqual(["active", "queued"])
    expect(parsed.ptype.sort()).toEqual(["contract-call", "transfer"])
    const out = serializeFiltersToSearch(parsed, search)
    // author preserved in prevSearch
    expect(out).toContain("author=0xabc")
    expect(out).toContain("status=active%2Cqueued")
    expect(out).toContain("ptype=contract-call%2Ctransfer")
  })
})
