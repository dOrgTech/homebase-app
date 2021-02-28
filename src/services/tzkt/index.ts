import { explorerUrls } from "services/beacon";
import { Network } from "services/beacon/context";
import { TransactionDTO, TransactionInfo } from "services/tzkt/types";

export const getDAOTransactions = async (address: string, network: Network) => {
  const API_URL = explorerUrls[network];
  const url = `${API_URL}/v1/accounts/${address}/operations`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch transaction from Tzkt API");
  }

  const result: TransactionDTO[] = await response.json();
  return sanitizeTransaction(result, address);
};

const sanitizeTransaction = (
  transactions: TransactionDTO[],
  daoAddress: string
): TransactionInfo[] => {
  const filteredTransactions = transactions.filter(
    ({ amount, sender, parameters }) =>
      !parameters && amount && sender.address === daoAddress
  );

  return filteredTransactions.map(({ amount, target, timestamp }) => ({
    amount: amount / 1e6,
    recipient: target.address,
    timestamp,
    name: "XTZ",
  }));
};
