import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { BaseDAO } from "..";
import { useCacheDAOs } from "./useCacheDAOs";
import { useVisitedDAO } from "./useVisitedDAO";

interface Params {
  dao: BaseDAO;
  amount: number;
}

export const useFreeze = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { setDAO } = useCacheDAOs();
  const { saveDaoId } = useVisitedDAO();

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async (params) => {
      const {
        key: freezeNotification,
        closeSnackbar: closeFreezeNotification,
      } = openNotification({
        message: "Freeze is being processed...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await (params.dao as BaseDAO).freeze(params.amount);

        await data.confirmation(1);

        closeFreezeNotification(freezeNotification);
        openNotification({
          message: "Freeze transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: "https://edo2net.tzkt.io/" + data.opHash,
        });
        setDAO(params.dao);
        localStorage.removeItem('daoId');
        saveDaoId(params.dao.address);
        return data;
      } catch (e) {
        console.log(e);
        closeFreezeNotification(freezeNotification);
        openNotification({
          message: "And error has happened with freeze transaction!",
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
    },
    }
  );
};
