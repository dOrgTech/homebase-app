import { useEffect, useState } from "react";

import { ProposalWithStatus } from "services/bakingBad/proposals/types";
import { useProposals } from "services/contracts/baseDAO/hooks/useProposals";

export const useProposal = (
  daoAddress: string | undefined,
  proposalKey: string
) => {
  const [proposal, setProposal] = useState<ProposalWithStatus>();
  const { data, ...rest } = useProposals(daoAddress);

  useEffect(() => {
    if (data && data.length) {
      setProposal(data.find((proposal) => proposal.id === proposalKey));
    }
  }, [data, proposalKey]);

  return { data: proposal, ...rest };
};
