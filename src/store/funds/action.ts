import { createAction } from "@reduxjs/toolkit";
import { Receipt } from "./types";

export const fundsInformation = createAction<{
  receipts: Array<Receipt>;
  description: string;
  fee: number;
}>("dao/fundsInformation");
