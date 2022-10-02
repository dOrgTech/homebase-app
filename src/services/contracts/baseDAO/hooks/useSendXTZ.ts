import { TransactionWalletOperation } from "@taquito/taquito"
import { BigNumber } from "bignumber.js"
import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from ".."
import { networkNameMap } from "../../../bakingBad"

interface Params {
  dao: BaseDAO
  amount: BigNumber
}

export const useSendXTZ = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, Params>(
    async params => {
      const { key: notification, closeSnackbar: closeNotification } = openNotification({
        message: "XTZ transfer is being processed...",
        persist: true,
        variant: "info"
      })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await (params.dao as BaseDAO).sendXtz(params.amount, tezosToolkit)

        await data.confirmation(1)

        closeNotification(notification)
        openNotification({
          message: "XTZ transfer confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })
        return data
      } catch (e) {
        console.log(e)
        closeNotification(notification)
        openNotification({
          message: "An error has happened with XTZ transfer!",
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
