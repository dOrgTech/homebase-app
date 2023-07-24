import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { networkNameMap } from "../../../bakingBad"
import { setDelegate } from ".."
import { WalletOperation } from "@taquito/taquito"

export const useTokenDelegate = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<any | Error, Error, { tokenAddress: string; delegateAddress: string | null }>(
    async params => {
      const { tokenAddress, delegateAddress } = params
      // const { key: flushNotification, closeSnackbar: closeFlushNotification } = openNotification({
      //   message: "Please sign the transaction to flush",
      //   persist: true,
      //   variant: "info"
      // })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const tx = await setDelegate({
          tokenAddress,
          tezos: tezosToolkit,
          delegateAddress
        })
        // closeFlushNotification(flushNotification)

        if (!tx) {
          throw new Error(`Error making delegate transaction`)
        }

        openNotification({
          message: "Delegate transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + (tx as WalletOperation).opHash
        })

        return tx
      } catch (e: any) {
        // closeFlushNotification(flushNotification)
        openNotification({
          message: (e as Error).message,
          variant: "error",
          autoHideDuration: 5000
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
