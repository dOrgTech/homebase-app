import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Network } from "services/beacon/context";

export const rpcNodes: Record<Network, string> = {
  mainnet: "https://mainnet.smartpy.io",
  hangzhounet: "https://hangzhounet.smartpy.io",
  ithacanet: "https://ithacanet.smartpy.io"
};

export enum EnvNetWork {
  hangzhounet = "hangzhounet",
  ithacanet = "ithacanet",
  mainnet = "mainnet"
}

export const createWallet = () => new BeaconWallet({
  name: "Homebase",
  iconUrl: "https://tezostaquito.io/img/favicon.png",
})

export const getNetworkTypeByEnvNetwork = (envNetwork: Network): NetworkType => {
    switch (envNetwork) {
    case EnvNetWork.hangzhounet:
      return NetworkType.HANGZHOUNET;

    case EnvNetWork.ithacanet:
      return NetworkType.ITHACANET;

    case EnvNetWork.mainnet:
      return NetworkType.MAINNET;

    default:
      return NetworkType.MAINNET;
  }
}
