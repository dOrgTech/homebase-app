import { useMemo } from "react";
import { useDAO } from "services/indexer/dao/hooks/useDAO";

export const useIsProposalButtonDisabled = (daoAddress?: string) => {
  const { cycleInfo } = useDAO(daoAddress);

  return useMemo(() => {
    if (cycleInfo && cycleInfo.type === "voting") {
      return true;
    }

    return false;
  }, [cycleInfo]);
};
