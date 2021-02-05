import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { doDAOPropose } from "..";
import { useTezos } from "../../../beacon/hooks/useTezos";
import { ProposeParams } from "../types";

type UseProposeParams = Omit<ProposeParams, "tezos">;

export const usePropose = () => {
  const queryClient = useQueryClient();
  const { tezos, connect } = useTezos();

  return useMutation<TransactionWalletOperation, Error, UseProposeParams>(
    async (params) => {
      return await doDAOPropose({
        ...params,
        tezos: tezos || (await connect()),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
