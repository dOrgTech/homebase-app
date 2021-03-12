import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { Transfer } from "services/contracts/baseDAO/types";
import { TreasuryDAO } from "..";

interface Params {
  dao: TreasuryDAO;
  tokensToFreeze: number;
  agoraPostId: number;
  transfers: Transfer[];
}

export const useTreasuryPropose = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async (params) => {
      const {
        key: proposalNotification,
        closeSnackbar: closeProposalNotification,
      } = openNotification({
        message: "Treasury proposal is being created...",
        persist: true,
        variant: "info",
      });

      try {
        const data = await params.dao.propose({
          ...params,
          tokensToFreeze: params.tokensToFreeze,
          agoraPostId: params.agoraPostId,
          transfers: params.transfers,
        });

        await data.confirmation(1);
        closeProposalNotification(proposalNotification);

        openNotification({
          message: "Treasury proposal transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: "https://edo2net.tzkt.io/" + data.opHash,
        });
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
