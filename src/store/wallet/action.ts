import { createAction } from "@reduxjs/toolkit";
import { WalletProvider } from "./connectors";

export const updateConnectedAccount = createAction<{
  address: string;
  provider: WalletProvider;
}>("account/connect");
