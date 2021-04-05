import useLocalStorage from "modules/common/hooks/useLocalStorage";


export const useTotalSupply = () => {
    const initialArray: Array<any> = [];
    const [ totalSupply, setTotalSupply ] = useLocalStorage("totalSupply", initialArray);


    const saveTotalSupply = (params: any) => {
        setTotalSupply(params);
        return;
    }

    return {
      totalSupply,
      saveTotalSupply
    }
}
