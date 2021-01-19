import { TezosToolkit } from "@taquito/taquito";
import React, { createContext, useState } from "react";

export const TezosToolkitContext = createContext<{
  tezosToolkit: TezosToolkit | undefined;
  setTezosToolkit:
    | React.Dispatch<React.SetStateAction<TezosToolkit | undefined>>
    | undefined;
}>({
  tezosToolkit: undefined,
  setTezosToolkit: undefined,
});

export const TezosToolkitProvider: React.FC = ({ children }) => {
  const [tezosToolkit, setTezosToolkit] = useState<TezosToolkit>();

  return (
    <TezosToolkitContext.Provider value={{ tezosToolkit, setTezosToolkit }}>
      {children}
    </TezosToolkitContext.Provider>
  );
};
