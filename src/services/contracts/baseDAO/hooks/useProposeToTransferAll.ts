import {useTreasuryPropose} from "./useTreasuryPropose";
import {useRegistryPropose} from "./useRegistryPropose";
import {BaseDAO} from "../class";
import {TreasuryDAO} from "../treasuryDAO";
import {RegistryDAO} from "../registryDAO";
import {useMutation} from "react-query";
import {DAOHolding} from "../../../bakingBad/tokenBalances";
import {BigNumber} from "bignumber.js";
import {TransferParams} from "../types";

export const useProposeToTransferAll = () => {
  const {mutateAsync: treasuryMutate} = useTreasuryPropose();
  const {mutateAsync: registryMutate} = useRegistryPropose();

  return useMutation<void | Error,
    Error,
    { dao: BaseDAO, holdings: DAOHolding[], xtzBalance: BigNumber, recipient: string }>(
    async ({dao, holdings, recipient, xtzBalance}) => {
      const transfers: TransferParams[] = holdings.map(holding => ({
        type: "FA2" as const,
        amount: holding.balance.toNumber(),
        recipient,
        asset: holding.token,
      })).filter(transfer => !(transfer.asset.contract.toLowerCase() === dao.data.token.contract.toLowerCase()
        && transfer.asset.token_id === dao.data.token.token_id))

      if (xtzBalance.gt(new BigNumber(0))) {
        transfers.push({
          amount: xtzBalance.toNumber(),
          recipient,
          type: "XTZ" as const
        })
      }

      try {
        if ((dao as BaseDAO).data.type === "treasury") {
          await treasuryMutate({
            dao: dao as TreasuryDAO,
            args: {
              agoraPostId: 0,
              transfers,
            },
          });
        } else if ((dao as BaseDAO).data.type === "registry") {
          await registryMutate({
            dao: dao as RegistryDAO,
            args: {
              agoraPostId: 0,
              transfer_proposal: {
                transfers,
                registry_diff: (dao as RegistryDAO).decoded.decodedRegistry,
              },
            },
          });
        }

      } catch (e) {
        console.error(e);
        return new Error((e as Error).message);
      }
    },
  );
};
