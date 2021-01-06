import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";

const rpcNodes = {
  carthagenet: "https://testnet-tezos.giganode.io",
  delphinet: "https://delphinet-tezos.giganode.io",
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
        type: NetworkType.DELPHINET,
      },
    });
  });
};
