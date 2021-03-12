import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { BaseDAO } from "..";

export const useFlush = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();

  return useMutation<
    TransactionWalletOperation | Error,
    Error,
    { dao: BaseDAO; numOfProposalsToFlush: number }
  >(
    async (params) => {
      const {
        key: flushNotification,
        closeSnackbar: closeFlushNotification,
      } = openNotification({
        message: "Please sign the transaction to flush",
        persist: true,
        variant: "info",
      });
      try {
        const data = await params.dao.flush(params.numOfProposalsToFlush);
        closeFlushNotification(flushNotification);

        await data.confirmation(1);
        openNotification({
          message: "Flush transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: "https://edo2net.tzkt.io/" + data.opHash,
        });

        return data;
      } catch (e) {
        closeFlushNotification(flushNotification);
        openNotification({
          message: "And error has happened with flush transaction!",
          variant: "error",
          autoHideDuration: 5000,
        });
        return new Error(e.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dao");
        queryClient.invalidateQueries("daos");
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
