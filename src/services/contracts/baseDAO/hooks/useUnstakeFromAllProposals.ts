import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from ".."
import { networkNameMap } from "../../../bakingBad"

export const useUnstakeFromAllProposals = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<any | Error, Error, { dao: BaseDAO; allProposals: string[] }>(
    async params => {
      const { key: unstakeNotification, closeSnackbar: closeFlushNotification } = openNotification({
        message: "Please sign the transaction to unstake tokens from all proposals",
        persist: true,
        variant: "info"
      })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await params.dao.unstakeFromAllProposals(params.allProposals, account, tezosToolkit)
        closeFlushNotification(unstakeNotification)

        await data.confirmation(1)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })

        return data
      } catch (e) {
        closeFlushNotification(unstakeNotification)
        openNotification({
          message: "An error has happened with unstake transaction!",
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
