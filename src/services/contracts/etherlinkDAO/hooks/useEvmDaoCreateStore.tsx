import { ethers } from "ethers"
import { create } from "zustand"

import { persist, createJSONStorage } from "zustand/middleware"

import { STEPS } from "modules/etherlink/config"
import { useHistory } from "react-router-dom"
import HbWrapperAbi from "assets/abis/hb_wrapper.json"

import { useCallback, useContext, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"
import { useNotification } from "modules/common/hooks/useNotification"

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
  const notify = useNotification()

  const deployDaoWithWrapper = useCallback(async () => {
    const daoData = data.data

    try {
      // Get wrapper factory
      const samplePayload = [
        "SundayZ", // DAO Name
        "SUNZ", // DAO Symbol
        "Getting ready for the week.", // DAO Description
        2, // Token Decimals
        60, // Execution Delay in seconds
        ["0xa9F8F9C0bf3188cEDdb9684ae28655187552bAE9", "0xA6A40E0b6DB5a6f808703DBe91DbE50B7FC1fa3E"], // Initial Members
        [
          5000000, // Member 1 Token Allocation
          3450000, // Member 2 Token Allocation
          2, // Voting Delay in minutes
          3, // Voting Duration in minutes
          4000, // Proposal Threshold (mamount of
          50 // Quorum (In Percentage 50 for 50% of total supply)
        ],
        ["Founder", "Mission"], // Registry Keys
        ["Alice", "Promote Decentralization"] // Registry Values
      ]

      const totalTokenSupply = daoData.members.reduce((acc: number, member: any) => acc + member.amountOfTokens, 0)
      const proposalThreshhold = daoData.quorum.proposalThreshold
      const quorumThreshold = daoData.quorum.returnedTokenPercentage

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

      const daoCreateObject = {
        name: daoData.name,
        symbol: daoData.governanceToken.symbol,
        description: daoData.description,
        decimals: parseInt(daoData.governanceToken.tokenDecimals),
        executionDelay: executationDelayinSeconds,
        initialMembers: daoData.members.map((member: any) => member.address),
        initialAmounts: [
          ...daoData.members.map(
            (member: any) => parseInt(member.amountOfTokens) * 10 ** Number(daoData.governanceToken.tokenDecimals)
          ),
          parseInt(votingDelayInMinutes),
          parseInt(votingDurationInMinutes),
          isNaN(proposalThreshhold) ? 0 : Number(proposalThreshhold),
          isNaN(quorumThreshold) ? 0 : Number(quorumThreshold)
        ],
        keys: Object.keys(daoData.registry),
        values: Object.values(daoData.registry)
      }
      const daoCreatePayload = Object.values(daoCreateObject)
      console.log({ daoCreatePayload, samplePayload })
      const wrapperFactory: ethers.Contract = new ethers.Contract(wrapperAddress, HbWrapperAbi.abi, etherlink.signer)

      setIsDeploying(true)
      const wrapper: ethers.Contract = await wrapperFactory.deployDAOwithToken(daoCreatePayload)

      // 0xa42621d950bf85d88e35e26b48eb69edd1d0c35b59ee282e3672b0e164ee9aba
      console.log("Transaction sent:", wrapper.hash)

      const receipt = await wrapper.wait()
      // .hash "0xa42621d950bf85d88e35e26b48eb69edd1d0c35b59ee282e3672b0e164ee9aba"
      console.log("Transaction confirmed:", receipt)
      history.push(`/explorer/daos?q=${daoData.name}`)
      // history.push("/explorer/etherlink/dao/0x287915D27CC4FC967Ca10AA20242d80d99caCe5e/overview")
    } catch (error) {
      console.error("Error deploying DAO", error)
      return null
    }
    setIsDeploying(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.data, etherlink.signer, wrapperAddress])
  const isFinalStep = data.currentStep === STEPS.length - 1

  return {
    ...data,
    isDeploying,
    next: {
      text: isDeploying ? "Deploying..." : isFinalStep ? "Deploy" : "Next",
      disabled: isDeploying,
      handler: () => {
        if (data.data.template === "lite") return history.push("/lite")

        // Validation for 1. DAO Basics
        if (
          data.currentStep == 1 &&
          (data.data.name === "" ||
            data.data.governanceToken.symbol === "" ||
            data.data.description === "" ||
            data.data.governanceToken.tokenDecimals < 1)
        ) {
          return notify({
            message: "Please fill in all fields",
            variant: "error"
          })
        }

        // Validation for 2. Proposal & Voting
        if (
          data.currentStep == 2 &&
          Object.values(data.data.voting).reduce((acc: number, curr: any): number => acc + (Number(curr) || 0), 0) < 1
        ) {
          return notify({
            message: "Please add valid values for Voting Delay, Voting Duration, and Execution Delay",
            variant: "error"
          })
        }

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
