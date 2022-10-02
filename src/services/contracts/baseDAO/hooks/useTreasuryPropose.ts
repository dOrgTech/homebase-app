import { TreasuryDAO } from "services/contracts/baseDAO"
import { TransactionWalletOperation } from "@taquito/taquito"
import { useNotification } from "modules/common/hooks/useNotification"
import { useMutation, useQueryClient } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { TreasuryProposeArgs } from "../treasuryDAO/types"
import mixpanel from "mixpanel-browser"
import { networkNameMap } from "../../../bakingBad"

export const useTreasuryPropose = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, connect, account } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, { dao: TreasuryDAO; args: TreasuryProposeArgs }>(
    async ({ dao, args }) => {
      const { key: proposalNotification, closeSnackbar: closeProposalNotification } = openNotification({
        message: "Treasury proposal is being created...",
        persist: true,
        variant: "info"
      })

      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        const data = await dao.propose(args, tezosToolkit)

        mixpanel.track("Proposal Created", {
          dao: dao.data.address,
          daoType: "Treasury"
        })

        await data.confirmation(1)
        closeProposalNotification(proposalNotification)

        openNotification({
          message: "Treasury proposal transaction confirmed!",
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
