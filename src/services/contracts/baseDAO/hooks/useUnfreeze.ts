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
        message: "Unfreeze is being processed...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await (params.dao as BaseDAO).unfreeze(params.amount);

        await data.confirmation(1);

        closeUnfreezeNotification(unfreezeNotification);
        openNotification({
          message: "Unfreeze transaction confirmed!",
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
          message: "And error has happened with unfreeze transaction!",
          variant: "error",
          autoHideDuration: 10000,
        });
        return new Error(e.message);
      }
    },
    {
      onSuccess: () => {
          queryClient.invalidateQueries("ledger");
        queryClient.invalidateQueries("dao");
        queryClient.invalidateQueries("balances");
      },
    }
  );
};
