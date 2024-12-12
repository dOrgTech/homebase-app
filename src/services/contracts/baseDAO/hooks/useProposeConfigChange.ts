import { TransactionWalletOperation } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from "../class"
import { ConfigProposalParams } from "../types"
import { networkNameMap } from "../../../bakingBad"
import { sendProposalCreatedEvent } from "services/utils/utils"
import mixpanel from "mixpanel-browser"

export const useProposeConfigChange = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, { dao: BaseDAO; args: ConfigProposalParams }>(
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

        const data = await dao.proposeConfigChange(args, tezosToolkit)
        mixpanel.track("Proposal Created", {
          dao: dao.data.address,
          daoType: "Registry"
        })
        sendProposalCreatedEvent(network, account, dao.data.name, dao.data.address)

        await data.confirmation(1)
        closeProposalNotification(proposalNotification)

        openNotification({
          message: "Config proposal transaction confirmed!",
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
