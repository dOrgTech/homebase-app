import { createReducer } from "@reduxjs/toolkit";
import { updateConnectedAccount } from "./action";
import { WalletProvider } from "./connectors";

export interface AccountState {
  address: string | undefined;
  provider: WalletProvider | undefined;
}

export const initialState: AccountState = {
  address: undefined,
  provider: undefined,
};

export default createReducer(initialState, (builder) =>
  builder.addCase(updateConnectedAccount, (state, action) => {
    state.address = action.payload.address;
    state.provider = action.payload.provider;
  })
);
