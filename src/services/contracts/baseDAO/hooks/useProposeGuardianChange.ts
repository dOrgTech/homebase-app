import { TransactionWalletOperation } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO } from "../class"
import { networkNameMap } from "../../../bakingBad"

export const useProposeGuardianChange = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<TransactionWalletOperation | Error, Error, { dao: BaseDAO; newGuardianAddress: string }>(
    async ({ dao, newGuardianAddress }) => {
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

        const data = await dao.proposeGuardianChange(newGuardianAddress, tezosToolkit)
        await data.confirmation(1)
        closeProposalNotification(proposalNotification)

        openNotification({
          message: "Guardian change proposal transaction confirmed!",
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
