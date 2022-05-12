import { BeaconWallet } from "@taquito/beacon-wallet";
import { Network } from "services/beacon/context";
import { createWallet, getNetworkTypeByEnvNetwork} from 'services/beacon/utils';

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

  const accounts: any[] = JSON.parse(localStorage.getItem("beacon:accounts") as string)

  const network = accounts[0].network.type as Network

  return {
    network,
    wallet
  }
};

export * from './utils'
