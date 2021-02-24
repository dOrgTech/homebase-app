import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";

import { doDAOPropose } from "services/contracts/baseDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ProposeParams } from "services/contracts/baseDAO/types";
import { useNotification } from "modules/common/useNotification";
import { explorerUrls } from "services/beacon";

type UseProposeParams = Omit<ProposeParams, "tezos">;

export const usePropose = () => {
  const queryClient = useQueryClient();
  const { tezos } = useTezos();
  const openNotification = useNotification();

  return useMutation<TransactionWalletOperation, Error, UseProposeParams>(
    async (params) => {
      try {
        const proposalResult = await doDAOPropose({
          ...params,
          tezos,
        });

        const { key, closeSnackbar } = openNotification({
          detailsLink: explorerUrls.edo2net + proposalResult.opHash,
          message: "Your proposal is being created...",
          variant: "info",
          persist: true,
        });

        await proposalResult.confirmation(1);
        closeSnackbar(key);

        return proposalResult;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
