import { calculateCycleInfo } from './../utils';
import { useEffect, useState } from "react";
import { useDAO } from "./useDAO";
import { CycleInfo } from "..";

export const useCycleInfo = (daoAddress: string) => {
  const { data: dao } = useDAO(daoAddress);
  const [timeLeft, setTimeLeft] = useState<CycleInfo>();

  useEffect(() => {
    if (dao) {
      const interval = setInterval(() => {
        const result = calculateCycleInfo(
          dao.storage.lastPeriodChange.timestamp,
          dao.storage.votingPeriod,
          dao.storage.lastPeriodChange.periodNumber
        );
        setTimeLeft(result);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dao]);

  return timeLeft;
};
