import { Network } from "services/beacon";

export const API_URL = "https://api.better-call.dev/v1";

export const networkNameMap: Record<Network, string> = {
  mainnet: "mainnet",
  ithacanet: "ghostnet",
  devnet: "ghostnet",
};
