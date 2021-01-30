import { useDispatch } from "react-redux";
import { useCallback, useContext } from "react";
import { connectWithBeacon } from "./connectors";
import { AppDispatch } from "..";
import { updateConnectedAccount } from "./action";
import { TezosToolkitContext } from "./context";
import { TezosToolkit } from "@taquito/taquito";

type WalletConnectReturn = {
  tezos: TezosToolkit | undefined;
  connect: () => void;
};

export const useConnectWallet = (): WalletConnectReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { tezosToolkit, setTezosToolkit } = useContext(TezosToolkitContext);

  return {
    tezos: tezosToolkit,
    connect: useCallback(async () => {
      const tezos = await connectWithBeacon();
      const account = await tezos.wallet.pkh();

      dispatch(
        updateConnectedAccount({
          address: account,
        })
      );

      if (setTezosToolkit) {
        setTezosToolkit(tezos);
      }
    }, [dispatch, setTezosToolkit]),
  };
};
