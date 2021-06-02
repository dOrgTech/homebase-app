import { calculateCycleInfo } from "./../utils";
import { useEffect, useMemo, useState } from "react";
import { useDAO } from "./useDAO";
import { CycleInfo } from "..";

export const useCycleInfo = (daoAddress?: string) => {
  const { data: dao } = useDAO(daoAddress);
  const [timeLeft, setTimeLeft] = useState<CycleInfo>();

  useEffect(() => {
    if (dao) {
      const result = calculateCycleInfo(
        dao.storage.start_time,
        dao.storage.votingPeriod
      );
      setTimeLeft(result);

      const interval = setInterval(() => {
        const result = calculateCycleInfo(
          dao.storage.start_time,
          dao.storage.votingPeriod
        );
        setTimeLeft(result);
      }, 1000);
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
