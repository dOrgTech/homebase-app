import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { BaseDAO } from "..";

interface Params {
  dao: BaseDAO;
  proposalKey: string;
  amount: number;
  support: boolean;
}

export const useVote = () => {
  const queryClient = useQueryClient();

  return useMutation<TransactionWalletOperation, Error, Params>(
    async (params) => {
      return await (params.dao as BaseDAO).vote({
        proposalKey: params.proposalKey,
        amount: params.amount,
        support: params.support,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("votes");
      },
    }
  );
};
