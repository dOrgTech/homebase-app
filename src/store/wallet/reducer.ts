import { createReducer } from "@reduxjs/toolkit";
import { TezosToolkit } from "@taquito/taquito";
import { updateConnectedWallet } from "./action";

export interface WalletState {
  provider: string | undefined;
}

export const initialState: WalletState = {
  provider: undefined,
};

export default createReducer(initialState, (builder) =>
  builder.addCase(updateConnectedWallet, (state, action) => {
    state.provider = action.payload.provider;
    console.log(state);
  })
);
