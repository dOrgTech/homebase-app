import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Network } from "services/beacon/context";

export const rpcNodes: Record<Network, string> = {
  edo2net: "https://edonet.smartpy.io",
  delphinet: "https://api.tez.ie/rpc/delphinet",
  mainnet: "https://mainnet-tezos.giganode.io",
};

export const explorerUrls: Record<Network, string> = {
  edo2net: "https://api.edo2net.tzkt.io",
  delphinet: "https://api.delphinet.tzkt.io",
  mainnet: "https://api.tzkt.io/",
};

const networkNameMap = {
  edo2net: "edo2net",
  delphinet: "delphinet",
  mainnet: "mainnet",
  custom: "edo2net",
  edonet: "edo2net",
} as const;

export const connectWithBeacon = async (): Promise<{
  wallet: BeaconWallet;
  network: Network;
}> => {
  return await new Promise(async (resolve) => {
    const wallet = new BeaconWallet({
      name: "Homebase",
      iconUrl: "https://tezostaquito.io/img/favicon.png",
      eventHandlers: {
        ACTIVE_ACCOUNT_SET: {
          handler: (account) => {
            const network = account.network.type;
            resolve({
              wallet,
              network: networkNameMap[network],
            });
          },
        },
      },
    });

    await wallet.requestPermissions({
      network: {
        type: NetworkType.CUSTOM,
        rpcUrl: "https://edonet.smartpy.io",
      },
    });
  });
};
