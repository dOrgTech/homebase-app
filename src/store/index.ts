import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";

import wallet from "./wallet/reducer";

import saveDaoInformationReducer from "./dao-info/reducer";

const PERSISTED_KEYS: string[] = [];

const store = configureStore({
  reducer: {
    wallet,
    saveDaoInformationReducer,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
    save({
      states: ["saveDaoInformationReducer"],
      namespace: "saveDaoInformationReducer",
    }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
