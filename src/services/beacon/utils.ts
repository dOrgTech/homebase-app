import { BeaconWallet } from "@taquito/beacon-wallet";
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";
import { rpcNodes } from "services/beacon";
import { Network } from "./context";

export const getTezosNetwork = (): Network => {
    const storageNetwork = window.localStorage.getItem("homebase:network")
  
    if(storageNetwork) {
      return storageNetwork as Network
    }
  
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const envNetwork = process.env.REACT_APP_NETWORK!.toString().toLowerCase() as Network
  
    if(!envNetwork) {
      throw new Error("No Network ENV set")
    }
  
    window.localStorage.setItem("homebase:network", envNetwork)
  
    return envNetwork
}
  
export const createWallet = () => new BeaconWallet({
    name: "Homebase",
    iconUrl: "https://tezostaquito.io/img/favicon.png",
})
  
export const createTezos = (network: Network) =>  {
    const tezos = new TezosToolkit(rpcNodes[network]);
    tezos.setPackerProvider(new MichelCodecPacker());
    tezos.addExtension(new Tzip16Module());
    return tezos;
}
