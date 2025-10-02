import { ethers } from "ethers"
import { proposalInterfaces } from "modules/etherlink/config"

export const getFunctionAbi = (callData: string): any => {
  const callDataSelector = (callData || "").substring(0, 10)

  // Transfers
  const transferEthSelector = ethers.id("transferETH(address,uint256)").substring(0, 10)
  const transferErc20Selector = ethers.id("transferERC20(address,address,uint256)").substring(0, 10)
  const transferErc721Selector = ethers.id("transferERC721(address,address,uint256)").substring(0, 10)
  if (callDataSelector === transferEthSelector) {
    return proposalInterfaces.find((x: any) => x.name === "transferETH")
  } else if (callDataSelector === transferErc20Selector) {
    return proposalInterfaces.find((x: any) => x.name === "transferERC20")
  } else if (callDataSelector === transferErc721Selector) {
    return proposalInterfaces.find((x: any) => x.name === "transferERC721")
  }

  // DAO Config
  const updateQuorumSelector = ethers.id("updateQuorumNumerator(uint256)").substring(0, 10)
  const setVotingDelaySelector = ethers.id("setVotingDelay(uint48)").substring(0, 10)
  const setVotingPeriodSelector = ethers.id("setVotingPeriod(uint32)").substring(0, 10)
  const setProposalThresholdSelector = ethers.id("setProposalThreshold(uint256)").substring(0, 10)
  if (callDataSelector === updateQuorumSelector) {
    return proposalInterfaces.find((x: any) => x.name === "updateQuorumNumerator")
  } else if (callDataSelector === setVotingDelaySelector) {
    return proposalInterfaces.find((x: any) => x.name === "setVotingDelay")
  } else if (callDataSelector === setVotingPeriodSelector) {
    return proposalInterfaces.find((x: any) => x.name === "setVotingPeriod")
  } else if (callDataSelector === setProposalThresholdSelector) {
    return proposalInterfaces.find((x: any) => x.name === "setProposalThreshold")
  }

  // Registry
  const editRegistrySelector = ethers.id("editRegistry(string,string)").substring(0, 10)
  if (callDataSelector === editRegistrySelector) {
    return proposalInterfaces.find((x: any) => x.name === "editRegistry")
  }

  // Token ops: mint/burn variants
  const mintSelector = ethers.id("mint(address,uint256)").substring(0, 10)
  const burnSelector = ethers.id("burn(address,uint256)").substring(0, 10)
  const burnFromSelector = ethers.id("burnFrom(address,uint256)").substring(0, 10)
  const burnSimpleSelector = ethers.id("burn(uint256)").substring(0, 10)
  if (callDataSelector === mintSelector) {
    return proposalInterfaces.find((x: any) => x.name === "mint")
  } else if (callDataSelector === burnSelector) {
    // choose the burn(address,uint256) entry
    return proposalInterfaces.find((x: any) => x.name === "burn" && x.interface?.[0]?.includes("burn(address"))
  } else if (callDataSelector === burnFromSelector) {
    return proposalInterfaces.find((x: any) => x.name === "burnFrom")
  } else if (callDataSelector === burnSimpleSelector) {
    // choose the burn(uint256) entry
    return proposalInterfaces.find((x: any) => x.name === "burn" && x.interface?.[0]?.includes("burn(uint256"))
  }

  return {}
}
