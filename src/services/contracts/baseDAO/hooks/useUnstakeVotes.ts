import mixpanel from "mixpanel-browser"
import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from ".."
import { networkNameMap } from "../../../bakingBad"

interface Params {
  dao: BaseDAO
  proposalId: string
}

export const useUnstakeVotes = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<any | Error, Error, Params>(
    async params => {
      const { key: freezeNotification, closeSnackbar: closeFreezeNotification } = openNotification({
        message: `Unstake is being processed...`,
        persist: true,
        variant: "info"
      })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await (params.dao as BaseDAO).unstakeVotes(params.proposalId, tezosToolkit)

        mixpanel.track(`Votes Unstaked`, {
          dao: params.dao.data.address,
          proposalId: params.proposalId
        })

        await data.confirmation(1)

        closeFreezeNotification(freezeNotification)
        openNotification({
          message: `Unstake transaction confirmed!`,
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })
        return data
      } catch (e) {
        console.log(e)
        closeFreezeNotification(freezeNotification)
        openNotification({
          message: `An error has happened with unstake transaction!`,
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
