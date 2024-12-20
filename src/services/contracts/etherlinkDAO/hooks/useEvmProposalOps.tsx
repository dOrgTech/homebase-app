import { ethers } from "ethers"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"

import HbTokenAbi from "assets/abis/hb_evm.json"
import HbDaoAbi from "assets/abis/hb_dao.json"

const proposalInterfaces = [
  {
    interface: ["function editRegistry(string key, string Value)"],
    name: "editRegistry"
  },
  {
    interface: ["function mint(address to, uint256 amount)"],
    name: "mint"
  },
  {
    interface: ["function burn(address from, uint256 amount)"],
    name: "burn"
  },
  {
    interface: ["function transferETH(address to, uint256 amount)"],
    name: "transferETH"
  },
  {
    interface: ["function transferERC20(address token, address to, uint256 amount)"],
    name: "transferERC20"
  },
  {
    interface: ["function transferERC721(address token, address to, uint256 tokenId)"],
    name: "transferERC721"
  },
  {
    interface: ["function updateQuorumNumerator(uint256 newQuorumNumerator)"],
    name: "updateQuorumNumerator"
  },
  {
    interface: ["function setVotingDelay(uint256 newVotingDelay)"],
    name: "setVotingDelay"
  },
  {
    interface: ["function setVotingPeriod(uint256 newVotingPeriod)"],
    name: "setVotingPeriod"
  },
  {
    interface: ["function setProposalThreshold(uint256 newProposalThreshold)"],
    name: "setProposalThreshold"
  }
]

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
    quorumNumerator: string
    votingDelay: string
    votingPeriod: string
    proposalThreshold: string
  }
  setDaoConfig: (type: "quorumNumerator" | "votingDelay" | "votingPeriod" | "proposalThreshold", value?: string) => void
  daoTokenOps: {
    type: "mint" | "burn" | ""
    mint: {
      to: string
      amount: string
    }
    burn: {
      from: string
      amount: string
    }
  }
  setDaoTokenOps: (type: "mint" | "burn", value?: any) => void
  getMetadata: () => EvmProposalCreateStore["metadata"]
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
      createProposalPayload: {
        targets: [],
        values: [], // Will be always ["0","0","0"]
        calldatas: [],
        description: ""
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
        set({ daoRegistry: { ...get().daoRegistry, [type]: value } })
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
        quorumNumerator: "",
        votingDelay: "",
        votingPeriod: "",
        proposalThreshold: ""
      },
      setDaoConfig: (
        type: "quorumNumerator" | "votingDelay" | "votingPeriod" | "proposalThreshold",
        value?: string
      ) => {
        if (!value) return set({ daoConfig: { ...get().daoConfig, type }, currentStep: 3 })
        set({ daoConfig: { ...get().daoConfig, [type]: value } })
      },
      daoTokenOps: {
        type: "",
        mint: {
          to: "",
          amount: ""
        },
        burn: {
          from: "",
          amount: ""
        }
      },
      setDaoTokenOps: (type: "mint" | "burn", value?: any) => {
        if (!value) return set({ daoTokenOps: { ...get().daoTokenOps, type }, currentStep: 3 })
        set({ daoTokenOps: { ...get().daoTokenOps, [type]: value } })
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

  const zustantStore = useEvmProposalCreateZustantStore()
  const currentStep = zustantStore.currentStep
  const proposalType = zustantStore.getMetadataFieldValue("type")

  const daoContract = useMemo(() => {
    console.log("DaoContract", daoSelected?.address, HbDaoAbi.abi)
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
      if (currentStep == 0) {
        zustantStore.setCurrentStep(currentStep + 1)
      } else if (currentStep == 1) {
        zustantStore.setCurrentStep(currentStep + 1)
        // "${p.name}0|||0${p.type}0|||0${p.description}0|||0${p.externalResource}"
        const metadata = zustantStore.getMetadata()
        const description = `${metadata.title}0|||0${
          metadata.type === "transfer_assets" ? "transfer" : metadata.type
        }0|||0${metadata.description}0|||0${metadata.discussionUrl}`
        zustantStore.setCreateProposalFieldValues("description", description)
      } else {
        // At Step 2 we call the Contract
        setIsLoading(true)

        console.log("zustantStore.createProposalPayload", zustantStore.createProposalPayload)
        createProposal(zustantStore.createProposalPayload).then((createdProposal: any) => {
          console.log("createdProposal", createdProposal)
          setIsLoading(false)
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
