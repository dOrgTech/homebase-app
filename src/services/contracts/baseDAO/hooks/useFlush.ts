import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation } from "react-query";
import { BaseDAO } from "..";

export const useFlush = () => {
  return useMutation<
    TransactionWalletOperation,
    Error,
    { dao: BaseDAO; numOfProposalsToFlush: number }
  >((params) => {
    return params.dao.flush(params.numOfProposalsToFlush);
  });
};
