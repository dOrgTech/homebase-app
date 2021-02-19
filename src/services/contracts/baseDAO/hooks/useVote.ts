import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { doDAOVote } from "services/contracts/baseDAO";
import { VoteParams } from "services/contracts/baseDAO/types";

type UseVoteParams = Omit<VoteParams, "tezos">;

export const useVote = () => {
  const queryClient = useQueryClient();
  const { tezos, connect } = useTezos();

  return useMutation<TransactionWalletOperation, Error, UseVoteParams>(
    async (params) => {
      return await doDAOVote({
        ...params,
        tezos: tezos || (await connect()),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("votes");
      },
    }
  );
};
