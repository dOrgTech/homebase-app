import { useQuery } from "react-query";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { getDAOProposals } from "..";
import { ProposalWithStatus } from "../../../bakingBad/proposals/types";
import { useDAO } from "./useDAO";
import { DAOItem } from "../types";

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
