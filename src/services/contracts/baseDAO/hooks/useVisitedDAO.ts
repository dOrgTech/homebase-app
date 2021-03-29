import useLocalStorage from "modules/common/hooks/useLocalStorage";

export const useVisitedDAO = () => {
    const [ daoId, setDaoId ] = useLocalStorage("daoId", "");
    const [ daoSymbol, setDaoSymbol ] = useLocalStorage("daoSymbol", "");

    const saveDaoId = (params: any) => {
      setDaoId(params)
      return;
    }

    const saveDaoSymbol = (params: any) => {
        setDaoSymbol(params)
        return;
      }
    
    return {
      daoId,
      saveDaoId,
      daoSymbol,
      saveDaoSymbol
    }

}