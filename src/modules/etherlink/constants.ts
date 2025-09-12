// Etherlink-specific constants

// Contract addresses
export const ETHERLINK_CONSTANTS = {
  // Fallback wrapper address for wrapped tokens
  WRAPPER_W_FALLBACK_ADDRESS: "0xf4B3022b0fb4e8A73082ba9081722d6a276195c2"
} as const

export type EtherlinkConstants = typeof ETHERLINK_CONSTANTS
