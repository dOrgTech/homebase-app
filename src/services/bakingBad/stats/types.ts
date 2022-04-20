import { Network } from "services/beacon/context";

export interface BlockchainStats {
  id: string;
  network: Network;
  minimal_block_delay: number;
}
