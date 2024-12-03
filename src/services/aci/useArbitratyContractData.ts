import { useMutation, useQueryClient } from "react-query"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import mixpanel from "mixpanel-browser"
import { Network } from "services/beacon"
import { EnvKey, getEnv } from "services/config"
import { TezosToolkit } from "@taquito/taquito"

export const useArbitraryContractData = () => {
  const queryClient = useQueryClient()
  const openNotification = useNotification()
  const { network, tezos, account, connect } = useTezos()

  return useMutation<
    any | Error,
    Error,
    {
      contract: string
      network: Network
      handleContinue: () => void
      finishLoad: (status: boolean) => void
      showHeader: (status: boolean) => void
    }
  >(
    async ({ contract, network, handleContinue, finishLoad, showHeader }) => {
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = (await connect()) as TezosToolkit
        }

        const resp = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/aci/${contract}`, {
          method: "POST",
          body: JSON.stringify({ network: network }),
          headers: { "Content-Type": "application/json" }
        })

        const data = await resp.json()
        finishLoad(false)
        if (data.success === false) {
          openNotification({
            message: "Invalid contract address with unsupported prefix.",
            variant: "error",
            autoHideDuration: 10000
          })
        } else {
          handleContinue()
          showHeader(false)
        }
        return data
      } catch (e) {
        console.log(e)
        openNotification({
          message: "Contract's data could not be fetch!",
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
