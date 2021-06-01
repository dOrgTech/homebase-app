import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "..";
import { useCacheDAOs } from "./useCacheDAOs";

interface Params {
  dao: BaseDAO;
  amount: number;
}

export const useUnfreeze = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { setDAO } = useCacheDAOs();
  const { network } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async (params) => {
      const {
        key: unfreezeNotification,
        closeSnackbar: closeUnfreezeNotification,
      } = openNotification({
        message: "Unstake is being processed...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await (params.dao as BaseDAO).unfreeze(params.amount);

        await data.confirmation(1);

        closeUnfreezeNotification(unfreezeNotification);
        openNotification({
          message: "Unstake transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
        });
        setDAO(params.dao);
        return data;
      } catch (e) {
        console.log(e);
        closeUnfreezeNotification(unfreezeNotification);
        openNotification({
          message: "An error has happened with unstake transaction!",
          variant: "error",
          autoHideDuration: 10000,
        });
        return new Error(e.message);
      }
    },
    {
      onSuccess: () => {
          queryClient.resetQueries("ledger");
        queryClient.resetQueries("dao");
        queryClient.resetQueries("balances");
      },
    }
  );
};
