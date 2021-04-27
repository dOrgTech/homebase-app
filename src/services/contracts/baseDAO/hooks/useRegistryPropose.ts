import { RegistryDAO } from "..";
import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { RegistryItem } from "../registryDAO/types";
import { useNotification } from "modules/common/hooks/useNotification";
import { useCacheDAOs } from "./useCacheDAOs";

interface Params {
  dao: RegistryDAO;
  tokensToFreeze: number;
  agoraPostId: number;
  items: RegistryItem[];
}

export const useRegistryPropose = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { setDAO } = useCacheDAOs();

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async (params) => {
      const {
        key: proposalNotification,
        closeSnackbar: closeProposalNotification,
      } = openNotification({
        message: "Proposal is being created...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await params.dao.proposeRegistryUpdate({
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
        setDAO(params.dao);
        return data;
      } catch (e) {
        console.log(e);
        closeProposalNotification(proposalNotification);
        openNotification({
          message: "An error has happened with propose transaction!",
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
