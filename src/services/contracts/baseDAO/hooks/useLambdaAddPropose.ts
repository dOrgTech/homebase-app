import { TransactionWalletOperation } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"
import { LambdaAddArgs } from "../lambdaDAO/types"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import AnalyticsService from "services/services/analytics"
import { networkNameMap } from "../../../bakingBad"
import { LambdaDAO } from "../lambdaDAO"
import { sendProposalCreatedEvent } from "services/utils/utils"

export const useLambdaAddPropose = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<
    TransactionWalletOperation | Error,
    Error,
    { dao: LambdaDAO; args: LambdaAddArgs; handleClose: () => void }
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
          const connectedToolkit = await connect()
          if (typeof connectedToolkit === "string") {
            throw new Error("Failed to connect to Tezos toolkit")
          }
          tezosToolkit = connectedToolkit
        }

        const data = await dao.proposeLambdaAdd(args, tezosToolkit)

        AnalyticsService.track("Proposal Created", {
          dao: dao.data.address,
          daoType: "Registry"
        })

        sendProposalCreatedEvent(network, account, dao.data.name, dao.data.address)

        await data.confirmation(1)
        closeProposalNotification(proposalNotification)
        // setProposalDone()

        openNotification({
          message: "Add Function proposal transaction confirmed!",
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
        // setProposalDone()
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
