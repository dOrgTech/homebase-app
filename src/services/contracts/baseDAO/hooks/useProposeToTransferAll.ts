import { BaseDAO } from "../class";
import { TreasuryDAO } from "../treasuryDAO";
import { RegistryDAO } from "../registryDAO";
import { useMutation } from "react-query";
import { DAOHolding } from "../../../bakingBad/tokenBalances";
import { BigNumber } from "bignumber.js";
import { TransferParams } from "../types";
import { splitTransferParams } from "../utils";
import { useTreasuryBatchPropose } from "./useTreasuryBatchPropose";
import { useRegistryBatchPropose } from "./useRegistryBatchPropose";

export const useProposeToTransferAll = () => {
  const { mutateAsync: treasuryMutate } = useTreasuryBatchPropose();
  const { mutateAsync: registryMutate } = useRegistryBatchPropose();

  return useMutation<
    void | Error,
    Error,
    { dao: BaseDAO; holdings: DAOHolding[]; xtzBalance: BigNumber; recipient: string }
  >(async ({ dao, holdings, recipient, xtzBalance }) => {
    const transfers: TransferParams[] = holdings
      .filter((h) => h.token.contract.toLowerCase() !== dao.data.token.contract.toLowerCase())
      .map((holding) => ({
        type: "FA2" as const,
        amount: holding.balance.toNumber(),
        recipient,
        asset: holding.token,
      }));

    if (xtzBalance.gt(new BigNumber(0))) {
      transfers.push({
        amount: xtzBalance.toNumber(),
        recipient,
        type: "XTZ" as const,
      });
    }

    const checkTransfers = transfers.filter((transfer) => {
      if (transfer.type === "FA2" && dao.data.address && dao.data.token) {
        if (dao.data.token.token_id !== transfer.asset.token_id) {
          return transfer;
        }
      } else {
        return transfer;
      }
    });

    const splitterTransfer = splitTransferParams(checkTransfers);

    try {
      if ((dao as BaseDAO).data.type === "treasury") {
        await treasuryMutate({
          dao: dao as TreasuryDAO,
          args: {
            agoraPostId: 0,
            transfersBatches: splitterTransfer,
          },
        });
      } else if ((dao as BaseDAO).data.type === "registry") {
        await registryMutate({
          dao: dao as RegistryDAO,
          args: {
            agoraPostId: 0,
            transfer_proposal: {
              transfersBatches: splitterTransfer,
              registry_diff: (dao as RegistryDAO).decoded.decodedRegistry,
            },
          },
        });
      }
    } catch (e) {
      return new Error((e as Error).message);
    }
  });
};
