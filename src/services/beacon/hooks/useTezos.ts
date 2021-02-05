import { useCallback, useContext, useEffect, useState } from "react";
import { connectWithBeacon } from "..";
import { Network, TezosContext } from "../context";
import { TezosToolkit } from "@taquito/taquito";

type WalletConnectReturn = {
  tezos: TezosToolkit | undefined;
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

  useEffect(() => {
    if (tezos) {
      (async () => {
        const address = await tezos.wallet.pkh();
        setAccount(address);
      })();
    }
  }, [tezos]);

  return {
    tezos: tezos,
    connect: useCallback(async () => {
      const { tezos: toolkit, network } = await connectWithBeacon();

      dispatch({
        type: "UPDATE_TEZOS",
        payload: {
          network,
          tezos: toolkit,
        },
      });

      return toolkit;
    }, [dispatch]),
    account,
    network,
  };
};
