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

export const useSendXTZ = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { setDAO } = useCacheDAOs();
  const { network, tezos } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async (params) => {
      const {
        key: notification,
        closeSnackbar: closeNotification,
      } = openNotification({
        message: "XTZ transfer is being processed...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await (params.dao as BaseDAO).sendXtz(params.amount.toString(), tezos);

        await data.confirmation(1);

        closeNotification(notification);
        openNotification({
          message: "XTZ transfer confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
        });
        setDAO(params.dao);
        return data;
      } catch (e) {
        console.log(e);
        closeNotification(notification);
        openNotification({
          message: "An error has happened with XTZ transfer!",
          variant: "error",
          autoHideDuration: 10000,
        });
        return new Error(e.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.resetQueries("dao");
        queryClient.resetQueries("tezosBalance");
      },
    }
  );
};