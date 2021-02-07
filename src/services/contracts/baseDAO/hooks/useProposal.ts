import { ProposalWithStatus } from "../../../bakingBad/proposals/types";
import { useProposals } from "./useProposals";
import { useEffect, useState } from "react";

export const useProposal = (
  daoAddress: string | undefined,
  proposalKey: string
) => {
  const [proposal, setProposal] = useState<ProposalWithStatus>();
  const { data } = useProposals(daoAddress);

  useEffect(() => {
    if (data && data.length) {
      setProposal(data.find((proposal) => proposal.id === proposalKey));
    }
  }, [data, proposalKey]);

  return proposal;
};
