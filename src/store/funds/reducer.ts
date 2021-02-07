import { createReducer } from "@reduxjs/toolkit";
import { fundsInformation } from "./action";
import { Receipt } from "./types";

export interface DaoInformation {
  receipts: Array<Receipt>;
  description: string;
  fee: number | undefined;
}

export const initialState: DaoInformation = {
  description: "",
  fee: 0,
  receipts: [{ recipient: "", amount: 0 }],
};

export default createReducer(initialState, (builder) =>
  builder.addCase(fundsInformation, (state, action) => {
    state.description = action.payload.description;
    state.fee = action.payload.fee;
    state.receipts = action.payload.receipts;
  })
);
