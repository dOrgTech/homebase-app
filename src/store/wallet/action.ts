import { createAction } from "@reduxjs/toolkit";

export const updateConnectedAccount = createAction<{
  address: string;
}>("account/connect");
