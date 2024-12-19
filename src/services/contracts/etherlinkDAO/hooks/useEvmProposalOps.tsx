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
    interface: "function editRegistry(string key, string Value)",
    name: "editRegistry"
  },
  {
    interface: "function mint(address to, uint256 amount)",
    name: "mint"
  },
  {
    interface: "function burn(address from, uint256 amount)",
    name: "burn"
  },
  {
    interface: "function transferETH(address to, uint256 amount)",
    name: "transferETH"
  },
  {
    interface: "function transferERC20(address token, address to, uint256 amount)",
    name: "transferERC20"
  },
  {
    interface: "function transferERC721(address token, address to, uint256 tokenId)",
    name: "transferERC721"
  },
  {
    interface: "function updateQuorumNumerator(uint256 newQuorumNumerator)",
    name: "updateQuorumNumerator"
  },
  {
    interface: "function setVotingDelay(uint256 newVotingDelay)",
    name: "setVotingDelay"
  },
  {
    interface: "function setVotingPeriod(uint256 newVotingPeriod)",
    name: "setVotingPeriod"
  },
  {
    interface: "function setProposalThreshold(uint256 newProposalThreshold)",
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
  createProposalPayload: {
    targets: any[]
    values: any[]
    calldatas: any[]
    description: string
  }
  setTransferAssets: (transactions: any[]) => void
  getMetadata: () => EvmProposalCreateStore["metadata"]
  getMetadataFieldValue: (field: keyof EvmProposalCreateStore["metadata"]) => string
  setMetadataFieldValue: (field: keyof EvmProposalCreateStore["metadata"], value: string) => void
  setCreateProposalFieldValues: (field: keyof EvmProposalCreateStore["createProposalPayload"], value: string) => void
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
        const payload = {
          transferAssets: { transactions },
          createProposalPayload: {
            targets: Object.keys(transactions).map((key: any) => transactions[key].recipient),
            values: Object.keys(transactions).map((key: any) => transactions[key].amount),
            calldatas: [],
            description: ""
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
      setCreateProposalFieldValues: (field: keyof EvmProposalCreateStore["createProposalPayload"], value: string) => {
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
    return new ethers.Contract(daoSelected?.token, HbDaoAbi.abi, etherlink.signer)
  }, [daoSelected?.token, etherlink.signer])

  console.log("currentStep", currentStep, proposalType)

  const createProposal = useCallback(
    async (payload: Record<string, any>) => {
      if (!daoSelected || !daoContract) return

      const tx = await daoContract.propose(payload)
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
      const iface = new ethers.Interface(["function transferETH(address to, uint256 amount)"])
      const encodedData = iface.encodeFunctionData("transferETH", [
        "0xa9F8F9C0bf3188cEDdb9684ae28655187552bAE9",
        ethers.parseEther("1")
      ])
      console.log(
        "encodedData",
        ethers.parseEther("1"),
        encodedData,
        encodedData ===
          "0x7b1a4909000000000000000000000000a9f8f9c0bf3188ceddb9684ae28655187552bae90000000000000000000000000000000000000000000000000de0b6b3a7640000"
      )
      return
      if (currentStep == 0) {
        zustantStore.setCurrentStep(currentStep + 1)
      } else if (currentStep == 1) {
        zustantStore.setCurrentStep(currentStep + 1)
        // "${p.name}0|||0${p.type}0|||0${p.description}0|||0${p.externalResource}"
        const metadata = zustantStore.getMetadata()
        const descriptionType = metadata.type === "transfer_assets" ? "transfer" : "off_chain_debate"
        const description = `${metadata.title}0|||0${metadata.type}0|||0${metadata.description}0|||0${metadata.discussionUrl}`
        zustantStore.setCreateProposalFieldValues("description", description)
      } else {
        // At Step 2 we call the Contract
        setIsLoading(true)
        createProposal(zustantStore.createProposalPayload).then(() => {
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
