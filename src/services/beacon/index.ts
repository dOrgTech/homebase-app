import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Network } from "services/beacon/context";

export const rpcNodes: Record<Network, string> = {
  edo2net: "https://edonet.smartpy.io",
  delphinet: "https://api.tez.ie/rpc/delphinet",
  mainnet: "https://mainnet-tezos.giganode.io",
  florencenet: "https://florencenet.smartpy.io",
};

const networkNameMap = {
  edo2net: "edo2net",
  delphinet: "delphinet",
  mainnet: "mainnet",
  custom: "florencenet",
  edonet: "edo2net",
  florencenet: "florencenet",
} as const;

export const connectWithBeacon = async (envNetwork: Network): Promise<{
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

    let networkType;

    switch (envNetwork) {
      case "edo2net":
        networkType = NetworkType.EDONET;
        break;

      case "delphinet":
        networkType = NetworkType.DELPHINET;
        break;

      case "florencenet":
        networkType = NetworkType.FLORENCENET;
        break;

      case "mainnet":
        networkType = NetworkType.MAINNET;
        break;

      default:
        networkType = NetworkType.FLORENCENET;
        break;
    }

    await wallet.requestPermissions({
      network: {
        type: networkType,
      },
    });
  });
};
