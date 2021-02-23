import { TransactionWalletOperation } from "@taquito/taquito";
import { useMutation } from "react-query";

import { useTezos } from "services/beacon/hooks/useTezos";
import { doFlush } from "services/contracts/baseDAO";
import { FlushParams } from "services/contracts/baseDAO/types";
import { connectIfNotConnected } from "services/contracts/utils";

type UseFlushParams = Omit<FlushParams, "tezos">;

export const useFlush = () => {
  const { tezos, connect } = useTezos();

  return useMutation<TransactionWalletOperation, Error, UseFlushParams>(
    async (params) => {
      await connectIfNotConnected(tezos, connect);
      return await doFlush({
        ...params,
        tezos: tezos || (await connect()),
      });
    }
  );
};
