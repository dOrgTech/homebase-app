import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Network } from "./context";

export const rpcNodes: Record<Network, string> = {
  edonet: "https://edonet-tezos.giganode.io",
  delphinet: "https://api.tez.ie/rpc/delphinet",
  mainnet: "https://mainnet-tezos.giganode.io",
};

export const connectWithBeacon = async (): Promise<{
  wallet: BeaconWallet;
}> => {
  return await new Promise(async (resolve, reject) => {
    const wallet = new BeaconWallet({
      name: "Homebase",
      iconUrl: "https://tezostaquito.io/img/favicon.png",
      eventHandlers: {
        PERMISSION_REQUEST_SUCCESS: {
          handler: (data) => {
            console.log("permission data:", data);
            resolve({ wallet });
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
        type: NetworkType.DELPHINET as any,
      },
    });
  });
};
