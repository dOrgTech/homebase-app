import { useSnackbar } from "notistack";
import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";

import { doDAOPropose } from "services/contracts/baseDAO";
import { useTezos } from "services/beacon/hooks/useTezos";
import { ProposeParams } from "services/contracts/baseDAO/types";
import { useNotification } from "modules/common/useNotification";

type UseProposeParams = Omit<ProposeParams, "tezos">;

export const usePropose = () => {
  const queryClient = useQueryClient();
  const { tezos } = useTezos();

  const testOpen = (key: string) => {
    console.log(key);
  };

  const openNotification = useNotification(testOpen);
  return useMutation<TransactionWalletOperation, Error, UseProposeParams>(
    async (params) => {
      try {
        const proposalResult = await doDAOPropose({
          ...params,
          tezos,
        });

        const handler = (key: string) => {
          console.log("redirecting to ", key);
        };

        openNotification({
          transactionObject: proposalResult,
          message: "Your proposal is being created...",
          variant: "info",
          onOpenDetails: handler,
        });

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
