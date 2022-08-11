import { BeaconWallet } from "@taquito/beacon-wallet";
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";
import mixpanel from "mixpanel-browser";
import React, { createContext, useEffect, useReducer } from "react";
import { rpcNodes } from "services/beacon";
import { createTezos, createWallet, getTezosNetwork } from "./utils";

export type Network = "mainnet" | "jakartanet"

interface TezosState {
  network: Network;
  tezos: TezosToolkit;
  account: string;
  wallet: BeaconWallet | undefined;
}

interface TezosProvider {
  state: TezosState;
  dispatch: React.Dispatch<TezosAction>;
}

const getInitialNetwork = (): Network => {
  const storageNetwork = window.localStorage.getItem("homebase:network");

  if (storageNetwork) {
    return storageNetwork as Network;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const envNetwork = process.env
    .REACT_APP_NETWORK!.toString()
    .toLowerCase() as Network;

  if (!envNetwork) {
    throw new Error("No Network ENV set");
  }

  window.localStorage.setItem("homebase:network", envNetwork);

  return envNetwork;
};

const network = getInitialNetwork();
const Tezos = new TezosToolkit(rpcNodes[network]);
Tezos.setPackerProvider(new MichelCodecPacker());
Tezos.addExtension(new Tzip16Module());

const INITIAL_STATE: TezosState = {
  tezos: Tezos,
  network: network,
  account: "",
  wallet: undefined,
};

export const TezosContext = createContext<TezosProvider>({
  state: INITIAL_STATE,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});

const getSavedState = async (): Promise<TezosState> => {
  try {
    const network = getTezosNetwork()
    const tezos = createTezos(network)
    const wallet = createWallet()
    const activeAccount = await wallet.client.getActiveAccount()

    if (!activeAccount?.address) {
      throw new Error ('No wallet address found')
    }

    tezos.setProvider({ wallet });

    return {
      network,
      tezos,
      wallet,
      account: activeAccount.address,
    }
  } catch (error) {
    return INITIAL_STATE
  }
}

interface UpdateTezos {
  type: "UPDATE_TEZOS";
  payload: {
    tezos: TezosToolkit;
    network: Network;
    account: string;
    wallet: BeaconWallet | undefined;
  };
}

interface ResetTezos {
  type: "RESET_TEZOS";
}

export type TezosAction = UpdateTezos | ResetTezos;

export const reducer = (state: TezosState, action: TezosAction): TezosState => {
  switch (action.type) {
    case "UPDATE_TEZOS":
      return {
        ...state,
        tezos: action.payload.tezos,
        network: action.payload.network,
        account: action.payload.account,
        wallet: action.payload.wallet,
      };
    case "RESET_TEZOS":
      return {
        ...state,
        tezos: Tezos,
        account: "",
        wallet: undefined,
      };
  }
};

export const TezosProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    mixpanel.register({ Network: INITIAL_STATE.network });
  }, []);

  useEffect(() => {
    getSavedState()
      .then((tezosState) => {
          dispatch({
            type: "UPDATE_TEZOS",
            payload: tezosState,
          });
      })
  }, [])

  return (
    <TezosContext.Provider value={{ state, dispatch }}>
      {children}
    </TezosContext.Provider>
  );
};
