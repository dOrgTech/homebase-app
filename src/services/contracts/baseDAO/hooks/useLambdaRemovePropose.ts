import { TransactionWalletOperation } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"
import { LambdaRemoveArgs } from "../lambdaDAO/types"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import mixpanel from "mixpanel-browser"
import { networkNameMap } from "../../../bakingBad"
import { LambdaDAO } from "../lambdaDAO"

export const useLambdaRemovePropose = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<
    TransactionWalletOperation | Error,
    Error,
    { dao: LambdaDAO; args: LambdaRemoveArgs; handleClose: () => void }
  >(
    async ({ dao, args, handleClose }) => {
      const { key: proposalNotification, closeSnackbar: closeProposalNotification } = openNotification({
        message: "Proposal is being created...",
        persist: true,
        variant: "info"
      })
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await dao.proposeLambdaRemove(args, tezosToolkit)

        mixpanel.track("Proposal Created", {
          dao: dao.data.address,
          daoType: "Registry"
        })

        await data.confirmation(1)
        closeProposalNotification(proposalNotification)

        openNotification({
          message: "Remove Lambda proposal transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })

        handleClose()
        return data
      } catch (e) {
        console.log(e)
        closeProposalNotification(proposalNotification)
        openNotification({
          message: "An error has happened with propose transaction!",
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
