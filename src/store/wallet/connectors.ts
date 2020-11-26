import { TezosToolkit } from "@taquito/taquito";
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
  return wallet.toTezos();
};

export const connectorsMap = {
  thanos: connectToThanos,
};

export type WalletProvider = keyof typeof connectorsMap;
