import { TransactionWalletOperation } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"
import { RegistryProposeArgs } from "../lambdaDAO/types"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import { LambdaDAO } from "../lambdaDAO"
import mixpanel from "mixpanel-browser"
import { networkNameMap } from "../../../bakingBad"
import { sendProposalCreatedEvent } from "services/utils/utils"

export const useRegistryPropose = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, { dao: LambdaDAO; args: RegistryProposeArgs }>(
    async ({ dao, args }) => {
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

        const data = await dao.propose(args, tezosToolkit)

        mixpanel.track("Proposal Created", {
          dao: dao.data.address,
          daoType: "Registry"
        })
        sendProposalCreatedEvent(network, account, dao.data.name, dao.data.address)

        await data.confirmation(1)
        closeProposalNotification(proposalNotification)

        openNotification({
          message: "Registry proposal transaction confirmed!",
          autoHideDuration: 10000,
          variant: "success",
          detailsLink: `https://${networkNameMap[network]}.tzkt.io/` + data.opHash
        })
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
