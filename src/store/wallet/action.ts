import { createAction } from "@reduxjs/toolkit";

export const updateConnectedWallet = createAction<{ provider: any }>(
  "wallet/connect"
);
