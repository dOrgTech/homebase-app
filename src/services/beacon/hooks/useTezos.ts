import { useCallback, useContext } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { connectWithBeacon } from "services/beacon";
import { Network, TezosContext } from "services/beacon/context";

type WalletConnectReturn = {
  tezos: TezosToolkit;
  connect: () => Promise<TezosToolkit>;
  reset: () => void;
  account: string;
  network: Network;
};

export const useTezos = (): WalletConnectReturn => {
  const {
    state: { tezos, network, account },
    dispatch,
  } = useContext(TezosContext);

  return {
    tezos,
    connect: useCallback(async () => {
      const { wallet, network } = await connectWithBeacon();
      tezos.setProvider({ wallet });
      const account = await tezos.wallet.pkh();
      dispatch({
        type: "UPDATE_TEZOS",
        payload: {
          network,
          tezos,
          account,
        },
      });

      return tezos;
    }, [dispatch, tezos]),
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
    account,
    network,
  };
};
