import { useQueryClient } from 'react-query';
import { useCallback, useContext } from "react";
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { connectWithBeacon, rpcNodes } from "services/beacon";
import { Network, TezosContext } from "services/beacon/context";
import { Tzip16Module } from "@taquito/tzip16";

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
    state: { tezos, network, account },
    dispatch,
  } = useContext(TezosContext);

  const queryClient = useQueryClient()

  const connect = useCallback(async (newNetwork?: Network) => {
    const { wallet } = await connectWithBeacon(newNetwork || network);
    tezos.setProvider({ wallet });
    const account = await tezos.wallet.pkh();
    dispatch({
      type: "UPDATE_TEZOS",
      payload: {
        network: newNetwork || network,
        tezos,
        account,
      },
    });

    return tezos;
  }, [dispatch, network, tezos]);

  return {
    tezos,
    connect,
    reset: useCallback(() => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("beacon:")) {
          localStorage.removeItem(key);
        }
      });
      dispatch({
        type: "RESET_TEZOS",
      });
    }, [dispatch]),
    changeNetwork: async (newNetwork: Network) => {
      if (!("_pkh" in tezos.wallet)) {
        const Tezos = new TezosToolkit(rpcNodes[newNetwork]);
        Tezos.setPackerProvider(new MichelCodecPacker());
        Tezos.addExtension(new Tzip16Module());
  
        dispatch({
          type: "UPDATE_TEZOS",
          payload: {
            network: newNetwork,
            tezos: Tezos,
            account,
          },
        });
      } else {
        await connect(newNetwork);
      }
      queryClient.resetQueries()
    },
    account,
    network,
  };
};
