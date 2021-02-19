import { useQuery } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { getDAOProposals } from "services/contracts/baseDAO";
import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { DAOItem } from "services/contracts/baseDAO/types";

export const useProposals = (contractAddress: string | undefined) => {
  const { network } = useTezos();
  const { data: daoData } = useDAO(contractAddress);

  const result = useQuery<ProposalWithStatus[], Error>(
    ["proposals", contractAddress],
    () => getDAOProposals(daoData as DAOItem, network),
    {
      enabled: !!daoData,
    }
  );

  return result;
};
