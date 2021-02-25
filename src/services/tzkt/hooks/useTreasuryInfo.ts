import { useQuery } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { getDAOTransactions } from "..";
import { TransactionInfo } from "../types";

export const useTreasuryInfo = (contractAddress: string) => {
  const { network } = useTezos();

  const result = useQuery<any[], Error>(
    ["treasuryInformation", contractAddress],
    async () => await getDAOTransactions(contractAddress, network)
  );

  return result;
};
