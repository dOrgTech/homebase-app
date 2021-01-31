import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";

const rpcNodes = {
  carthagenet: "https://testnet-tezos.giganode.io",
  delphinet: "https://api.tez.ie/rpc/delphinet",
  mainnet: "https://mainnet-tezos.giganode.io",
};

export const connectWithBeacon = async (): Promise<TezosToolkit> => {
  return await new Promise(async (resolve, reject) => {
    const wallet = new BeaconWallet({
      name: "Homebase",
      iconUrl: "https://tezostaquito.io/img/favicon.png",
      eventHandlers: {
        PERMISSION_REQUEST_SUCCESS: {
          handler: (data) => {
            console.log("permission data:", data);

            const network = data.account.network.type as keyof typeof rpcNodes;
            const rpcUrl = rpcNodes[network];
            const tezos = new TezosToolkit(rpcUrl);
            tezos.addExtension(new Tzip16Module());
            tezos.setWalletProvider(wallet);

            resolve(tezos);
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
