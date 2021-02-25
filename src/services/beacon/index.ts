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

export const connectWithBeacon = async (): Promise<{
  wallet: BeaconWallet;
  network: Network;
}> => {
  return await new Promise(async (resolve, reject) => {
    const wallet = new BeaconWallet({
      name: "Homebase",
      iconUrl: "https://tezostaquito.io/img/favicon.png",
      eventHandlers: {
        PERMISSION_REQUEST_SUCCESS: {
          handler: (data) => {
            console.log("permission data:", data);
            const network = data.account.network.type as keyof typeof rpcNodes;
            resolve({ wallet, network });
          },
        },
        PERMISSION_REQUEST_ERROR: {
          handler: () => {
            reject("Permission request error");
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
