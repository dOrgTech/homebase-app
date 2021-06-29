import { useEffect, useState } from "react";

import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposalsWithStatus } from "./useProposalsWithStatus";

export const useProposal = (
  daoAddress: string | undefined,
  proposalKey: string
) => {
  const [proposal, setProposal] = useState<ProposalWithStatus>();
  const { data, ...rest } = useProposalsWithStatus(daoAddress);

  useEffect(() => {
    if (data && data.length) {
      setProposal(data.find((proposal) => proposal.id === proposalKey));
    }
  }, [data, proposalKey]);

  return { data: proposal, ...rest };
};
