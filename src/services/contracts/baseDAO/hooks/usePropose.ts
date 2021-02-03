import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { doDAOPropose } from "..";
import { ProposeParams } from "../types";

export const usePropose = () => {
  const queryClient = useQueryClient();

  return useMutation<TransactionWalletOperation, Error, ProposeParams>(
    doDAOPropose,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
