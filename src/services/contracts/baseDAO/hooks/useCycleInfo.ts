import { useMemo, useState, useEffect, useContext } from "react";
import { CycleInfo } from "..";
import { useDAO } from "services/indexer/dao/hooks/useDAO";
import { TZKTSubscriptionsContext } from "services/bakingBad/context/TZKTSubscriptions";

export const useCycleInfo = (daoAddress?: string) => {
  const { data: dao } = useDAO(daoAddress);
  const [blocksLeft, setBlocksLeft] = useState<CycleInfo>();
  const { state: { block }} = useContext(TZKTSubscriptionsContext)

  useEffect(() => {
    if (dao) {
      const blocksFromStart = block - dao.data.start_level;
      const periodsFromStart = Math.floor(blocksFromStart / Number(dao.data.period));
      const type =
        periodsFromStart % 2 == 0 ? "voting" : "proposing";
      const blocksLeft =
        Number(dao.data.period) -
        (blocksFromStart % Number(dao.data.period));

      setBlocksLeft({
        blocksLeft,
        type,
        currentCycle: periodsFromStart,
        currentLevel: block
      });

    }
  }, [dao, block]);

  return blocksLeft;
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
