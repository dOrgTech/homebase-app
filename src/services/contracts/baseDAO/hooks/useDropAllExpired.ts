import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from ".."
import { networkNameMap } from "../../../bakingBad"

export const useDropAllExpired = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<any | Error, Error, { dao: BaseDAO; expiredProposalIds: string[] }>(
    async params => {
      const { key: dropNotification, closeSnackbar: closeFlushNotification } = openNotification({
        message: "Please sign the transaction to drop all expired proposals",
        persist: true,
        variant: "info"
      })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await params.dao.dropAllExpired(params.expiredProposalIds, tezosToolkit)
        closeFlushNotification(dropNotification)

        await data.confirmation(1)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })

        return data
      } catch (e) {
        closeFlushNotification(dropNotification)
        openNotification({
          message: "An error has happened with drop expired transaction!",
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
