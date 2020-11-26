import { TezosToolkit } from "@taquito/taquito";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { connectToThanos } from "./connectors";
import { updateConnectedWallet } from "./action";
import { WalletState } from "./reducer";
import { AppDispatch } from "..";

export const useConnectWallet = (): string | undefined => {
  const savedTezosToolkit = useSelector<WalletState, string | undefined>(
    (state) => state.provider
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      if (!savedTezosToolkit) {
        const tezos = await connectToThanos();

        dispatch(
          updateConnectedWallet({
            provider: tezos,
          })
        );
      }
    })();
  }, [dispatch, savedTezosToolkit]);

  return savedTezosToolkit;
};
