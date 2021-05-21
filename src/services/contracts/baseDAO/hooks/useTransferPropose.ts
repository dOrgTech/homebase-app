import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "../class";
import { TransferParams } from "../types";
import { useCacheDAOs } from "./useCacheDAOs";

interface Params {
  dao: BaseDAO;
  tokensToFreeze: number;
  agoraPostId: number;
  transfers: TransferParams[];
}

export const useTransferPropose = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { setDAO } = useCacheDAOs();
  const { network } = useTezos()

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
        const data = await params.dao.proposeTransfer({
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
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
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
