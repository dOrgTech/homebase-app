import { TezosToolkit } from "@taquito/taquito";
import { TezBridgeWallet } from "@taquito/tezbridge-wallet";
import { ThanosWallet } from "@thanos-wallet/dapp";

export const connectToThanos = async (
  opts = { forcePermission: false }
): Promise<TezosToolkit> => {
  const available = await ThanosWallet.isAvailable();
  if (!available) {
    throw new Error("Thanos Wallet not installed");
  }

  const wallet = new ThanosWallet("Homebase");
  await wallet.connect("carthagenet", opts);

  const tezos = new TezosToolkit("https://api.tez.ie/rpc/carthagenet");
  tezos.setProvider({ wallet });
  return tezos;
};

export const connectToTezBridge = async () => {
  const tezos = new TezosToolkit("https://api.tez.ie/rpc/carthagenet");
  tezos.setProvider({ wallet: new TezBridgeWallet() });
  return tezos;
};

export const connectorsMap = {
  thanos: connectToThanos,
  tezbridge: connectToTezBridge,
};

export type WalletProvider = keyof typeof connectorsMap;
