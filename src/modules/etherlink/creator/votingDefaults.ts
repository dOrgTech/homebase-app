/**
 * Network-specific default voting and execution timing values for DAO creation.
 * These defaults are applied when creating a new DAO on Etherlink networks.
 */

export interface VotingDefaults {
  voting: {
    votingBlocksDay: number
    votingBlocksHours: number
    votingBlocksMinutes: number
    proposalFlushBlocksDay: number
    proposalFlushBlocksHours: number
    proposalFlushBlocksMinutes: number
    proposalExpiryBlocksDay: number
    proposalExpiryBlocksHours: number
    proposalExpiryBlocksMinutes: number
  }
}

/**
 * Get network-specific voting defaults based on the Etherlink network.
 * @param network - The network identifier ("etherlink_testnet" | "etherlink_mainnet")
 * @returns VotingDefaults object or undefined for unrecognized networks
 */
export function getVotingDefaults(network: string): VotingDefaults | undefined {
  switch (network) {
    case "etherlink_testnet":
      return {
        voting: {
          // Voting Delay: 1 minute
          votingBlocksDay: 0,
          votingBlocksHours: 0,
          votingBlocksMinutes: 1,
          // Voting Duration: 5 minutes
          proposalFlushBlocksDay: 0,
          proposalFlushBlocksHours: 0,
          proposalFlushBlocksMinutes: 2,
          // Execution Delay: 2 minutes
          proposalExpiryBlocksDay: 0,
          proposalExpiryBlocksHours: 0,
          proposalExpiryBlocksMinutes: 2
        }
      }
    case "etherlink_mainnet":
      return {
        voting: {
          // Voting Delay: 3 days
          votingBlocksDay: 3,
          votingBlocksHours: 0,
          votingBlocksMinutes: 0,
          // Voting Duration: 2 days
          proposalFlushBlocksDay: 2,
          proposalFlushBlocksHours: 0,
          proposalFlushBlocksMinutes: 0,
          // Execution Delay: 2 days
          proposalExpiryBlocksDay: 2,
          proposalExpiryBlocksHours: 0,
          proposalExpiryBlocksMinutes: 0
        }
      }
    default:
      return undefined
  }
}
