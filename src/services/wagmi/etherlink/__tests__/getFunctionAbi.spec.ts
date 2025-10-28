jest.mock("modules/etherlink/config", () => ({
  proposalInterfaces: [
    { name: "transferETH", interface: ["function transferETH(address to, uint256 amount)"] },
    { name: "setVotingPeriod", interface: ["function setVotingPeriod(uint32 newVotingPeriod)"] }
  ]
}))

import { getFunctionAbi } from "../getFunctionAbi"
import { ethers } from "ethers"

describe("getFunctionAbi", () => {
  it("recognizes transferETH(address,uint256)", () => {
    const selector = ethers.id("transferETH(address,uint256)").substring(0, 10)
    const res = getFunctionAbi(`${selector}deadbeef`)
    expect(res?.name).toBe("transferETH")
  })

  it("recognizes setVotingPeriod(uint32)", () => {
    const selector = ethers.id("setVotingPeriod(uint32)").substring(0, 10)
    const res = getFunctionAbi(`${selector}00`)
    expect(res?.name).toBe("setVotingPeriod")
  })
})
