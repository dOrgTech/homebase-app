import { createReducer } from "@reduxjs/toolkit";
import { updateConnectedAccount } from "./action";

export interface AccountState {
  address: string | undefined;
}

export const initialState: AccountState = {
  address: undefined,
};

export default createReducer(initialState, (builder) =>
  builder.addCase(updateConnectedAccount, (state, action) => {
    state.address = action.payload.address;
  })
);
