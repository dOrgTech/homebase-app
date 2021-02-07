import { ContractAbstraction, ContractProvider } from "@taquito/taquito";
import { OriginateTreasuryParams } from "../types";
import { useMutation, useQueryClient } from "react-query";
import { doDAOOriginateTreasury } from "..";

export const useOriginateTreasury = () => {
  const queryClient = useQueryClient();

  const result = useMutation<
    ContractAbstraction<ContractProvider>,
    Error,
    OriginateTreasuryParams
  >(doDAOOriginateTreasury, {
    onSuccess: () => {
      queryClient.invalidateQueries("daos");
    },
  });

  return result;
};
