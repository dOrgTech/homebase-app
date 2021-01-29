import { createReducer } from "@reduxjs/toolkit";
import { saveDaos } from "./action";

export const initialState: { daos: string[] } = {
  daos: [],
};

export default createReducer(initialState, (builder) =>
  builder.addCase(saveDaos, (state, action) => {
    state.daos = action.payload.daos;
  })
);
