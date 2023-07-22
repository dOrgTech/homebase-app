import { OriginateParams } from "../types"
import { DAOTemplate } from "../../../../modules/creator/state/types"
import { useState } from "react"
import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from "@taquito/taquito"
import { useMutation, useQueryClient } from "react-query"

import { deployMetadataCarrier } from "services/contracts/metadataCarrier/deploy"
import { useTezos } from "services/beacon/hooks/useTezos"
import { BaseDAO, replacer } from ".."
import { getDAO } from "services/services/dao/services"
import mixpanel from "mixpanel-browser"
import { InMemorySigner } from "@taquito/signer"
import { ALICE_PRIV_KEY } from "services/beacon"
import { getSignature } from "services/lite/utils"
import { saveLiteCommunity } from "services/services/lite/lite-services"
import { Community } from "models/Community"
import { EnvKey, getEnv } from "services/config"

const INITIAL_STATES = [
  {
    activeText: "",
    completedText: ""
  },
  {
    activeText: "",
    completedText: ""
  },
  {
    activeText: "",
    completedText: ""
  },
  {
    activeText: "",
    completedText: ""
  },
  {
    activeText: "",
    completedText: ""
  },
  {
    activeText: "",
    completedText: ""
  }
]

const waitForIndexation = async (contractAddress: string) => {
  return new Promise(async (resolve, reject) => {
    let tries = 0

    const tryDAOIndexation = async () => {
      const response = await getDAO(contractAddress)

      if (response.daos.length > 0) {
        resolve(true)
      } else {
        if (tries > 12) {
          console.log(`DAO indexation timed out`)
          reject(false)
        }

        console.log(`Verifying DAO indexation, trial #${tries + 1}`)

        tries++

        setTimeout(async () => await tryDAOIndexation(), 10000)
      }
    }

    await tryDAOIndexation()
  })
}

export const useOriginate = (template: DAOTemplate) => {
  const queryClient = useQueryClient()
  const [states, setStates] = useState(INITIAL_STATES)

  const [activeState, setActiveState] = useState<number>()
  const { tezos, connect, network, account, wallet } = useTezos()

  const result = useMutation<ContractAbstraction<ContractProvider | Wallet>, Error, OriginateParams>(
    async ({ metadataParams, params, deploymentMethod }) => {
      const updatedStates = INITIAL_STATES

      let contract

      if (deploymentMethod === "managed") {
        const deployParams: any = {
          params: { ...params },
          metadataParams: { ...metadataParams }
        }

        updatedStates[0] = {
          activeText: `Deploying ${template} DAO Contract`,
          completedText: ""
        }

        setActiveState(0)
        setStates(updatedStates)

        const resp = await fetch(`${getEnv(EnvKey.REACT_APP_DAO_DEPLOYER_API)}/deploy`, {
          method: "POST",
          body: JSON.stringify({ deployParams: deployParams }, replacer),
          headers: { "Content-Type": "application/json" }
        })

        const data = await resp.json()
        console.log(data)
        const address = data.address

        contract = await tezos.wallet.at(address)

        mixpanel.track("Started DAO origination", {
          contract: "BaseDAO",
          daoName: params.orgSettings.name
        })

        if (!contract) {
          throw new Error(`Error deploying ${template}DAO`)
        }

        updatedStates[1] = {
          ...updatedStates[1],
          completedText: `Deployed ${template} DAO contract with address "${contract.address}"`
        }

        setActiveState(1)
        setStates(updatedStates)

        updatedStates[2] = {
          activeText: `Waiting for DAO to be indexed`,
          completedText: ""
        }

        setActiveState(2)
        setStates(updatedStates)
      } else {
        updatedStates[0] = {
          activeText: "Deploying Metadata Carrier Contract",
          completedText: ""
        }

        setActiveState(0)
        setStates(updatedStates)

        mixpanel.track("Started DAO origination", {
          contract: "MetadataCarrier",
          daoName: params.orgSettings.name,
          daoType: params.template
        })

        const metadata = await deployMetadataCarrier({
          ...metadataParams,
          tezos,
          connect
        })

        if (!metadata) {
          throw new Error(`Could not deploy ${template}DAO because MetadataCarrier contract deployment failed`)
        }

        updatedStates[0] = {
          ...updatedStates[0],
          completedText: `Deployed Metadata Carrier with address "${metadata.deployAddress}" and key "${metadata.keyName}"`
        }

        updatedStates[1] = {
          activeText: `Deploying ${template} DAO Contract`,
          completedText: ""
        }

        setActiveState(1)
        setStates(updatedStates)

        mixpanel.track("Started DAO origination", {
          contract: "BaseDAO",
          daoName: params.orgSettings.name
        })

        contract = await BaseDAO.baseDeploy(template, {
          tezos,
          metadata,
          params,
          network
        })

        if (!contract) {
          throw new Error(`Error deploying ${template}DAO`)
        }

        updatedStates[1] = {
          ...updatedStates[1],
          completedText: `Deployed ${template} DAO contract with address "${contract.address}"`
        }

        updatedStates[2] = {
          activeText: `Waiting for DAO ownership to be transferred`,
          completedText: ""
        }

        setActiveState(2)
        setStates(updatedStates)

        const tx = await BaseDAO.transfer_ownership(contract.address, contract.address, tezos)

        if (!tx) {
          throw new Error(`Error transferring ownership of ${template}DAO to itself`)
        }

        updatedStates[2] = {
          ...updatedStates[2],
          completedText: `Ownership of ${template} DAO transferred to the DAO "${contract.address}"`
        }

        updatedStates[3] = {
          activeText: `Waiting for DAO to be indexed`,
          completedText: ""
        }

        setActiveState(3)
        setStates(updatedStates)

        mixpanel.track("Completed DAO creation", {
          daoName: params.orgSettings.name,
          daoType: params.template
        })
      }

      console.log("This is the contract deployed", contract)

      mixpanel.track("Waiting for DAO indexation", {
        daoName: params.orgSettings.name,
        daoType: params.template
      })

      const indexed = await waitForIndexation(contract.address)

      updatedStates[4] = {
        activeText: `Deployling Lite DAO`,
        completedText: ""
      }

      setActiveState(4)
      setStates(updatedStates)

      if (wallet) {
        const values = {
          name: params.orgSettings.name,
          description: params.orgSettings.description,
          linkToTerms: contract.address,
          picUri: "",
          members: [],
          polls: [],
          tokenAddress: params.orgSettings.governanceToken.address,
          tokenType: "FA2",
          requiredTokenOwnership: true,
          allowPublicAccess: true,
          network: network,
          daoContract: contract.address,
          tokenID: params.orgSettings.governanceToken.tokenId
        }
        const { signature, payloadBytes } = await getSignature(account, wallet, JSON.stringify(values))
        const publicKey = (await wallet?.client.getActiveAccount())?.publicKey

        await saveLiteCommunity(signature, publicKey, payloadBytes)

        updatedStates[4] = {
          activeText: "",
          completedText: "Successfully deployed Lite DAO"
        }

        setActiveState(5)
        setStates(updatedStates)

        updatedStates[5] = {
          ...updatedStates[5],
          completedText: indexed
            ? `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully`
            : `Deployed ${metadataParams.metadata.unfrozenToken.name} successfully, but metadata has not been indexed yet. This usually takes a few minutes, your DAO page may not be available yet.`
        }

        setActiveState(6)
        setStates(updatedStates)
      }

      mixpanel.track("Completed DAO indexation", {
        daoName: params.orgSettings.name,
        daoType: params.template
      })

      return contract
    },
    {
      onSuccess: () => {
        queryClient.resetQueries()
      }
    }
  )

  return { mutation: result, states, activeState }
}
