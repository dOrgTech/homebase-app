import { calculateCycleInfo } from "./../utils";
import { useEffect, useMemo, useState } from "react";
import { CycleInfo } from "..";
import { useDAO } from "services/indexer/dao/hooks/useDAO";

export const useCycleInfo = (daoAddress?: string) => {
  const { data: dao } = useDAO(daoAddress);
  const [timeLeft, setTimeLeft] = useState<CycleInfo>();

  useEffect(() => {
    if (dao) {
      const result = calculateCycleInfo(
        dao.data.start_time,
        Number(dao.data.period)
      );
      setTimeLeft(result);

      const interval = setInterval(() => {
        const result = calculateCycleInfo(
          dao.data.start_time,
          Number(dao.data.period)
        );
        setTimeLeft(result);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dao]);

  return timeLeft;
};

export const useIsProposalButtonDisabled = (daoAddress?: string) => {
  const cycleInfo = useCycleInfo(daoAddress);

  return useMemo(() => {
    if (cycleInfo && cycleInfo.type === "voting") {
      return true;
    }

    return false;
  }, [cycleInfo]);
};
