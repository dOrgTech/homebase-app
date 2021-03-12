import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
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
  const openNotification = useNotification();

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async (params) => {
      const {
        key: voteNotification,
        closeSnackbar: closeVoteNotification,
      } = openNotification({
        message: "Vote is being created...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await (params.dao as BaseDAO).vote({
          proposalKey: params.proposalKey,
          amount: params.amount,
          support: params.support,
        });

        await data.confirmation(1);

        closeVoteNotification(voteNotification);
        openNotification({
          message: "Vote transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: "https://edo2net.tzkt.io/" + data.opHash,
        });
        return data;
      } catch (e) {
        console.log(e);
        closeVoteNotification(voteNotification);
        openNotification({
          message: "And error has happened with vote transaction!",
          variant: "error",
          autoHideDuration: 10000,
        });
        return new Error(e.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("votes");
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
