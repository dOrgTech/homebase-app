export interface FundsInfo {
  receipts: Array<Receipt>;
  description: string;
  fee: number;
}

export interface Receipt {
  recipient: string;
  amount: number | undefined;
}
