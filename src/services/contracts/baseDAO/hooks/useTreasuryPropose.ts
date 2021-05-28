import { TreasuryDAO } from 'services/contracts/baseDAO';
import { TransactionWalletOperation } from "@taquito/taquito";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { TreasuryProposeArgs } from "../treasuryDAO/types";
import { useCacheDAOs } from "./useCacheDAOs";

export const useTreasuryPropose = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { setDAO } = useCacheDAOs();
  const { network } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, { dao: TreasuryDAO, args: TreasuryProposeArgs }>(
    async ({ dao, args }) => {
      const {
        key: proposalNotification,
        closeSnackbar: closeProposalNotification,
      } = openNotification({
        message: "Treasury proposal is being created...",
        persist: true,
        variant: "info",
      });

      try {
        const data = await dao.propose(args);

        await data.confirmation(1);
        closeProposalNotification(proposalNotification);

        openNotification({
          message: "Treasury proposal transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
        });
        setDAO(dao);
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
        queryClient.resetQueries("proposals");
      },
    }
  );
};
