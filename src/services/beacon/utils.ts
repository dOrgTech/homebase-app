import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";

export type Network = "mainnet" | "ithacanet" | "devnet";

export const rpcNodes: Record<Network, string> = {
  mainnet: "https://mainnet.smartpy.io",
  ithacanet: "https://ithacanet.smartpy.io",
  devnet: "http://localhost:20000",
};

export const getTezosNetwork = (): Network => {
  const storageNetwork = window.localStorage.getItem("homebase:network");

  if (storageNetwork) {
    return storageNetwork as Network;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const envNetwork = process.env
    .REACT_APP_NETWORK!.toString()
    .toLowerCase() as Network;

  if (!envNetwork) {
    throw new Error("No Network ENV set");
  }

  window.localStorage.setItem("homebase:network", envNetwork);

  return envNetwork;
};

export const createWallet = () =>
  new BeaconWallet({
    name: "Homebase",
    iconUrl: "https://tezostaquito.io/img/favicon.png",
  });

export const createTezos = (network: Network) => {
  const tezos = new TezosToolkit(rpcNodes[network]);
  tezos.setPackerProvider(new MichelCodecPacker());
  tezos.addExtension(new Tzip16Module());
  return tezos;
};

export const getNetworkTypeByEnvNetwork = (
  envNetwork: Network
): NetworkType => {
  switch (envNetwork) {
    case "ithacanet":
      return NetworkType.ITHACANET;

    case "mainnet":
      return NetworkType.MAINNET;

    default:
      return NetworkType.MAINNET;
  }
};

export const connectWithBeacon = async (
  envNetwork: Network
): Promise<{
  network: Network;
  wallet: BeaconWallet;
}> => {
  const networkType = getNetworkTypeByEnvNetwork(envNetwork);
  const wallet = createWallet();

  await wallet.requestPermissions({
    network: {
      type: networkType,
    },
  });

  const accounts: any[] = JSON.parse(
    localStorage.getItem("beacon:accounts") as string
  );

  const network = accounts[0].network.type as Network;

  return {
    network,
    wallet,
  };
};
