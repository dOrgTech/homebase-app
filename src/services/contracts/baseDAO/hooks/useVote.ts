import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { doDAOVote } from "..";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { VoteParams } from "../types";

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
