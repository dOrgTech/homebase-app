import { ethers, parseUnits } from "ethers"
import { create } from "zustand"

import { persist, createJSONStorage } from "zustand/middleware"

import { STEPS } from "modules/etherlink/config"
import { useHistory } from "react-router-dom"

import WrapperContractAbi from "assets/abis/hb_wrapper_v2.json"
import HbWrapperWLegacyAbi from "assets/abis/hb_wrapper_w_legacy.json"

import { useCallback, useContext, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"
import { EnvKey, getEnv } from "services/config"
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
        tokenDeploymentMechanism: "new",
        wrappedTokenSymbol: "",
        wrappedTokenName: "",
        underlyingTokenAddress: "",
        governanceToken: {
          address: "",
          symbol: "",
          tokenDecimals: 0
        },
        quorum: {
          returnedTokenPercentage: 0,
          proposalThresholdPercentage: 0,
          proposalThreshold: 0
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
  const wrapperAddressOverride = getEnv(EnvKey.REACT_APP_EVM_WRAPPER_T_ADDRESS)
  const wrapperWrappedOverride = getEnv(EnvKey.REACT_APP_EVM_WRAPPER_W_ADDRESS)
  const wrapperAddress = wrapperAddressOverride || contractData?.wrapper_t
  const wrapperAddressForWrapped =
    wrapperWrappedOverride || contractData?.wrapper_w || "0xf4B3022b0fb4e8A73082ba9081722d6a276195c2" // Fallback to known address
  const { etherlink } = useTezos()
  const notify = useNotification()

  const deployDaoWithWrapper = useCallback(async () => {
    const daoData = data.data
    console.log("=== Starting DAO Deployment ===")
    console.log("Full DAO Data:", daoData)

    // Determine wrapper address before attempting deployment (for error reporting)
    const selectedWrapperAddress =
      daoData.tokenDeploymentMechanism === "wrapped" ? wrapperAddressForWrapped : wrapperAddress

    try {
      const proposalThreshold = daoData.quorum.proposalThreshold || daoData.quorum.proposalThresholdPercentage || 0
      const quorumThreshold = daoData.quorum.returnedTokenPercentage

      console.log("Quorum settings:", {
        proposalThreshold,
        quorumThreshold,
        rawQuorum: daoData.quorum,
        proposalThresholdField: daoData.quorum.proposalThreshold,
        proposalThresholdPercentageField: daoData.quorum.proposalThresholdPercentage
      })

      // Convert execution delay values to numbers
      const executionDelayDays = Number(daoData.voting.proposalExpiryBlocksDay) || 0
      const executionDelayHours = Number(daoData.voting.proposalExpiryBlocksHours) || 0
      const executionDelayMinutes = Number(daoData.voting.proposalExpiryBlocksMinutes) || 0

      const executationDelayinSeconds =
        executionDelayDays * 24 * 60 * 60 + executionDelayHours * 60 * 60 + executionDelayMinutes * 60

      console.log("Execution delay calculation:", {
        days: executionDelayDays,
        hours: executionDelayHours,
        minutes: executionDelayMinutes,
        totalSeconds: executationDelayinSeconds,
        originalValues: {
          days: daoData.voting.proposalExpiryBlocksDay,
          hours: daoData.voting.proposalExpiryBlocksHours,
          minutes: daoData.voting.proposalExpiryBlocksMinutes
        }
      })

      // Convert all values to numbers to avoid string concatenation
      const votingDelayDays = Number(daoData.voting.votingBlocksDay) || 0
      const votingDelayHours = Number(daoData.voting.votingBlocksHours) || 0
      const votingDelayMinutes = Number(daoData.voting.votingBlocksMinutes) || 0

      const votingDelayInMinutes = votingDelayDays * 24 * 60 + votingDelayHours * 60 + votingDelayMinutes

      console.log("Voting delay calculation:", {
        days: votingDelayDays,
        hours: votingDelayHours,
        minutes: votingDelayMinutes,
        totalMinutes: votingDelayInMinutes,
        originalValues: {
          days: daoData.voting.votingBlocksDay,
          hours: daoData.voting.votingBlocksHours,
          minutes: daoData.voting.votingBlocksMinutes,
          types: {
            days: typeof daoData.voting.votingBlocksDay,
            hours: typeof daoData.voting.votingBlocksHours,
            minutes: typeof daoData.voting.votingBlocksMinutes
          }
        }
      })

      // Convert voting duration values
      const votingDurationDays = Number(daoData.voting.proposalFlushBlocksDay) || 0
      const votingDurationHours = Number(daoData.voting.proposalFlushBlocksHours) || 0
      const votingDurationMinutes = Number(daoData.voting.proposalFlushBlocksMinutes) || 0

      const votingDurationInMinutes = votingDurationDays * 24 * 60 + votingDurationHours * 60 + votingDurationMinutes

      console.log("Voting duration calculation:", {
        days: votingDurationDays,
        hours: votingDurationHours,
        minutes: votingDurationMinutes,
        totalMinutes: votingDurationInMinutes
      })

      console.log("Contract addresses:", {
        wrapperAddress,
        wrapperAddressForWrapped,
        selectedWrapperAddress,
        contractData
      })
      console.log("Token deployment mechanism:", daoData.tokenDeploymentMechanism)
      console.log("Signer:", etherlink.signer)

      if (!selectedWrapperAddress) {
        console.error("No wrapper address found!", {
          wrapperAddress,
          wrapperAddressForWrapped,
          tokenDeploymentMechanism: daoData.tokenDeploymentMechanism
        })
        throw new Error("Wrapper contract address not found. Please check your network configuration.")
      }

      // Validate signer
      if (!etherlink.signer) {
        console.error("No signer available!", etherlink)
        throw new Error("Wallet not connected. Please connect your wallet.")
      }

      // Use legacy ABI if using the fallback address
      const isUsingFallbackAddress = selectedWrapperAddress === "0xf4B3022b0fb4e8A73082ba9081722d6a276195c2"
      const wrapperAbi = Array.isArray(WrapperContractAbi)
        ? (WrapperContractAbi as any)
        : (WrapperContractAbi as any)?.abi
      const selectedAbi =
        daoData.tokenDeploymentMechanism === "wrapped"
          ? isUsingFallbackAddress
            ? HbWrapperWLegacyAbi.abi
            : wrapperAbi
          : wrapperAbi

      console.log("Creating wrapper factory with:", {
        address: selectedWrapperAddress,
        tokenDeploymentMechanism: daoData.tokenDeploymentMechanism,
        hasAbi: !!selectedAbi,
        abiLength: selectedAbi?.length,
        hasSigner: !!etherlink.signer,
        usingWrappedAbi: daoData.tokenDeploymentMechanism === "wrapped",
        isUsingFallbackAddress,
        usingLegacyAbi: isUsingFallbackAddress && daoData.tokenDeploymentMechanism === "wrapped"
      })

      // Preflight: verify contract code exists at address
      const onChainCode = await etherlink.provider.getCode(selectedWrapperAddress)
      if (!onChainCode || onChainCode === "0x") {
        throw new Error(
          `No contract code at ${selectedWrapperAddress}. Check network and wrapper address configuration.`
        )
      }

      const wrapperFactory: ethers.Contract = new ethers.Contract(selectedWrapperAddress, selectedAbi, etherlink.signer)

      console.log("Wrapper factory created:", {
        address: wrapperFactory.address || wrapperFactory.target,
        hasDeployDAOwithToken: typeof (wrapperFactory as any).deployDAOwithToken === "function",
        hasDeployDAOwithWrappedToken: typeof (wrapperFactory as any).deployDAOwithWrappedToken === "function"
      })

      // Validate timing values before deployment
      if (isNaN(votingDelayInMinutes) || votingDelayInMinutes < 0) {
        console.error("Invalid voting delay:", votingDelayInMinutes)
        throw new Error("Invalid voting delay value. Please check your input.")
      }

      if (isNaN(votingDurationInMinutes) || votingDurationInMinutes < 0) {
        console.error("Invalid voting duration:", votingDurationInMinutes)
        throw new Error("Invalid voting duration value. Please check your input.")
      }

      if (isNaN(executationDelayinSeconds) || executationDelayinSeconds < 0) {
        console.error("Invalid execution delay:", executationDelayinSeconds)
        throw new Error("Invalid execution delay value. Please check your input.")
      }

      setIsDeploying(true)

      let wrapper: any // This will be a TransactionResponse

      if (daoData.tokenDeploymentMechanism === "wrapped") {
        // Deploy with wrapped token
        // Ensure registry is initialized
        const registryKeys = Object.keys(daoData.registry || {})
        const registryValues = Object.values(daoData.registry || {}).map(v => String(v))

        console.log("Registry data for wrapped token:", {
          registry: daoData.registry,
          keys: registryKeys,
          values: registryValues,
          keyTypes: registryKeys.map(k => typeof k),
          valueTypes: registryValues.map(v => typeof v)
        })

        console.log("Preparing proposal threshold:", {
          proposalThreshold,
          proposalThresholdType: typeof proposalThreshold,
          proposalThresholdAsBigInt: BigInt(proposalThreshold || 0).toString()
        })

        const wrappedDaoPayload = isUsingFallbackAddress
          ? {
              // Legacy structure without wrappedTokenName
              daoName: daoData.name || "",
              wrappedTokenSymbol: daoData.wrappedTokenSymbol || "",
              description: daoData.description || "",
              executionDelay: Math.floor(executationDelayinSeconds),
              underlyingTokenAddress: daoData.underlyingTokenAddress,
              minsVotingDelay: Math.min(Math.max(votingDelayInMinutes, 0), 2 ** 48 - 1), // uint48
              minsVotingPeriod: Math.min(Math.max(votingDurationInMinutes, 0), 2 ** 32 - 1), // uint32
              proposalThreshold: BigInt(proposalThreshold || 0), // uint256 - raw token amount
              quorumFraction: Math.min(Math.max(Number(quorumThreshold), 0), 100), // uint8
              keys: Object.keys(daoData.registry || {}),
              values: Object.values(daoData.registry || {}).map(v => String(v))
            }
          : {
              // New structure with wrappedTokenName
              daoName: daoData.name || "",
              wrappedTokenName: `Wrapped ${daoData.wrappedTokenSymbol || "Token"}`,
              wrappedTokenSymbol: daoData.wrappedTokenSymbol || "",
              description: daoData.description || "",
              executionDelay: Math.floor(executationDelayinSeconds),
              underlyingTokenAddress: daoData.underlyingTokenAddress,
              minsVotingDelay: Math.min(Math.max(votingDelayInMinutes, 0), 2 ** 48 - 1), // uint48
              minsVotingPeriod: Math.min(Math.max(votingDurationInMinutes, 0), 2 ** 32 - 1), // uint32
              proposalThreshold: BigInt(proposalThreshold || 0), // uint256 - raw token amount
              quorumFraction: Math.min(Math.max(Number(quorumThreshold), 0), 100), // uint8
              keys: Object.keys(daoData.registry || {}),
              values: Object.values(daoData.registry || {}).map(v => String(v))
            }
        console.log("Deploying wrapped token DAO with payload:", wrappedDaoPayload)
        console.log("Payload details:", {
          hasUnderlyingAddress: !!wrappedDaoPayload.underlyingTokenAddress,
          underlyingAddress: wrappedDaoPayload.underlyingTokenAddress,
          wrappedSymbol: wrappedDaoPayload.wrappedTokenSymbol,
          wrappedName: wrappedDaoPayload.wrappedTokenName,
          registryKeysLength: wrappedDaoPayload.keys.length,
          registryValuesLength: wrappedDaoPayload.values.length,
          proposalThresholdRaw: proposalThreshold,
          proposalThresholdInPayload: wrappedDaoPayload.proposalThreshold,
          proposalThresholdString: wrappedDaoPayload.proposalThreshold?.toString()
        })

        try {
          wrapper = await wrapperFactory.deployDAOwithWrappedToken(wrappedDaoPayload)
        } catch (contractError) {
          console.error("Contract call error:", contractError)
          console.error("Error details:", {
            message: (contractError as any).message,
            code: (contractError as any).code,
            data: (contractError as any).data
          })
          throw contractError
        }
      } else {
        // Deploy with new token
        const totalTokenSupply = daoData.members.reduce((acc: number, member: any) => acc + member.amountOfTokens, 0)

        // First, create the member amounts array
        const memberAmounts = daoData.members.map((member: any) => {
          try {
            const amount = parseUnits(member.amountOfTokens.toString(), daoData.governanceToken.tokenDecimals)
            console.log(`Member ${member.address} amount: ${member.amountOfTokens} -> ${amount.toString()}`)
            return amount.toString()
          } catch (e) {
            console.error(`Error parsing amount for member ${member.address}:`, e)
            return "0"
          }
        })

        // Append the 4 DAO settings to the initialAmounts array
        const initialAmountsWithSettings = [
          ...memberAmounts,
          votingDelayInMinutes.toString(), // DAO setting 1: voting delay
          votingDurationInMinutes.toString(), // DAO setting 2: voting duration
          proposalThreshold.toString(), // DAO setting 3: proposal threshold
          quorumThreshold.toString() // DAO setting 4: quorum threshold
        ]

        // Ensure description is also persisted on-chain via registry for indexers
        const registryForDeploy = (() => {
          const base: Record<string, string> = { ...(daoData.registry || {}) } as any
          if (daoData.description && !base["description"]) {
            base["description"] = String(daoData.description)
          }
          return base
        })()

        const daoCreateObject = {
          name: daoData.name || "",
          symbol: daoData.governanceToken.symbol || "",
          description: daoData.description || "",
          decimals: parseInt(daoData.governanceToken.tokenDecimals) || 18,
          executionDelay: Math.floor(executationDelayinSeconds),
          initialMembers: daoData.members.map((member: any) => member.address),
          initialAmounts: initialAmountsWithSettings,
          keys: Object.keys(registryForDeploy),
          values: Object.values(registryForDeploy).map(v => String(v)),
          transferrable: !daoData.nonTransferable // Note: fixed spelling to match ABI
        }
        console.log("Deploying new token DAO with object:", daoCreateObject)
        console.log("Members data:", {
          members: daoData.members,
          addresses: daoCreateObject.initialMembers,
          memberAmounts: memberAmounts,
          initialAmountsWithSettings: daoCreateObject.initialAmounts,
          decimals: daoData.governanceToken.tokenDecimals,
          daoSettings: {
            votingDelayInMinutes,
            votingDurationInMinutes,
            proposalThreshold,
            quorumThreshold
          }
        })

        try {
          wrapper = await wrapperFactory.deployDAOwithToken(daoCreateObject)
        } catch (contractError) {
          console.error("Contract call error:", contractError)
          console.error("Error details:", {
            message: (contractError as any).message,
            code: (contractError as any).code,
            data: (contractError as any).data
          })
          throw contractError
        }
      }

      // 0xa42621d950bf85d88e35e26b48eb69edd1d0c35b59ee282e3672b0e164ee9aba
      console.log("Transaction sent:", wrapper.hash)

      const receipt = await wrapper.wait()
      // .hash "0xa42621d950bf85d88e35e26b48eb69edd1d0c35b59ee282e3672b0e164ee9aba"
      console.log("Transaction confirmed:", receipt)
      history.push(`/explorer/daos?q=${daoData.name}`)
      // history.push("/explorer/etherlink/dao/0x287915D27CC4FC967Ca10AA20242d80d99caCe5e/overview")
    } catch (error: any) {
      console.error("=== DAO Deployment Error ===")
      console.error("Full error object:", error)
      console.error("Error stack:", error.stack)
      console.error("Error data:", error.data)
      console.error("Error reason:", error.reason)
      console.error("Error code:", error.code)
      console.error("Deployment context:", {
        selectedWrapperAddress,
        tokenDeploymentMechanism: daoData.tokenDeploymentMechanism
      })
      notify({
        message: `Error deploying DAO: ${
          error?.reason || error?.shortMessage || error?.message || "Unknown error"
        } (wrapper: ${selectedWrapperAddress})`,
        variant: "error"
      })
      setIsDeploying(false)
      return null
    }
    setIsDeploying(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.data, etherlink.signer, wrapperAddress, wrapperAddressForWrapped])
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
        if (data.currentStep == 1) {
          if (data.data.name === "" || data.data.description === "") {
            return notify({
              message: "Please fill in DAO name and description",
              variant: "error"
            })
          }

          if (data.data.tokenDeploymentMechanism === "new") {
            if (!data.data.governanceToken.symbol || data.data.governanceToken.tokenDecimals < 1) {
              return notify({
                message: "Please fill in token symbol and decimals",
                variant: "error"
              })
            }
          } else if (data.data.tokenDeploymentMechanism === "wrapped") {
            if (!data.data.underlyingTokenAddress || !data.data.wrappedTokenSymbol) {
              return notify({
                message: "Please fill in underlying token address and wrapped token symbol",
                variant: "error"
              })
            }
            if (!/^0x[a-fA-F0-9]{40}$/.test(data.data.underlyingTokenAddress)) {
              return notify({
                message: "Invalid Ethereum address format",
                variant: "error"
              })
            }
            // Clear members when using wrapped token
            data.setFieldValue("members", [])
          }
        }

        // Validation for 2. Proposal & Voting
        if (data.currentStep == 2) {
          const votingData = {
            proposalExpiry: Object.entries(data.data.voting)
              .filter(([key]) => key.startsWith("proposalExpiry"))
              .reduce((acc, [_, value]) => acc + (Number(value) || 0), 0),
            proposalFlush: Object.entries(data.data.voting)
              .filter(([key]) => key.startsWith("proposalFlush"))
              .reduce((acc, [_, value]) => acc + (Number(value) || 0), 0),
            votingBlock: Object.entries(data.data.voting)
              .filter(([key]) => key.startsWith("votingBlock"))
              .reduce((acc, [_, value]) => acc + (Number(value) || 0), 0)
          }

          if (votingData.proposalExpiry === 0 || votingData.proposalFlush === 0 || votingData.votingBlock === 0) {
            return notify({
              message: "Please add valid values for all time periods",
              variant: "error"
            })
          }
        }

        console.log("Members", data.data.members)

        // Validation for 4. Members
        if (data.currentStep === 4 && data.data.tokenDeploymentMechanism === "new") {
          console.log("Validating members at step 4:", data.data.members)
          const memberErrorExists = data.data.members.some((member: any) => member.error)
          const memberZeroAllocation = data.data.members.some((member: any) => Number(member.amountOfTokens) === 0)
          const invalidAddresses = data.data.members.filter(
            (member: any) => !/^0x[a-fA-F0-9]{40}$/.test(member.address)
          )

          if (invalidAddresses.length > 0) {
            console.error("Invalid member addresses:", invalidAddresses)
            return notify({
              message: "Please ensure all member addresses are valid Ethereum addresses",
              variant: "error"
            })
          }

          if (memberErrorExists) {
            return notify({
              message: "Please fix all errors in the members section",
              variant: "error"
            })
          } else if (memberZeroAllocation) {
            return notify({
              message: "All members must have a token allocation",
              variant: "error"
            })
          }
        }

        console.log("Registry", data.data.registry)

        // Validation for 5. Registry
        if (data.currentStep === 5) {
          console.log("Validating registry at step 5:", data.data.registry)
          if (!data.data.registry || typeof data.data.registry !== "object") {
            console.error("Registry is not an object:", data.data.registry)
            return notify({
              message: "Registry data is invalid",
              variant: "error"
            })
          }
          const registryErrorExists = Object.entries(data.data.registry).some(([_, value]) => value === "")
          if (registryErrorExists) {
            return notify({
              message: "Please fill in all registry fields",
              variant: "error"
            })
          }
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
