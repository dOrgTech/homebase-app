import useLocalStorage from "modules/common/hooks/useLocalStorage";
import { BaseDAO } from "../class";

interface ListDao {
    id: string;
    name: string;
    symbol: string;
    voting_addresses: number;
}

const formatDAO = (dao: BaseDAO) => {
    const formattedDao: ListDao = {
        id: dao.address,
        name: dao.metadata.unfrozenToken.name,
        symbol: dao.metadata.unfrozenToken.symbol,
        voting_addresses: dao.ledger.length,
    }

    return formattedDao;
}

const checkIfDAOSaved = (dao: ListDao, daos: Array<any>) => {
    const found = daos.filter((current: any) => current.id === dao.id);
    if (found.length > 0) {
        return true;
    }
    return false;
}

export const useCacheDAOs = () => {
    const initialArray: Array<any> = [];
    const [ daos, setDaos ] = useLocalStorage("recentDaos", initialArray);

    const checkDaos = () => daos;

    const setDAO = (params: any) => {
        const formattedDao = formatDAO(params)
        if (!checkIfDAOSaved(formattedDao, daos)) {
            const updatedDaos = [...daos, formattedDao];
            setDaos(updatedDaos);
        }
        return daos
    }

    return {
      daos,
      checkDaos,
      setDAO
    }

}