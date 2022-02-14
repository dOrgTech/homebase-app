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

    const splitterTransfer = splitTransferParams(transfers);

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
      console.error(e);
      return new Error((e as Error).message);
    }
  });
};
