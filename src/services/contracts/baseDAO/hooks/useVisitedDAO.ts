import useLocalStorage from "modules/common/hooks/useLocalStorage";
import { useCallback } from "react";

export const useVisitedDAO = () => {
    const [ daoId, setDaoId ] = useLocalStorage("daoId", "");
    const [ daoSymbol, setDaoSymbol ] = useLocalStorage("daoSymbol", "");
    
    return {
      daoId,
      saveDaoId: setDaoId,
      daoSymbol,
      saveDaoSymbol: setDaoSymbol
    }

}