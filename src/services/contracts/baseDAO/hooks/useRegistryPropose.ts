import { RegistryDAO } from "..";
import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { RegistryItem } from "../registryDAO/types";
import { useNotification } from "modules/common/hooks/useNotification";

interface Params {
  dao: RegistryDAO;
  tokensToFreeze: number;
  agoraPostId: number;
  items: RegistryItem[];
}

export const useRegistryPropose = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async (params) => {
      const {
        key: proposalNotification,
        closeSnackbar: closeProposalNotification,
      } = openNotification({
        message: "Proposal is being created...",
        persist: true,
      });
      try {
        const data = await params.dao.propose({
          ...params,
          tokensToFreeze: params.tokensToFreeze,
          agoraPostId: params.agoraPostId,
          items: params.items,
        });
        await data.confirmation(1);
        closeProposalNotification(proposalNotification);

        openNotification({
          message: "Registry proposal transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: "https://edo2net.tzkt.io/" + data.opHash,
        });
        return data;
      } catch (e) {
        closeProposalNotification(proposalNotification);
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
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
