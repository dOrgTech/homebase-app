import { TezosToolkit } from "@taquito/taquito";
import React, { createContext, useReducer } from "react";

export type Network = "delphinet" | "mainnet" | "edonet";

interface TezosState {
  network: Network;
  tezos: TezosToolkit | undefined;
}

interface TezosProvider {
  state: TezosState;
  dispatch: React.Dispatch<TezosAction>;
}

const INITIAL_STATE: TezosState = {
  tezos: undefined,
  network: "mainnet",
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
