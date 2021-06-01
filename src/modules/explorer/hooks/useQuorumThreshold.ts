import { useMemo } from "react";
import { BaseDAO } from "services/contracts/baseDAO";

export const useQuorumThreshold = (dao?: BaseDAO) =>
  useMemo(() => {
    if (!dao) {
      return 0;
    }

    return Number(dao.storage.quorumThresholdAtCycle.quorumThreshold);
  }, [dao]);
