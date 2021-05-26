import { useMemo } from "react";
import { BaseDAO } from "services/contracts/baseDAO";

export const useQuorumTreshold = (dao?: BaseDAO) =>
  useMemo(() => {
    if (!dao) {
      return 0;
    }

    return Number(dao.storage.quorumTresholdAtCycle.quorumTreshold);
  }, [dao]);
