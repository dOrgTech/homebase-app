import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { RegistryProposeArgs } from "../registryDAO/types";
import { useNotification } from "modules/common/hooks/useNotification";
import { useCacheDAOs } from "./useCacheDAOs";
import { useTezos } from "services/beacon/hooks/useTezos";
import { RegistryDAO } from '../registryDAO';

export const useRegistryPropose = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { setDAO } = useCacheDAOs();
  const { network } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, { dao: RegistryDAO, args: RegistryProposeArgs }>(
    async ({ dao, args }) => {
      const {
        key: proposalNotification,
        closeSnackbar: closeProposalNotification,
      } = openNotification({
        message: "Proposal is being created...",
        persist: true,
        variant: "info",
      });
      try {
        const data = await dao.propose(args);
        await data.confirmation(1);
        closeProposalNotification(proposalNotification);

        openNotification({
          message: "Registry proposal transaction confirmed!",
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
