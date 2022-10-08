import BigNumber from "bignumber.js"
import mixpanel from "mixpanel-browser"
import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from ".."
import { networkNameMap } from "../../../bakingBad"

interface Params {
  dao: BaseDAO
  amount: BigNumber
  freeze: boolean
}

export const useFreeze = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<any | Error, Error, Params>(
    async params => {
      const { key: freezeNotification, closeSnackbar: closeFreezeNotification } = openNotification({
        message: `${params.freeze ? "Deposit" : "Withdrawal"} is being processed...`,
        persist: true,
        variant: "info"
      })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await (params.dao as BaseDAO)[params.freeze ? "freeze" : "unfreeze"](params.amount, tezosToolkit)

        mixpanel.track(`Tokens ${params.freeze ? "Deposited" : "Withdrawn"}`, {
          dao: params.dao.data.address,
          amount: params.amount
        })

        await data.confirmation(1)

        closeFreezeNotification(freezeNotification)
        openNotification({
          message: `${params.freeze ? "Deposit" : "Withdrawal"} transaction confirmed!`,
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })
        return data
      } catch (e) {
        console.log(e)
        closeFreezeNotification(freezeNotification)
        openNotification({
          message: `An error has happened with ${params.freeze ? "deposit" : "withdrawal"} transaction!`,
          variant: "error",
          autoHideDuration: 10000
        })
        return new Error((e as Error).message)
      }
    },
    {
      onSuccess: () => {
        queryClient.resetQueries()
      }
    }
  )
}
