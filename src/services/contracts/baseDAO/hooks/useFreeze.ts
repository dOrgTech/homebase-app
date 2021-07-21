import BigNumber from "bignumber.js";
import { useNotification } from "modules/common/hooks/useNotification";
import { useMutation, useQueryClient } from "react-query";
import { useTezos } from "services/beacon/hooks/useTezos";
import { BaseDAO } from "..";
import { useVisitedDAO } from "./useVisitedDAO";

interface Params {
  dao: BaseDAO;
  amount: BigNumber;
  freeze: boolean;
}

export const useFreeze = () => {
  const queryClient = useQueryClient();
  const openNotification = useNotification();
  const { saveDaoId } = useVisitedDAO();
  const { network, tezos, account, connect } = useTezos()

  return useMutation<any | Error, Error, Params>(
    async (params) => {
      const {
        key: freezeNotification,
        closeSnackbar: closeFreezeNotification,
      } = openNotification({
        message: `${params.freeze? "Stake": "Unstake"} is being processed...`,
        persist: true,
        variant: "info",
      });
      try {
        let tezosToolkit = tezos;

        if(!account) {
          tezosToolkit = await connect()
        }

        const data = await (params.dao as BaseDAO)[params.freeze? "freeze": "unfreeze"](params.amount, tezosToolkit);

        await data.confirmation(1);

        closeFreezeNotification(freezeNotification);
        openNotification({
          message: `${params.freeze? "Stake": "Unstake"} transaction confirmed!`,
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${network}.tzkt.io/` + data.opHash,
        });
        localStorage.removeItem('daoId');
        saveDaoId(params.dao.data.address);
        return data;
      } catch (e) {
        console.log(e);
        closeFreezeNotification(freezeNotification);
        openNotification({
          message: `An error has happened with ${params.freeze? "stake": "unstake"} transaction!`,
          variant: "error",
          autoHideDuration: 10000,
        });
        return new Error((e as Error).message);
      }
    },
    {
      onSuccess: () => {
        queryClient.resetQueries("ledger");
        queryClient.resetQueries("dao");
    },
    }
  );
};
