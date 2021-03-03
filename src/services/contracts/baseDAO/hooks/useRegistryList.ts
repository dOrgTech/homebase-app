import { useQuery } from "react-query";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { RegistryDAO } from "..";
import { RegistryStorageItem } from "services/bakingBad/registry/types";

export const useRegistryList = (contractAddress: string | undefined) => {
  const { data: dao } = useDAO(contractAddress);

  const result = useQuery<RegistryStorageItem[], Error>(
    ["registryList", contractAddress],
    () => (dao as RegistryDAO).getRegistry(),
    {
      enabled: !!dao,
    }
  );

  return result;
};
