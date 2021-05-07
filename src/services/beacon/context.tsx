import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";
import React, { createContext, useReducer } from "react";
import { rpcNodes } from "services/beacon";

export type Network = "delphinet" | "mainnet" | "edo2net" | "florencenet"

interface TezosState {
  network: Network;
  tezos: TezosToolkit;
  account: string;
}

interface TezosProvider {
  state: TezosState;
  dispatch: React.Dispatch<TezosAction>;
}

const Tezos = new TezosToolkit(rpcNodes.edo2net);
Tezos.setPackerProvider(new MichelCodecPacker());
Tezos.addExtension(new Tzip16Module());

const INITIAL_STATE: TezosState = {
  tezos: Tezos,
  network: "edo2net",
  account: "",
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
    account: string;
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
      };
    case "RESET_TEZOS":
      return INITIAL_STATE;
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
