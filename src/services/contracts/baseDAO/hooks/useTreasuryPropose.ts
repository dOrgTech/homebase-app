import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation, useQueryClient } from "react-query";
import { Transfer } from "services/contracts/baseDAO/types";
import { TreasuryDAO } from "../classes";

interface Params {
  dao: TreasuryDAO;
  tokensToFreeze: number;
  agoraPostId: number;
  transfers: Transfer[];
}

export const useTreasuryPropose = () => {
  const queryClient = useQueryClient();

  return useMutation<TransactionWalletOperation, Error, Params>(
    (params) => {
      return params.dao.propose({
        ...params,
        tokensToFreeze: params.tokensToFreeze,
        agoraPostId: params.agoraPostId,
        transfers: params.transfers,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("proposals");
      },
    }
  );
};
