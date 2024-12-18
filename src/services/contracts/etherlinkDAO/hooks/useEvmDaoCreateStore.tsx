import { ethers } from "ethers"
import { create } from "zustand"

import { persist, createJSONStorage } from "zustand/middleware"

import { STEPS } from "modules/etherlink/config"
import { useHistory } from "react-router-dom"
import HbWrapperAbi from "assets/abis/hb_wrapper.json"

import { useCallback, useContext, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"

interface EvmDaoCreateStore {
  currentStep: number
  data: Record<string, any>
  loading: Record<string, boolean>
  errors: Record<string, any | null>
  touched: Record<string, any>
  getIn: (field: string) => any
  setFieldValue: (field: string, value: any) => void
  next: {
    text: string
    handler: () => string | undefined
  }
  prev: {
    text: string
    handler: () => string | undefined
  }
}

const useEvmDaoCreateZustantStore = create<EvmDaoCreateStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      data: {
        name: "",
        template: "full",
        symbol: "",
        description: "",
        administrator: "",
        governanceToken: {
          address: "",
          symbol: "",
          tokenDecimals: 0
        },
        quorum: {
          returnedTokenPercentage: 0,
          proposalThresholdPercentage: 0
        },
        members: [{ address: "", amountOfTokens: 0 }],
        voting: {
          votingBlocksDay: 0,
          votingBlocksHours: 0,
          votingBlocksMinutes: 0,
          proposalFlushBlocksDay: 0,
          proposalFlushBlocksHours: 0,
          proposalFlushBlocksMinutes: 0,
          proposalExpiryBlocksDay: 0,
          proposalExpiryBlocksHours: 0,
          proposalExpiryBlocksMinutes: 0
        },
        registry: {}
      },
      getIn: (field: string) => {
        if (field.includes(".")) {
          const [parent, child] = field.split(".")
          return get().data[parent][child]
        }
        return get().data[field]
      },
      setFieldValue: (field: string, value: any) => {
        if (field.includes(".")) {
          const [parent, child] = field.split(".")
          set({
            data: {
              ...get().data,
              [parent]: {
                ...(get().data[parent] || {}),
                [child]: value
              }
            },
            touched: {
              ...get().touched,
              [parent]: {
                ...(get().touched[parent] || {}),
                [child]: true
              }
            }
          })
        } else {
          set({
            data: { ...get().data, [field]: value },
            touched: { ...get().touched, [field]: true }
          })
        }
      },
      next: {
        text: "Next",
        handler: () => {
          const { currentStep } = get()
          if (currentStep === STEPS.length - 1) return
          console.log("Moving to Next Step", currentStep)
          set({ currentStep: currentStep + 1 })
          return STEPS[currentStep + 1]?.path
        }
      },
      prev: {
        text: "Back",
        handler: () => {
          const { currentStep } = get()
          if (currentStep === 0) return
          console.log("Moving to Previous Step", currentStep)
          set({ currentStep: currentStep - 1 })
          return STEPS[currentStep - 1]?.path
        }
      },
      loading: {},
      touched: {
        name: false,
        symbol: false,
        description: false,
        administrator: false,
        governanceToken: {
          address: false,
          symbol: false,
          tokenDecimals: false
        }
      },
      errors: {
        name: "",
        symbol: "",
        description: "",
        administrator: "",
        governanceToken: {
          address: "",
          symbol: "",
          tokenDecimals: 0
        }
      }
    }),
    {
      name: "evm-dao-create-store",
      partialize: state => ({
        data: state.data,
        touched: state.touched,
        errors: state.errors
      }),
      storage: createJSONStorage(() => localStorage)
    }
  )
)

const useEvmDaoCreateStore = () => {
  const [isDeploying, setIsDeploying] = useState(false)
  const data = useEvmDaoCreateZustantStore()
  const history = useHistory()
  const { contractData } = useContext(EtherlinkContext)
  const wrapperAddress = contractData?.wrapper
  const { etherlink } = useTezos()

  const deployDaoWithWrapper = useCallback(async () => {
    const daoData = data.data
    // console.log({ daoData })
    // return
    try {
      // Get wrapper factory
      const samplePayload = [
        "SundayX", // DAO Name
        "SUNX", // DAO Symbol
        "Getting ready for the week.", // DAO Description
        2, // Token Decimals
        60, // Execution Delay in seconds
        ["0xa9F8F9C0bf3188cEDdb9684ae28655187552bAE9", "0xA6A40E0b6DB5a6f808703DBe91DbE50B7FC1fa3E"], // Initial Members
        [
          5000000, // Member 1 Token Allocation
          3450000, // Member 2 Token Allocation
          2, // Voting Delay in minutes
          3, // Voting Duration in minutes
          4000, // Proposal Threshold (1% of total supply)
          50 // Quorum (4% of total supply)
        ],
        ["Founder", "Mission"], // Registry Keys
        ["Alice", "Promote Decentralization"] // Registry Values
      ]
      setIsDeploying(true)
      const totalTokenSupply = daoData.members.reduce((acc: number, member: any) => acc + member.amountOfTokens, 0)
      const proposalThreshhold = (daoData.quorum.proposalThresholdPercentage / 100) * totalTokenSupply
      const quorumThreshold = (daoData.quorum.returnedTokenPercentage / 100) * totalTokenSupply

      const executationDelayinSeconds =
        daoData.voting.proposalExpiryBlocksDay * 24 * 60 * 60 +
        daoData.voting.proposalExpiryBlocksHours * 60 * 60 +
        daoData.voting.proposalExpiryBlocksMinutes * 60

      const votingDelayInMinutes =
        daoData.voting.votingBlocksDay * 24 * 60 +
        daoData.voting.votingBlocksHours * 60 +
        daoData.voting.votingBlocksMinutes

      const votingDurationInMinutes =
        daoData.voting.proposalFlushBlocksDay * 24 * 60 +
        daoData.voting.proposalFlushBlocksHours * 60 +
        daoData.voting.proposalFlushBlocksMinutes

      const wrapperFactory: ethers.Contract = new ethers.Contract(wrapperAddress, HbWrapperAbi.abi, etherlink.signer)
      const wrapper: ethers.Contract = await wrapperFactory.deployDAOwithToken({
        name: daoData.name,
        symbol: daoData.governanceToken.symbol,
        description: daoData.description,
        decimals: daoData.governanceToken.tokenDecimals,
        executionDelay: executationDelayinSeconds,
        initialMembers: daoData.members.map((member: any) => member.address),
        initialAmounts: [
          ...daoData.members.map((member: any) => member.amountOfTokens),
          votingDelayInMinutes,
          votingDurationInMinutes,
          proposalThreshhold,
          quorumThreshold
        ],
        keys: Object.keys(daoData.registry),
        values: Object.values(daoData.registry)
      })

      console.log("Transaction sent:", wrapper.hash)

      const receipt = await wrapper.wait()
      console.log("Transaction confirmed:", receipt)
    } catch (error) {
      console.error("Error deploying DAO", error)
      return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.data, etherlink.signer, wrapperAddress])
  const isFinalStep = data.currentStep === STEPS.length - 1

  return {
    ...data,
    isDeploying,
    next: {
      text: isFinalStep ? "Deploy" : "Next",
      handler: () => {
        if (data.data.template === "lite") return history.push("/lite")
        if (isFinalStep) {
          deployDaoWithWrapper()
        } else {
          const nextStep = data.next.handler()
          if (nextStep) {
            history.push(nextStep)
          }
        }
      }
    },
    prev: {
      text: "Back",
      handler: () => {
        const prevStep = data.prev.handler()
        if (prevStep) {
          history.push(prevStep)
        }
      }
    }
  }
}

export default useEvmDaoCreateStore
