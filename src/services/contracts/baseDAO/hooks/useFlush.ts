import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation } from "react-query";

import { useTezos } from "services/beacon/hooks/useTezos";
import { doFlush } from "services/contracts/baseDAO";
import { FlushParams } from "services/contracts/baseDAO/types";

type UseFlushParams = Omit<FlushParams, "tezos">;

export const useFlush = () => {
  const { tezos, connect } = useTezos();

  return useMutation<TransactionWalletOperation, Error, UseFlushParams>(
    async (params) => {
      return await doFlush({
        ...params,
        tezos: tezos || (await connect()),
      });
    }
  );
};
