import { NetworkType } from "@airgap/beacon-types"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito"
import { Tzip16Module } from "@taquito/tzip16"
import { EnvKey, getEnv } from "services/config"

export type Network = "mainnet" | "ghostnet"

export const ALICE_PRIV_KEY = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"

export const rpcNodes: Record<Network, string> = {
  mainnet: "https://mainnet.api.tez.ie",
  ghostnet: "https://ghostnet.tezos.marigold.dev"
}

export const getTezosNetwork = (): Network => {
  const storageNetwork = window.localStorage.getItem("homebase:network")

  if (storageNetwork) {
    return storageNetwork as Network
  }

  const envNetwork = getEnv(EnvKey.REACT_APP_NETWORK).toString().toLowerCase() as Network

  if (!envNetwork) {
    throw new Error("No Network ENV set")
  }

  window.localStorage.setItem("homebase:network", envNetwork)

  return envNetwork
}

export const createWallet = (network: Network) =>
  new BeaconWallet({
    name: "Homebase",
    iconUrl: "https://tezostaquito.io/img/favicon.png",
    preferredNetwork: network as NetworkType,
    walletConnectOptions: {
      projectId: "1641355e825aeaa926e843dd38b04f6f", // Project ID can be customised
      relayUrl: "wss://relay.walletconnect.com" // WC2 relayUrl can be customised
    }
  })

export const createTezos = (network: Network) => {
  const tezos = new TezosToolkit(rpcNodes[network])
  tezos.setPackerProvider(new MichelCodecPacker())
  tezos.addExtension(new Tzip16Module())
  return tezos
}

export const getNetworkTypeByEnvNetwork = (envNetwork: Network): NetworkType => {
  switch (envNetwork) {
    case "ghostnet":
      return NetworkType.GHOSTNET

    case "mainnet":
      return NetworkType.MAINNET

    default:
      return NetworkType.MAINNET
  }
}

export const connectWithBeacon = async (
  envNetwork: Network
): Promise<{
  network: Network
  wallet: BeaconWallet
}> => {
  const networkType = getNetworkTypeByEnvNetwork(envNetwork)
  const wallet = createWallet(envNetwork)

  await wallet.requestPermissions({
    network: {
      type: networkType
    }
  })

  const accounts: any[] = JSON.parse(localStorage.getItem("beacon:accounts") as string)

  const network = accounts[0].network.type as Network

  return {
    network,
    wallet
  }
}
