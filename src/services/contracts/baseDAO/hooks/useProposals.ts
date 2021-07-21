import { useQuery } from "react-query";
import {
  Proposal,
  ProposalStatus,
} from "services/bakingBad/proposals/types";
import { useDAO } from "services/indexer/dao";
import { BaseDAO } from "..";
import { useCycleInfo } from "./useCycleInfo";
import { useTezos } from "services/beacon/hooks/useTezos";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const useProposals = (
  contractAddress: string | undefined,
  status?: ProposalStatus
) => {
  const { data: dao } = useDAO(contractAddress);
  const { network } = useTezos();

  const cycleInfo = useCycleInfo(contractAddress);

  return useQuery<Proposal[], Error>(
    ["proposals", contractAddress, status],
    async () => (dao as BaseDAO).proposals(network),
    {
      enabled: !!cycleInfo && !!dao,
    }
  );

};
