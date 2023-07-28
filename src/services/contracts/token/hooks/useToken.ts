import { DAOTemplate } from "../../../../modules/creator/state/types"
import { useState } from "react"
import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"

import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy"
import { useTezos } from "services/beacon/hooks/useTezos"
import mixpanel from "mixpanel-browser"
import { TokenContractParams } from "modules/creator/deployment/state/types"
import { getCurrentBlock } from "services/utils/utils"
import { deployTokenContract } from "services/contracts/token"
import { useNotification } from "modules/common/hooks/useNotification"

export const useTokenOriginate = (tokenData: TokenContractParams) => {
  const queryClient = useQueryClient()

  const { tezos, connect, network, account } = useTezos()
  const openNotification = useNotification()

  const result = useMutation<ContractAbstraction<ContractProvider | Wallet>, Error, TokenContractParams>(
    async ({ tokenDistribution, tokenSettings }) => {
      try {
        let tezosToolkit = tezos

        if (!account) {
          tezosToolkit = await connect()
        }

        mixpanel.track("Started Token origination", {
          contract: "FA2Token",
          tokenName: tokenSettings.name,
          tokenSymbol: tokenSettings.symbol
        })

        const mutateTokenData: TokenContractParams = {
          tokenDistribution,
          tokenSettings
        }

        const currentBlock = await getCurrentBlock(network)

        const contract = await deployTokenContract({
          ...mutateTokenData,
          tezos: tezosToolkit,
          account,
          currentBlock
        })

        if (!contract) {
          throw new Error(`Error deploying ${tokenData.tokenSettings.name} Token`)
        }

        mixpanel.track("Completed Token Deployment", {
          contract: "FA2Token",
          tokenName: tokenSettings.name,
          tokenSymbol: tokenSettings.symbol
        })

        return contract
      } catch (error) {
        openNotification({
          message: (error as Error).message,
          variant: "error",
          autoHideDuration: 2000
        })
        return error
      }
    },
    {
      onSuccess: () => {
        queryClient.resetQueries()
      }
    }
  )

  return { mutation: result }
}
