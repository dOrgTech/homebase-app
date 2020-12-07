import { useDispatch } from "react-redux";
import React, { useCallback, useContext } from "react";
import { connectorsMap, WalletProvider } from "./connectors";
import { AppDispatch } from "..";
import { updateConnectedAccount } from "./action";
import { TezosToolkitContext } from "./context";

export const useConnectWallet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tezosToolkit, setTezosToolkit } = useContext(TezosToolkitContext);

  return {
    tezos: tezosToolkit,
    connect: useCallback(
      async (walletProvider: WalletProvider) => {
        const tezos = await connectorsMap[walletProvider]();
        const account = await tezos.wallet.pkh();

        dispatch(
          updateConnectedAccount({
            address: account,
            provider: walletProvider,
          })
        );

        if (setTezosToolkit) {
          setTezosToolkit(tezos);
        }
      },
      [dispatch, setTezosToolkit]
    ),
  };
};
