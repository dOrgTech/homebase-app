import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
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
  const { network } = useTezos()

  return useMutation<any | Error, Error, Params>(
    async (params) => {
      const {
        key: freezeNotification,
        closeSnackbar: closeFreezeNotification,
      } = openNotification({
        message: "Stake is being processed...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await (params.dao as BaseDAO).freeze(params.amount);

        await data.confirmation(1);

        closeFreezeNotification(freezeNotification);
        openNotification({
          message: "Stake transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
        });
        setDAO(params.dao);
        localStorage.removeItem('daoId');
        saveDaoId(params.dao.address);
        return data;
      } catch (e) {
        console.log(e);
        closeFreezeNotification(freezeNotification);
        openNotification({
          message: "An error has happened with stake transaction!",
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
    },
    }
  );
};
