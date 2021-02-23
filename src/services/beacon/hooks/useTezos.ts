import { useCallback, useContext } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { connectWithBeacon } from "services/beacon";
import { Network, TezosContext } from "services/beacon/context";

type WalletConnectReturn = {
  tezos: TezosToolkit;
  connect: () => Promise<TezosToolkit>;
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

    account,
    network,
  };
};
