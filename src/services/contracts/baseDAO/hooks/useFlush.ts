import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from ".."
import { networkNameMap } from "../../../bakingBad"

export const useFlush = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<any | Error, Error, { dao: BaseDAO; numOfProposalsToFlush: number; expiredProposalIds: string[] }>(
    async params => {
      const { key: flushNotification, closeSnackbar: closeFlushNotification } = openNotification({
        message: "Please sign the transaction to flush",
        persist: true,
        variant: "info"
      })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await params.dao.flush(params.numOfProposalsToFlush, params.expiredProposalIds, tezosToolkit)
        closeFlushNotification(flushNotification)

        await data.confirmation(1)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })

        return data
      } catch (e) {
        closeFlushNotification(flushNotification)
        openNotification({
          message: "An error has happened with execute transaction!",
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
