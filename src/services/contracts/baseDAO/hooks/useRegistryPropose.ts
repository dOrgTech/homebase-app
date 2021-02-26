import { RegistryDAO } from "./../classes";
import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { RegistryItem } from "../registryDAO/types";

interface Params {
  dao: RegistryDAO;
  tokensToFreeze: number;
  agoraPostId: number;
  items: RegistryItem[];
}

export const useRegistryPropose = () => {
  const queryClient = useQueryClient();

  return useMutation<TransactionWalletOperation, Error, Params>(
    (params) => {
      return params.dao.propose({
        ...params,
        tokensToFreeze: params.tokensToFreeze,
        agoraPostId: params.agoraPostId,
        items: params.items,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
