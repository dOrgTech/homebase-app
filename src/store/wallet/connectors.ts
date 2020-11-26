import { TezosToolkit } from "@taquito/taquito";
import { ThanosWallet } from "@thanos-wallet/dapp";

export const connectToThanos = async (
  opts = { forcePermission: false }
): Promise<string> => {
  const available = await ThanosWallet.isAvailable();
  if (!available) {
    throw new Error("Thanos Wallet not installed");
  }

  const wallet = new ThanosWallet("Homebase");
  await wallet.connect("carthagenet", opts);
  const tezos = wallet.toTezos();
  return tezos.rpc.getRpcUrl();
};
