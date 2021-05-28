import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "..";

export const useDropProposal = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { network } = useTezos()

  return useMutation<
    TransactionWalletOperation | Error,
    Error,
    { dao: BaseDAO; proposalId: string }
  >(
    async (params) => {
      const {
        key: dropProposal,
        closeSnackbar: closeDropProposal,
      } = openNotification({
        message: "Please sign the transaction to drop proposal",
        persist: true,
        variant: "info",
      });
      try {
        const data = await params.dao.dropProposal(params.proposalId);
        closeDropProposal(dropProposal);

        await data.confirmation(1);
        openNotification({
          message: "Drop proposal transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
        });

        return data;
      } catch (e) {
        closeDropProposal(dropProposal);
        openNotification({
          message: "An error has happened with drop proposal transaction!",
          variant: "error",
          autoHideDuration: 5000,
        });
        return new Error(e.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.resetQueries("dao");
        queryClient.resetQueries("daos");
        queryClient.resetQueries("proposals");
      },
    }
  );
};
