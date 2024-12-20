import { ethers } from "ethers"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"

import HbTokenAbi from "assets/abis/hb_evm.json"
import HbDaoAbi from "assets/abis/hb_dao.json"
import { useNotification } from "modules/common/hooks/useNotification"
import { EvmProposalOptions, proposalInterfaces } from "modules/etherlink/config"
import { useHistory } from "react-router-dom"

function getDaoConfigType(type: string) {
  if (type === "quorumNumerator") return "quorum"
  if (type === "votingDelay") return "voting delay"
  if (type === "votingPeriod") return "voting period"
  if (type === "proposalThreshold") return "proposal threshold"
  return ""
}

function getDaoTokenOpsType(type: string, tokenSymbol: string) {
  if (type === "mint") return `Mint${tokenSymbol}`
  if (type === "burn") return `Burn${tokenSymbol}`
  return ""
}

interface EvmProposalCreateStore {
  currentStep: number
  setCurrentStep: (step: number) => void
  metadata: {
    type: "off_chain_debate" | "transfer_assets" | "edit_registry" | "contract_call" | "change_config" | ""
    title: string
    description: string
    discussionUrl: string
  }
  transferAssets: {
    transactions: any
  }
  daoRegistry: {
    key: string
    value: string
  }
  setDaoRegistry: (type: "key" | "value", value: string) => void
  createProposalPayload: {
    targets: any[]
    values: any[]
    calldatas: any[]
    description: string
  }
  setCreateProposalPayload: (payload: any) => void
  setTransferAssets: (transactions: any[]) => void
  daoContractCall: {
    targetAddress: string
    value: string
    functionDefinition: string
    callData: string
  }
  setDaoContractCall: (type: "targetAddress" | "value" | "functionDefinition" | "callData", value: string) => void
  daoConfig: {
    type: "quorumNumerator" | "votingDelay" | "votingPeriod" | "proposalThreshold" | ""
    address: string
    quorumNumerator: string
    votingDelay: string
    votingPeriod: string
    proposalThreshold: string
  }
  setDaoConfig: (
    type: "quorumNumerator" | "votingDelay" | "votingPeriod" | "proposalThreshold",
    value?: string,
    address?: string
  ) => void
  daoTokenOps: {
    type: "mint" | "burn" | ""
    token: {
      symbol: string
      address: string
    }
    mint: {
      to: string
      amount: string
    }
    burn: {
      to: string
      amount: string
    }
  }
  setDaoTokenOps: (type: "mint" | "burn", value?: any, tokenSymbol?: string, tokenAddress?: string) => void
  getMetadata: () => EvmProposalCreateStore["metadata"]
  setMetadata: (metadata: EvmProposalCreateStore["metadata"]) => void
  getMetadataFieldValue: (field: keyof EvmProposalCreateStore["metadata"]) => string
  setMetadataFieldValue: (field: keyof EvmProposalCreateStore["metadata"], value: string) => void
  setCreateProposalFieldValues: (
    field: keyof EvmProposalCreateStore["createProposalPayload"],
    value: string | string[]
  ) => void
}

const useEvmProposalCreateZustantStore = create<EvmProposalCreateStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      setCurrentStep: (step: number) => {
        set({ currentStep: step })
      },
      metadata: {
        type: "",
        title: "",
        description: "",
        discussionUrl: ""
      },
      setMetadata: (metadata: EvmProposalCreateStore["metadata"]) => {
        set({ metadata })
      },
      createProposalPayload: {
        targets: [],
        values: [], // Will be always ["0","0","0"]
        calldatas: [],
        description: ""
      },
      setCreateProposalPayload: (payload: any) => {
        set({ createProposalPayload: payload })
      },
      transferAssets: {
        transactions: [
          {
            assetType: "XTZ",
            recipient: "",
            amount: ""
          }
        ]
      },
      setTransferAssets: (transactions: any[]) => {
        const selectedInterface = proposalInterfaces.find(p => p.name === "transferETH")
        if (!selectedInterface) return
        const iface = new ethers.Interface(selectedInterface.interface)
        const callData: string[] = []
        transactions
          .filter(
            (transaction: any) =>
              transaction.recipient?.length > 0 &&
              transaction.amount > 0 &&
              transaction.recipient &&
              ethers.isAddress(transaction.recipient)
          )
          .forEach((transaction: any) => {
            callData.push(
              iface.encodeFunctionData(selectedInterface.name, [
                transaction.recipient,
                ethers.parseEther(transaction.amount)
              ])
            )
          })
        const payload = {
          transferAssets: { transactions },
          createProposalPayload: {
            targets: Object.keys(transactions).map((key: any) => "0x18CA3b7277e25b952834911B1c2e9a9AB4436cA3"), // DAO Treasury Address
            // targets: Object.keys(transactions).map((key: any) => transactions[key].recipient),
            values: Object.keys(transactions).map((key: any) => "0"),
            calldatas: callData,
            description: get().createProposalPayload.description
          }
        }
        set(payload)
      },
      daoRegistry: {
        key: "",
        value: ""
      },
      setDaoRegistry: (type: "key" | "value", value: string) => {
        const selectedPropType = EvmProposalOptions.find(p => p.modal === "edit_registry")
        const selectedInterface = selectedPropType?.interface?.editRegistry
        if (!selectedInterface) return console.log("No interface found")
        const iface = new ethers.Interface(selectedInterface.interface)
        const encodedData = iface.encodeFunctionData(selectedInterface.name, [
          get().daoRegistry.key,
          get().daoRegistry.value
        ])
        set({
          daoRegistry: { ...get().daoRegistry, [type]: value },
          createProposalPayload: { ...get().createProposalPayload, calldatas: [encodedData] }
        })
      },
      daoContractCall: {
        targetAddress: "",
        value: "",
        functionDefinition: "",
        callData: ""
      },
      setDaoContractCall: (type: "targetAddress" | "value" | "functionDefinition" | "callData", value: string) => {
        set({ daoContractCall: { ...get().daoContractCall, [type]: value } })
      },
      daoConfig: {
        type: "",
        address: "",
        quorumNumerator: "",
        votingDelay: "",
        votingPeriod: "",
        proposalThreshold: ""
      },
      setDaoConfig: (
        type: "quorumNumerator" | "votingDelay" | "votingPeriod" | "proposalThreshold",
        value?: string,
        daoAddress?: string
      ) => {
        if (!value && daoAddress) {
          const proposalDescription = get().createProposalPayload.description
          const proposalDescriptionSplit = proposalDescription.split("0|||0")
          proposalDescriptionSplit[1] = getDaoConfigType(type)
          const description = proposalDescriptionSplit.join("0|||0")
          return set({
            daoConfig: { ...get().daoConfig, type, address: daoAddress },
            createProposalPayload: { ...get().createProposalPayload, description },
            currentStep: 3
          })
        }
        const payload = { daoConfig: { ...get().daoConfig, [type]: value } } as any
        // TODO: handle this within next handler
        // let ifaceDef, iface: any, encodedData: any
        // if (type === "quorumNumerator") {
        //   ifaceDef = proposalInterfaces.find(p => p.name === "updateQuorumNumerator")
        //   if (!ifaceDef) return
        //   iface = new ethers.Interface(ifaceDef.interface)
        //   encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
        // }
        // if (type === "votingDelay") {
        //   ifaceDef = proposalInterfaces.find(p => p.name === "setVotingDelay")
        //   if (!ifaceDef) return
        //   iface = new ethers.Interface(ifaceDef.interface)
        //   encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
        // }
        // if (type === "votingPeriod") {
        //   ifaceDef = proposalInterfaces.find(p => p.name === "setVotingPeriod")
        //   if (!ifaceDef) return
        //   iface = new ethers.Interface(ifaceDef.interface)
        //   encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
        // }
        // if (type === "proposalThreshold") {
        //   ifaceDef = proposalInterfaces.find(p => p.name === "setProposalThreshold")
        //   if (!ifaceDef) return
        //   iface = new ethers.Interface(ifaceDef.interface)
        //   encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
        // }

        // payload.createProposalPayload = {
        //   ...get().createProposalPayload,
        //   targets: [daoSelected?.registryAddress],
        //   values: [0],
        //   calldatas: [encodedData],
        //   description: get().createProposalPayload.description
        // }
        set(payload)
      },
      daoTokenOps: {
        type: "",
        token: {
          symbol: "",
          address: ""
        },
        mint: {
          to: "",
          amount: ""
        },
        burn: {
          to: "",
          amount: ""
        }
      },
      setDaoTokenOps: (type: "mint" | "burn", value?: any, tokenSymbol?: string, tokenAddress?: string) => {
        console.log("setDaoTokenOps", type, value, tokenSymbol)
        if (!value && tokenSymbol && tokenAddress) {
          const proposalDescription = get().createProposalPayload.description
          const proposalDescriptionSplit = proposalDescription.split("0|||0")
          proposalDescriptionSplit[1] = getDaoTokenOpsType(type, tokenSymbol)
          const description = proposalDescriptionSplit.join("0|||0")
          console.log("new description", description)
          return set({
            daoTokenOps: { ...get().daoTokenOps, type, token: { symbol: tokenSymbol, address: tokenAddress } },
            createProposalPayload: { ...get().createProposalPayload, description },
            currentStep: 3
          })
        }
        const selectedInterface = proposalInterfaces.find(p => p.name === "transferERC20")
        if (!selectedInterface) return
        const payload = { daoTokenOps: { ...get().daoTokenOps, [type]: value } } as any
        const iface = new ethers.Interface(selectedInterface.interface)
        const targetAddress = get().daoTokenOps[type]?.to
        const targetAmount = get().daoTokenOps[type]?.amount
        if (ethers.isAddress(targetAddress) && targetAmount && !isNaN(Number(targetAmount))) {
          const encodedData = iface.encodeFunctionData(selectedInterface.name, [
            get().daoTokenOps.token.address,
            targetAddress,
            ethers.parseEther(targetAmount)
          ])
          payload.createProposalPayload = {
            ...get().createProposalPayload,
            calldatas: [encodedData]
          }
        }
        set(payload)
      },
      getMetadata: () => {
        return get().metadata
      },
      getMetadataFieldValue: (field: keyof EvmProposalCreateStore["metadata"]) => {
        return get().metadata[field]
      },
      setMetadataFieldValue: (field: keyof EvmProposalCreateStore["metadata"], value: string) => {
        const payload = {
          metadata: { ...get().metadata, [field]: value }
        } as any

        if (field === "type" && value !== "") {
          payload["currentStep"] = 1
        }
        if (field === "type" && value === "") {
          payload["currentStep"] = 0
        }
        set(payload)
      },
      setCreateProposalFieldValues: (
        field: keyof EvmProposalCreateStore["createProposalPayload"],
        value: string | string[]
      ) => {
        const payload = {
          createProposalPayload: { ...get().createProposalPayload, [field]: value }
        } as any
        set(payload)
      }
    }),
    {
      name: "evm-proposal-create-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export const useEvmProposalOps = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { etherlink } = useTezos()
  const { daoSelected } = useContext(EtherlinkContext)
  const router = useHistory()

  const zustantStore = useEvmProposalCreateZustantStore()
  const openNotification = useNotification()
  const currentStep = zustantStore.currentStep
  const proposalType = zustantStore.getMetadataFieldValue("type")

  const daoContract = useMemo(() => {
    console.log("DaoContract", daoSelected?.address, HbDaoAbi.abi)
    if (!daoSelected?.address || !etherlink.signer) return
    return new ethers.Contract(daoSelected?.address, HbDaoAbi.abi, etherlink.signer)
  }, [daoSelected?.address, etherlink.signer])

  console.log("currentStep", currentStep, proposalType)

  const createProposal = useCallback(
    async (payload: Record<string, any>) => {
      if (!daoSelected || !daoContract) return

      const tx = await daoContract.propose(...Object.values(payload))
      console.log("Proposal transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Proposal transaction confirmed:", receipt)
      return receipt
    },
    [daoSelected, daoContract]
  )

  const castVote = useCallback(
    async (proposalId: number, support: boolean) => {
      if (!daoContract) return

      const tx = await daoContract.castVote(proposalId, support)
      console.log("Vote transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Vote transaction confirmed:", receipt)
      return receipt
    },
    [daoContract]
  )

  const executeProposal = useCallback(
    async (proposalId: number) => {
      if (!daoContract) return

      const tx = await daoContract.execute(proposalId)
      console.log("Execute transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Execute transaction confirmed:", receipt)
      return receipt
    },
    [daoContract]
  )

  const nextStep = {
    text: isLoading ? "Please wait..." : "Next",
    handler: () => {
      //   const selectedInterface = proposalInterfaces.find(p => p.name === "transferETH")
      //   if (!selectedInterface) return
      //   console.log("selectedInterface", selectedInterface)
      //   const iface = new ethers.Interface(selectedInterface.interface)
      //   const encodedData = iface.encodeFunctionData(selectedInterface.name, [
      //     "0xa9F8F9C0bf3188cEDdb9684ae28655187552bAE9",
      //     ethers.parseEther("1")
      //   ])
      //   console.log(
      //     "encodedData",
      //     ethers.parseEther("1"),
      //     encodedData,
      //     encodedData ===
      //       "0x7b1a4909000000000000000000000000a9f8f9c0bf3188ceddb9684ae28655187552bae90000000000000000000000000000000000000000000000000de0b6b3a7640000"
      //   )
      //   return
      const selectedOption = EvmProposalOptions.find((p: any) => p.modal === proposalType) as any
      if (currentStep == 0) {
        zustantStore.setCurrentStep(1)
      }
      // Setting up Proposal Title, Details and Link
      else if (currentStep == 1) {
        const metadata = zustantStore.getMetadata()
        // "${p.name}0|||0${p.type}0|||0${p.description}0|||0${p.externalResource}"
        if (selectedOption?.last_step === 2) {
          const proposalType = selectedOption?.proposal_type()
          const description = `${metadata.title}0|||0${proposalType}0|||0${metadata.description}0|||0${metadata.discussionUrl}`
          zustantStore.setCreateProposalPayload({
            ...zustantStore.createProposalPayload,
            targets: [daoSelected?.registryAddress],
            values: [0],
            description: description
          })
        } else {
          zustantStore.setCreateProposalFieldValues(
            "description",
            `${metadata.title}0|||0UNKNOWN0|||0${metadata.description}0|||0${metadata.discussionUrl}`
          )
        }
        zustantStore.setCurrentStep(currentStep + 1)
      } else if (currentStep === selectedOption?.last_step) {
        // At Step 2 we call the Contract
        // setIsLoading(true)

        console.log("zustantStore.createProposalPayload", zustantStore.createProposalPayload)
        const { closeSnackbar } = openNotification({
          message: "Creating Proposal...",
          variant: "success"
        })

        createProposal(zustantStore.createProposalPayload)
          .then((createdProposal: any) => {
            console.log("createdProposal", createdProposal)
            setIsLoading(false)
            zustantStore.setCurrentStep(0)
            zustantStore.setCreateProposalPayload({
              targets: [],
              values: [],
              calldatas: [],
              description: ""
            })
            zustantStore.setMetadata({
              type: "",
              title: "",
              description: "",
              discussionUrl: ""
            })
            router.push(`/explorer/etherlink/dao/${daoSelected?.address}/proposals`)
          })
          .catch(err => {
            console.log("Error creating proposal", err)
            openNotification({
              message: `Error creating proposal: ${err.message}`,
              variant: "error",
              autoHideDuration: 3000
            })
          })
          .finally(() => {
            closeSnackbar()
          })
      }
    }
  }

  const prevStep = {
    text: "Back",
    handler: () => {
      zustantStore.setCurrentStep(zustantStore.currentStep - 1)
    }
  }

  return {
    isLoading,
    setIsLoading,
    createProposal,
    castVote,
    executeProposal,
    signer: etherlink?.signer,
    nextStep,
    prevStep,
    ...zustantStore
  }
}
