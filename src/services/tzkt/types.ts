export interface Account {
  address: string;
}

export interface TransactionDTO {
  amount: number;
  sender: Account;
  target: Account;
  parameters?: string;
  block: string;
  timestamp: string;
}

export interface TransactionInfo {
  amount: number;
  recipient: string;
  timestamp: string;
  name: string;
}
