import { TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";
import React, { createContext, useReducer } from "react";
import { rpcNodes } from ".";

export type Network = "delphinet" | "mainnet" | "edonet";

interface TezosState {
  network: Network;
  tezos: TezosToolkit;
}

interface TezosProvider {
  state: TezosState;
  dispatch: React.Dispatch<TezosAction>;
}

const Tezos = new TezosToolkit(rpcNodes.delphinet);
Tezos.addExtension(new Tzip16Module());

const INITIAL_STATE: TezosState = {
  tezos: Tezos,
  network: "delphinet",
};

export const TezosContext = createContext<TezosProvider>({
  state: INITIAL_STATE,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});

interface UpdateTezos {
  type: "UPDATE_TEZOS";
  payload: {
    tezos: TezosToolkit;
    network: Network;
  };
}

export type TezosAction = UpdateTezos;

export const reducer = (state: TezosState, action: TezosAction): TezosState => {
  switch (action.type) {
    case "UPDATE_TEZOS":
      return {
        ...state,
        tezos: action.payload.tezos,
        network: action.payload.network,
      };
  }
};

export const TezosProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <TezosContext.Provider value={{ state, dispatch }}>
      {children}
    </TezosContext.Provider>
  );
};
