import { useQuery } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { getDAOTransactions } from "services/tzkt";
import { TransactionInfo } from "services/tzkt/types";

export const useTreasuryInfo = (contractAddress: string) => {
  const { network } = useTezos();

  const result = useQuery<TransactionInfo[], Error>(
    ["treasuryInformation", contractAddress],
    async () => await getDAOTransactions(contractAddress, network)
  );
  console.log(result);
  return result;
};
