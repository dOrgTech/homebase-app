import { useCallback, useContext, useEffect, useState } from "react";
import { connectWithBeacon } from "..";
import { Network, TezosContext } from "../context";
import { TezosToolkit } from "@taquito/taquito";

type WalletConnectReturn = {
  tezos: TezosToolkit;
  connect: () => Promise<TezosToolkit>;
  account: string | undefined;
  network: Network;
};

export const useTezos = (): WalletConnectReturn => {
  const [account, setAccount] = useState<string>();

  const {
    state: { tezos, network },
    dispatch,
  } = useContext(TezosContext);

  return {
    tezos,
    connect: useCallback(async () => {
      const { wallet } = await connectWithBeacon();
      tezos.setProvider({ wallet });

      const address = await tezos.wallet.pkh();
      setAccount(address);

      dispatch({
        type: "UPDATE_TEZOS",
        payload: {
          network,
          tezos,
        },
      });

      return tezos;
    }, [dispatch]),
    account,
    network,
  };
};
