import { useQueryClient } from "react-query";
import { useCallback, useContext } from "react";
import { MichelCodecPacker, TezosToolkit, Wallet } from "@taquito/taquito";
import {
  connectWithBeacon,
  Network,
  rpcNodes,
  TezosActionType,
} from "services/beacon";
import { TezosContext } from "services/beacon/context";
import { Tzip16Module } from "@taquito/tzip16";
import mixpanel from "mixpanel-browser";
import { InMemorySigner } from "@taquito/signer";
import { BeaconWallet } from "@taquito/beacon-wallet";

type WalletConnectReturn = {
  tezos: TezosToolkit;
  connect: () => Promise<TezosToolkit>;
  changeNetwork: (newNetwork: Network) => void;
  reset: () => void;
  account: string;
  network: Network;
};

export const useTezos = (): WalletConnectReturn => {
  const {
    state: { tezos, network, account, wallet },
    dispatch,
  } = useContext(TezosContext);

  const queryClient = useQueryClient();

  const connect = useCallback(
    async (newNetwork?: Network) => {
      console.log("newNetwork: ", newNetwork);
      console.log("network: ", network);

      const newTezos = new TezosToolkit(rpcNodes[newNetwork || network]);
      newTezos.setPackerProvider(new MichelCodecPacker());
      newTezos.addExtension(new Tzip16Module());

      let wallet: BeaconWallet | Wallet | undefined;

      if (network !== "devnet") {
        console.log("here");
        const { wallet: beaconWallet } = await connectWithBeacon(
          newNetwork || network
        );
        wallet = beaconWallet;
        console.log("wallet: ", wallet);
        newTezos.setProvider({ wallet });
      } else {
        console.log("here2");
        const signer = await InMemorySigner.fromSecretKey(
          "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
        );
        newTezos.setProvider({ signer });
        wallet = newTezos.wallet;
      }

      const account = await newTezos.wallet.pkh();
      console.log("account: ", account);

      dispatch({
        type: TezosActionType.UPDATE_TEZOS,
        payload: {
          network: newNetwork || network,
          tezos: newTezos,
          account,
          wallet,
        },
      });

      mixpanel.identify(account);

      return newTezos;
    },
    [dispatch, network]
  );

  return {
    tezos,
    connect,
    reset: useCallback(async () => {
      if (!wallet) {
        throw new Error("No Wallet Connected");
      }

      if (wallet instanceof BeaconWallet) {
        await wallet.disconnect();
      }

      dispatch({
        type: TezosActionType.RESET_TEZOS,
      });
    }, [dispatch, wallet]),
    changeNetwork: async (newNetwork: Network) => {
      mixpanel.register({ Network: newNetwork });

      localStorage.setItem("homebase:network", newNetwork);

      if (!("_pkh" in tezos.wallet)) {
        const Tezos = new TezosToolkit(rpcNodes[newNetwork]);
        Tezos.setPackerProvider(new MichelCodecPacker());
        Tezos.addExtension(new Tzip16Module());

        dispatch({
          type: TezosActionType.UPDATE_TEZOS,
          payload: {
            network: newNetwork,
            tezos: Tezos,
            account,
            wallet: undefined,
          },
        });
      } else {
        await connect(newNetwork);
      }
      queryClient.resetQueries();
    },
    account,
    network,
  };
};
