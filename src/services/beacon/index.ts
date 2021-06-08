import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Network } from "services/beacon/context";

export const rpcNodes: Record<Network, string> = {
  edo2net: "https://edonet.smartpy.io",
  delphinet: "https://api.tez.ie/rpc/delphinet",
  mainnet: "https://mainnet-tezos.giganode.io",
  florencenet: "https://florencenet.smartpy.io",
};

export const connectWithBeacon = async (
  envNetwork: Network
): Promise<{
  network: Network;
  wallet: BeaconWallet;
}> => {
  let networkType;

  const wallet = new BeaconWallet({
    name: "Homebase",
    iconUrl: "https://tezostaquito.io/img/favicon.png",
  });

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

  const accounts: any[] = JSON.parse(localStorage.getItem("beacon:accounts") as string)

  const network = accounts[0].network.type as Network

  return {
    network,
    wallet
  }
};
