import { NetworkType } from "@airgap/beacon-types";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Network } from "services/beacon/context";

export const rpcNodes: Record<Network, string> = {
  mainnet: "https://mainnet.smartpy.io",
  jakartanet: "https://jakartanet.smartpy.io",
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
    case "jakartanet":
      networkType = NetworkType.JAKARTANET;
      break;

    case "mainnet":
      networkType = NetworkType.MAINNET;
      break;

    default:
      networkType = NetworkType.MAINNET;
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
