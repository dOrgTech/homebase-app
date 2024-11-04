import { ethers } from "ethers"
import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"

import { useTezos } from "services/beacon/hooks/useTezos"
import { TokenContractParams } from "modules/creator/deployment/state/types"
import { getCurrentBlock } from "services/utils/utils"
import { deployTokenContract } from "services/contracts/token"
import { useNotification } from "modules/common/hooks/useNotification"
import HbTokenAbi from "assets/abis/hb_evm.json"

import AnalyticsService from "services/services/analytics"

const ERC20_ABI = HbTokenAbi.abi
const ERC20_BYTECODE = HbTokenAbi.bytecode

export const useTokenOriginate = (tokenData: TokenContractParams) => {
  const queryClient = useQueryClient()

  const { tezos, connect, network, account, etherlink } = useTezos()
  const provider = etherlink.provider
  const signer = etherlink.signer

  const openNotification = useNotification()

  const result = useMutation<ContractAbstraction<ContractProvider | Wallet>, Error, TokenContractParams>(
    async ({ tokenDistribution, tokenSettings }) => {
      console.log({ tokenDistribution, tokenSettings, network })
      console.log({ provider })
      if (network.startsWith("etherlink")) {
        try {
          console.log("Deployer", signer?.getAddress())
          const factory = new ethers.ContractFactory(ERC20_ABI, ERC20_BYTECODE, signer)
          const initialMembers = tokenDistribution.holders.map(holder => holder.walletAddress)
          const initialAmounts = tokenDistribution.holders.map(holder =>
            ethers.parseUnits(holder.amount?.toString() ?? "0", tokenSettings.decimals ?? 18)
          )
          const contract = await factory.deploy(
            tokenSettings.name,
            tokenSettings.symbol ?? "MTK",
            initialMembers,
            initialAmounts
          )
          await contract.waitForDeployment()
          const contractAddress = await contract.getAddress()
          return { address: contractAddress }
        } catch (error: any) {
          // Use 'unknown' instead of 'any' for better type safety
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.log("Error", errorMessage)
          console.log({ error })
          openNotification({
            message: error?.shortMessage,
            variant: "error",
            autoHideDuration: 2000
          })
          return error
        }
      } else {
        try {
          let tezosToolkit = tezos

          if (!account) {
            const connectedToolkit = await connect()
            if (typeof connectedToolkit === "string") {
              throw new Error("Failed to connect to Tezos toolkit")
            }
            tezosToolkit = connectedToolkit as TezosToolkit
          }

          AnalyticsService.track("Started Token origination", {
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

          AnalyticsService.track("Completed Token Deployment", {
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
