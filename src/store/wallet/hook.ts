import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { connectorsMap, WalletProvider } from "./connectors";
import { AppDispatch } from "..";
import { TezosToolkit } from "@taquito/taquito";

export const useConnectWallet = (walletProvider: WalletProvider): TezosToolkit | undefined => {
  const [tezosWithProvider, setTezosWithProvider] = useState<TezosToolkit>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      if (!tezosWithProvider) {
        const provider = await connectorsMap[walletProvider]();
        setTezosWithProvider(provider);
      }
    })();
  }, [dispatch, tezosWithProvider, walletProvider]);

  return tezosWithProvider;
};
