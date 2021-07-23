import { TransactionWalletOperation } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "..";

interface Params {
  dao: BaseDAO;
  proposalKey: string;
  amount: BigNumber;
  support: boolean;
}

export const useVote = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { network, tezos, account, connect } = useTezos()

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
        let tezosToolkit = tezos;

        if(!account) {
          tezosToolkit = await connect()
        }

        const data = await (params.dao as BaseDAO).vote({
          proposalKey: params.proposalKey,
          amount: params.amount,
          support: params.support,
          tezos: tezosToolkit
        });

        await data.confirmation(1);

        closeVoteNotification(voteNotification);
        openNotification({
          message: "Vote transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
        });
        return data;
      } catch (e) {
        console.log(e);
        closeVoteNotification(voteNotification);
        openNotification({
          message: "An error has happened with vote transaction!",
          variant: "error",
          autoHideDuration: 10000,
        });
        return new Error((e as Error).message);
      }
    },
    {
      onSuccess: () => {
        queryClient.resetQueries("votes");
        queryClient.resetQueries("proposals");
      },
    }
  );
};
