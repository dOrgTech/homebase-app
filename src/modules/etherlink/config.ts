import { EvmDaoRegistry } from "./creator/EvmDaoRegistry"
import { EvmDaoBasics } from "./creator/EvmDaoBasics"
import { EvmDaoMembership } from "./creator/EvmDaoMembership"
import { EvmDaoQuorum } from "./creator/EvmDaoQuorum"
import { EvmDaoSummary } from "./creator/EvmDaoSummary"
import { EvmDaoVoting } from "./creator/EvmDaoVoting"
import { EvmDaoTemplate } from "./creator/EvmDaoTemplate"

export const STEPS = [
  { title: "DAO Template", index: 0, path: "template", component: EvmDaoTemplate },
  { title: "DAO Basics", index: 1, path: "dao", component: EvmDaoBasics },
  { title: "Proposals & Voting", index: 2, path: "voting", component: EvmDaoVoting },
  { title: "Quorum", index: 3, path: "quorum", component: EvmDaoQuorum },
  { title: "Membership", index: 4, path: "membership", component: EvmDaoMembership },
  { title: "Registry", index: 5, path: "registry", component: EvmDaoRegistry },
  { title: "Review & Deploy", index: 6, path: "summary", component: EvmDaoSummary }
]

export const EvmProposalOptions = [
  {
    label: "Off-Chain Debate",
    description: "Post a thesis and have tokenized arguments around it",
    modal: "off_chain_debate",
    proposal_type: () => "off_chain_debate",
    last_step: 2,
    interface: {}
  },
  {
    label: "Transfer Assets",
    description: "Propose a transfer of assets from the DAO treasury",
    modal: "transfer_assets",
    proposal_type: () => "transfer",
    last_step: 2,
    interface: {
      transferETH: {
        interface: ["function transferETH(address to, uint256 amount)"],
        name: "transferETH"
      }
    }
  },
  {
    label: "Edit Registry",
    description: "Change an entry or add a new one",
    modal: "edit_registry",
    proposal_type: () => "registry",
    last_step: 2,
    interface: {
      editRegistry: {
        interface: ["function editRegistry(string key, string Value)"],
        name: "editRegistry"
      }
    }
  },
  {
    label: "Contract Call",
    description: "Propose a call to an external contract",
    modal: "contract_call",
    last_step: 2,
    proposal_type: () => "contract call"
  },
  {
    label: "Change Config",
    description: "Propose changes to the DAO configuration",
    modal: "change_config",
    proposal_type: (type: "quorum" | "voting delay" | "voting period" | "proposal threshold") => `${type}`,
    last_step: 3,
    interface: {
      updateQuorumNumerator: {
        interface: ["function updateQuorumNumerator(uint256 newQuorumNumerator)"],
        name: "updateQuorumNumerator"
      },
      setVotingDelay: {
        interface: ["function setVotingDelay(uint256 newVotingDelay)"],
        name: "setVotingDelay"
      },
      setVotingPeriod: {
        interface: ["function setVotingPeriod(uint256 newVotingPeriod)"],
        name: "setVotingPeriod"
      },
      setProposalThreshold: {
        interface: ["function setProposalThreshold(uint256 newProposalThreshold)"],
        name: "setProposalThreshold"
      }
    }
  },
  {
    label: "Token Operation",
    description: "Propose a token operation",
    modal: "token_operation",
    proposal_type: (type: "Burn" | "Mint", tokenSymbol: string) => `${type}${tokenSymbol}`,
    last_step: 3,
    interface: {
      mint: {
        interface: ["function mint(address to, uint256 amount)"],
        name: "mint"
      },
      burn: {
        interface: ["function burn(address from, uint256 amount)"],
        name: "burn"
      }
    }
  }
]

// TODO: Ensure tags are unique
export const proposalInterfaces = [
  {
    tags: ["registry"],
    interface: ["function editRegistry(string key, string Value)"],
    name: "editRegistry"
  },
  {
    tags: ["token"],
    interface: ["function mint(address to, uint256 amount)"],
    name: "mint"
  },
  {
    tags: ["token"],
    interface: ["function burn(address from, uint256 amount)"],
    name: "burn"
  },
  {
    tags: ["transfer"],
    interface: ["function transferETH(address to, uint256 amount)"],
    name: "transferETH"
  },
  {
    tags: ["token", "mint", "burn"],
    interface: ["function transferERC20(address token, address to, uint256 amount)"],
    name: "transferERC20"
  },
  {
    tags: ["token"],
    interface: ["function transferERC721(address token, address to, uint256 tokenId)"],
    name: "transferERC721"
  },
  {
    tags: ["quorum"],
    label: "Update Quorum",
    unit: "%",
    interface: ["function updateQuorumNumerator(uint256 newQuorumNumerator)"],
    name: "updateQuorumNumerator"
  },
  {
    tags: ["voting delay"],
    label: "Update Voting Delay",
    unit: "seconds",
    interface: ["function setVotingDelay(uint256 newVotingDelay)"],
    name: "setVotingDelay"
  },
  {
    tags: ["voting period"],
    label: "Update Voting Period",
    unit: "seconds",
    interface: ["function setVotingPeriod(uint256 newVotingPeriod)"],
    name: "setVotingPeriod"
  },
  {
    tags: ["proposal threshold"],
    label: "Update Proposal Threshold",
    unit: "tokens",
    interface: ["function setProposalThreshold(uint256 newProposalThreshold)"],
    name: "setProposalThreshold"
  }
]

export const EVM_PROPOSAL_CHOICES = [
  {
    name: "For",
    pollID: "1",
    walletAddresses: [],
    selected: true
  },
  {
    name: "Against",
    pollID: "2",
    walletAddresses: [],
    selected: false
  }
]

export const urlToStepMap: Record<string, number> = {
  template: 0,
  dao: 1,
  voting: 2,
  quorum: 3,
  summary: 4,
  type: 5,
  review: 6
}
