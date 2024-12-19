import { ethers } from "ethers"
import { create } from "zustand"
import { STEPS } from "modules/etherlink/config"
import { useHistory } from "react-router-dom"
import HbEvmAbi from "assets/abis/hb_evm.json"
import HbDaoAbi from "assets/abis/hb_dao.json"
import HbTimelockAbi from "assets/abis/hb_timelock.json"
import HbWrapperAbi from "assets/abis/hb_wrapper.json"

import { useCallback, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { DAO_ABI, DAO_BYTECODE, wrapperAbiGlobal } from "./temp-config"

// const DAO_ABI = HbDaoAbi.output.abi
// const DAO_BYTECODE = HbDaoAbi.output.bytecode

interface EvmDaoCreateStore {
  currentStep: number
  data: Record<string, any>
  loading: Record<string, boolean>
  error: Record<string, string | null>
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

const useEvmDaoCreateZustantStore = create<EvmDaoCreateStore>((set, get) => ({
  currentStep: 0,
  data: {
    name: "",
    symbol: "",
    description: "",
    administrator: "",
    governanceToken: {
      address: "",
      symbol: "",
      tokenDecimals: 0
    },
    quorum: {
      returnedTokenPercentage: 0
    },
    members: [{ address: "", amountOfTokens: 0 }],
    voting: {
      votingBlocksDay: 0,
      votingBlocksWeek: 0
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
      set({ data: { ...get().data, [parent]: { ...get().data[parent], [child]: value } } })
    } else {
      set({ data: { ...get().data, [field]: value } })
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
  error: {}
}))

const useEvmDaoCreateStore = () => {
  const [isDeploying, setIsDeploying] = useState(false)
  const data = useEvmDaoCreateZustantStore()
  const history = useHistory()
  const { etherlink } = useTezos()
  const initialMembers = ["0x1E4f6Bbb0448ad06b7b777BBBe6909385d477EE1"]
  const initialAmounts = [1000]
  const minDelay = 0
  const minVotingDelay = 4
  const proposalThreshhold = 1
  const quorumRequired = 1

  const proposers = [] as string[]
  const executors = [] as string[]

  const deployDao = useCallback(async () => {
    const daoData = data.data

    try {
      const tokenFactory = new ethers.ContractFactory(HbEvmAbi.abi, HbEvmAbi.bytecode, etherlink.signer)
      const timelockFactory = new ethers.ContractFactory(HbTimelockAbi.abi, HbTimelockAbi.bytecode, etherlink.signer)
      const daoFactory = new ethers.ContractFactory(HbDaoAbi.abi, HbDaoAbi.bytecode, etherlink.signer)

      const token = await tokenFactory.deploy("MyToken", "MTK", 3, initialMembers, initialAmounts)
      await token.waitForDeployment()
      console.log("Token deployed at:", token.target)

      const deployedToken = new ethers.Contract(token.target, HbEvmAbi.abi, etherlink.signer)
      const setDelegateTx = await deployedToken.delegate(etherlink.signer.address)
      await setDelegateTx.wait()
      console.log("Token delegate set at:", etherlink.signer.address)

      console.log("Deploying TimeLockController contract...")

      const timeLock = await timelockFactory.deploy(minDelay, proposers, executors, etherlink.signer.address)
      await timeLock.waitForDeployment()
      console.log("TimeLockController deployed at:", timeLock.target)

      const hbDao = await daoFactory.deploy(
        deployedToken.target,
        timeLock.target,
        "AKDAO",
        minDelay,
        minVotingDelay,
        proposalThreshhold,
        quorumRequired
      )
      await hbDao.waitForDeployment()
      console.log("HomebaseDAO deployed at:", hbDao.target)
    } catch (e) {
      console.error("Error deploying DAO", e)
      return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.data])

  const deployDaoWrapper = useCallback(async () => {
    const daoData = data.data

    try {
      const wrapperFactory = new ethers.ContractFactory(HbWrapperAbi.abi, HbWrapperAbi.bytecode, etherlink.signer)
      const wrapper = await wrapperFactory.deploy(
        "AK DAO1", // DAO Name
        "AKD", // DAO Symbol
        "About DAO1", // DAO Description
        "3", // Token Decimals
        "6", // Execution Delay in minutes
        initialMembers, // Initial Members
        [
          ...initialAmounts, // Members 1 Token Allocation
          "5", // voting delay in minutes
          "10", // voting duration in minutes (e.g.10 minutes)
          "1", // proposal threshold (1% of total supply)
          "4" // quorum (4% of total supply)
        ],
        ["RKEY"], // Registry Keys
        ["RVALUE"] // Registry Values
      )
      await wrapper.waitForDeployment()
      const wrapperAddress = await wrapper.getAddress()
      console.log("Wrapper deployed at:", wrapperAddress)

      // const contract = await factory.deploy(
      //   "AK DAO1", // DAO Name
      //   "AKD", // DAO Symbol
      //   "About DAO1", // DAO Description
      //   "3", // Token Decimals
      //   "6", // Execution Delay in minutes
      //   ["0x1E4f6Bbb0448ad06b7b777BBBe6909385d477EE1"], // Initial Members
      //   [
      //     "1000", // Members 1 Token Allocation
      //     "5", // voting delay in minutes
      //     "10", // voting duration in minutes (e.g.10 minutes)
      //     "1", // proposal threshold (1% of total supply)
      //     "4" // quorum (4% of total supply)
      //   ],
      //   ["RKEY"], // Registry Keys
      //   ["RVALUE"] // Registry Values
      // )
      // const contract = await factory.deploy(
      //   "AK DAO1", // DAO Name
      //   "AKD", // DAO Symbol
      //   "About DAO1", // DAO Description
      //   "3", // Token Decimals
      //   "6", // Execution Delay in minutes
      //   ["0x1E4f6Bbb0448ad06b7b777BBBe6909385d477EE1"], // Initial Members
      //   [
      //     "1000", // Members 1 Token Allocation
      //     "5", // voting delay in minutes
      //     "10", // voting duration in minutes (e.g.10 minutes)
      //     "1", // proposal threshold (1% of total supply)
      //     "4" // quorum (4% of total supply)
      //   ],
      //   ["RKEY"], // Registry Keys
      //   ["RVALUE"] // Registry Values
      // )

      // await contract.waitForDeployment()
      // const contractAddress = await contract.getAddress()
      // alert("Contract deployed at: " + contractAddress)
      // return contractAddress
    } catch (error) {
      console.error("Error deploying DAO", error)
      return null
    }
  }, [data.data, etherlink.signer])
  const isFinalStep = data.currentStep === STEPS.length - 1

  return {
    ...data,
    deployDao,
    next: {
      text: isFinalStep ? "Deploy" : "Next",
      handler: () => {
        if (isFinalStep) {
          deployDao()
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
