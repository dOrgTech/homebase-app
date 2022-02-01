import { Network } from "services/beacon/context";

export interface BlockchainStats {
  id: string;
  network: Network;
  time_between_blocks: number[];
}
