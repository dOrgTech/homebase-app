import { ethers } from "ethers"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { useCallback, useContext, useMemo, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EtherlinkContext } from "services/wagmi/context"

import HbDaoAbi from "assets/abis/hb_dao.json"
import { useNotification } from "modules/common/hooks/useNotification"
import { EvmProposalOptions, proposalInterfaces } from "modules/etherlink/config"
import { useHistory } from "react-router-dom"
import dayjs from "dayjs"
import { getEthSignature } from "services/utils/utils"
import { saveLiteProposal, voteOnLiteProposal } from "services/services/lite/lite-services"
import { EProposalType, IEvmOffchainChoiceForVote, IEvmProposalTxn } from "modules/etherlink/types"
import { isValidUrl, getDaoConfigType, getDaoTokenOpsType } from "modules/etherlink/utils"
import HbTokenAbi from "assets/abis/hb_evm.json"
import { useProposalUiOverride } from "services/wagmi/etherlink/hooks/useProposalUiOverride"

interface EvmProposalCreateStore {
  currentStep: number
  setCurrentStep: (step: number) => void
  metadata: {
    type: EProposalType | ""
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
  daoRegistryError: string
  setDaoRegistry: (type: "key" | "value", value: string) => void
  createProposalPayload: {
    type?: string
    targets: any[]
    values: any[]
    calldatas: any[]
    description: string
  }
  setCreateProposalPayload: (payload: any) => void
  setTransferAssets: (transactions: any[], daoRegistryAddress: string) => void
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
  setDaoTokenOps: (
    type: "mint" | "burn",
    value?: any,
    tokenSymbol?: string,
    tokenAddress?: string,
    tokenDecimals?: number
  ) => void
  offchainDebate: {
    expiry_days: string
    expiry_hours: string
    expiry_minutes: string
    options: string[]
    is_multiple_choice: boolean
  }
  setOffchainDebate: (key: string, value: string | string[] | boolean) => void
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
            assetType: "transferETH",
            assetSymbol: "XTZ",
            recipient: "",
            amount: "",
            assetAddress: ""
          }
        ]
      },
      setTransferAssets: (transactions: any[], daoRegistryAddress: string) => {
        const targets: string[] = []
        const callData: string[] = []

        // Only attempt to encode when recipient is a valid address and amount/tokenId is > 0
        const validTransactions = transactions.filter((transaction: any) => {
          const isValidRecipient = transaction.recipient?.length > 0 && ethers.isAddress(transaction.recipient)
          const nAmount =
            typeof transaction.amount === "string" ? Number(transaction.amount) : Number(transaction.amount || 0)
          const nTokenId =
            typeof transaction.tokenId === "string" ? Number(transaction.tokenId) : Number(transaction.tokenId || 0)
          const isValidAmountOrTokenId = nAmount > 0 || nTokenId > 0
          return isValidRecipient && isValidAmountOrTokenId
        })

        // Build calldatas defensively; skip entries we cannot encode yet instead of throwing
        for (const transaction of validTransactions) {
          const ifaceDef = proposalInterfaces.find(p => p.name === transaction.assetType)
          if (!ifaceDef) continue
          const iface = new ethers.Interface(ifaceDef.interface)

          try {
            let ifaceParams: any[] = []
            if (transaction.assetType === "transferETH") {
              // Amount must be a parseable decimal string
              ifaceParams = [transaction.recipient, ethers.parseEther(String(transaction.amount))]
            } else if (transaction.assetType === "transferERC20") {
              const decimals = Number(transaction.assetDecimals ?? 18)
              // Guard: decimals must be a finite number; fall back to 18
              const safeDecimals = Number.isFinite(decimals) ? decimals : 18
              ifaceParams = [
                transaction.assetAddress,
                transaction.recipient,
                ethers.parseUnits(String(transaction.amount), safeDecimals)
              ]
            } else if (transaction.assetType === "transferERC721") {
              ifaceParams = [transaction.assetAddress, transaction.recipient, BigInt(transaction.tokenId)]
            } else {
              console.log("Invalid transaction type", transaction.assetType)
              continue
            }

            console.log("ifaceParams", transaction.assetType, ifaceDef.name, ifaceParams, {
              amount: transaction.amount,
              tokenId: transaction.tokenId
            })
            targets.push(daoRegistryAddress)
            callData.push(iface.encodeFunctionData(ifaceDef.name, ifaceParams))
          } catch (encodeErr) {
            // Do not crash the UI on partial/invalid input; skip until input is valid
            console.log("Skipping invalid transfer transaction while encoding", encodeErr)
          }
        }

        const payload = {
          transferAssets: { transactions },
          createProposalPayload: {
            targets,
            values: validTransactions.map(() => "0"),
            calldatas: callData,
            description: get().createProposalPayload.description
          }
        }
        console.log("payload", payload)
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

        // Build the next registry state first, then encode with the updated values
        const nextRegistry = { ...get().daoRegistry, [type]: value }
        const iface = new ethers.Interface(selectedInterface.interface)
        const encodedData = iface.encodeFunctionData(selectedInterface.name, [nextRegistry.key, nextRegistry.value])

        set({
          daoRegistry: nextRegistry,
          // Keep payload keys stable but always overwrite calldatas with freshly encoded value
          createProposalPayload: { ...get().createProposalPayload, calldatas: [encodedData] }
        })
      },
      daoRegistryError: "",
      daoContractCall: {
        targetAddress: "",
        value: "",
        functionDefinition: "",
        callData: ""
      },
      // TODO: @ashutoshpw Fix this
      setDaoContractCall: (type: "targetAddress" | "value" | "functionDefinition" | "callData", value: string) => {
        set({ daoContractCall: { ...get().daoContractCall, [type]: value } })
        if (type === "callData") {
          set({
            createProposalPayload: {
              ...get().createProposalPayload,
              calldatas: [value]
            }
          })
        }
        if (type === "value") {
          set({
            createProposalPayload: {
              ...get().createProposalPayload,
              values: [Number(value)]
            }
          })
        }
        if (type === "targetAddress") {
          set({
            createProposalPayload: {
              ...get().createProposalPayload,
              targets: [value]
            }
          })
        }
        // const selectedInterface = proposalInterfaces.find(p => p.name === "contractCall")
        // if (!selectedInterface) return
        // const iface = new ethers.Interface(selectedInterface.interface)
        // const encodedData = iface.encodeFunctionData(selectedInterface.name, [
        //   get().daoContractCall.targetAddress,
        //   get().daoContractCall.value,
        //   get().daoContractCall.functionDefinition,
        //   get().daoContractCall.callData
        // ])
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
        console.log("setting dao config", type, value)
        // TODO: Replace this with getCallDataForProposal
        let ifaceDef, iface: any, encodedData: any
        if (type === "quorumNumerator") {
          ifaceDef = proposalInterfaces.find(p => p.name === "updateQuorumNumerator")
          if (!ifaceDef) return
          iface = new ethers.Interface(ifaceDef.interface)
          encodedData = iface.encodeFunctionData(ifaceDef.name, [value?.toString()])
        }
        if (type === "votingDelay") {
          ifaceDef = proposalInterfaces.find(p => p.name === "setVotingDelay")
          if (!ifaceDef) return
          iface = new ethers.Interface(ifaceDef.interface)
          encodedData = iface.encodeFunctionData(ifaceDef.name, [value?.toString()])
        }
        if (type === "votingPeriod") {
          ifaceDef = proposalInterfaces.find(p => p.name === "setVotingPeriod")
          if (!ifaceDef) return

          iface = new ethers.Interface(ifaceDef.interface)
          encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
          console.log("DaoConfig:votingPeriod", type, value, encodedData)
        }
        if (type === "proposalThreshold") {
          ifaceDef = proposalInterfaces.find(p => p.name === "setProposalThreshold")
          if (!ifaceDef) return
          iface = new ethers.Interface(ifaceDef.interface)
          encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
        }
        console.log("dao config calldata", encodedData)
        payload.createProposalPayload = {
          ...get().createProposalPayload,
          targets: [get().daoConfig.address],
          values: [0],
          calldatas: [encodedData],
          description: get().createProposalPayload.description
        }
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
      setDaoTokenOps: (
        type: "mint" | "burn",
        value?: any,
        tokenSymbol?: string,
        tokenAddress?: string,
        tokenDecimals?: number
      ) => {
        console.log("setDaoTokenOps", type, value, { tokenSymbol, tokenAddress, tokenDecimals })

        // triggered when user select ops type
        if (!value && tokenSymbol && tokenAddress) {
          const proposalDescription = get().createProposalPayload.description
          const proposalDescriptionSplit = proposalDescription.split("0|||0")
          proposalDescriptionSplit[1] = getDaoTokenOpsType(type, tokenSymbol)
          const description = proposalDescriptionSplit.join("0|||0")
          console.log("new description", description)
          return set({
            daoTokenOps: { ...get().daoTokenOps, type, token: { symbol: tokenSymbol, address: tokenAddress } },
            createProposalPayload: {
              ...get().createProposalPayload,
              targets: [tokenAddress],
              values: [0],
              description
            },
            currentStep: 3
          })
        }

        // triggered when user enter recipient and amount & address
        const selectedInterface = proposalInterfaces.find(p => p.name === type)
        if (!selectedInterface) return console.error("No interface found")

        const payload = { daoTokenOps: { ...get().daoTokenOps, [type]: value } } as any
        const iface = new ethers.Interface(selectedInterface.interface)

        const targetAddress = value?.to || get().daoTokenOps[type]?.to
        const targetAmountStr = (value?.amount ?? get().daoTokenOps[type]?.amount ?? "") as string

        // Only attempt to parse and encode when both fields are valid
        const hasValidAddress = ethers.isAddress(targetAddress)
        const hasValidAmount =
          typeof targetAmountStr === "string" && targetAmountStr.trim() !== "" && !isNaN(Number(targetAmountStr))

        if (hasValidAddress && hasValidAmount) {
          const amountWithDecimals = ethers.parseUnits(targetAmountStr, tokenDecimals || 0)
          const encodedData = iface.encodeFunctionData(selectedInterface.name, [targetAddress, amountWithDecimals])
          payload.createProposalPayload = {
            ...get().createProposalPayload,
            calldatas: [encodedData]
          }
        } else {
          console.log("Invalid target address or amount", targetAddress, targetAmountStr, hasValidAddress)
        }

        console.log("payload", payload)
        set(payload)
      },
      offchainDebate: {
        expiry_days: "",
        expiry_hours: "",
        expiry_minutes: "",
        options: ["", ""],
        is_multiple_choice: false
      },
      setOffchainDebate: (key: string, value: string | string[] | boolean) => {
        const payload = { offchainDebate: { ...get().offchainDebate, [key]: value } } as any
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
      storage: undefined
      // storage: createJSONStorage(() => localStorage)
    }
  )
)

export const useEvmProposalOps = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const { etherlink, network } = useTezos()
  const { daoSelected, daoProposalSelected, setIsProposalDialogOpen } = useContext(EtherlinkContext)
  const router = useHistory()

  const zustantStore = useEvmProposalCreateZustantStore()
  const openNotification = useNotification()
  const currentStep = zustantStore.currentStep
  const proposalType = zustantStore.getMetadataFieldValue("type")
  const proposalUiOverride = useProposalUiOverride()

  const daoContract = useMemo(() => {
    console.log("DaoContract", daoSelected?.address, HbDaoAbi.abi)
    if (!daoSelected?.address || !etherlink.signer) return
    return new ethers.Contract(daoSelected?.address, HbDaoAbi.abi, etherlink.signer)
  }, [daoSelected?.address, etherlink.signer])

  const getProposalExecutionMetadata = useCallback(() => {
    if (!daoContract || !daoProposalSelected?.id || !daoSelected?.address)
      return alert("No dao contract or proposal id")

    const concatenatedDescription = [
      daoProposalSelected.title,
      daoProposalSelected.type,
      daoProposalSelected.description,
      daoProposalSelected.externalResource
    ].join("0|||0")

    const encodedInput = ethers.toUtf8Bytes(concatenatedDescription)
    const keccakHash = ethers.keccak256(encodedInput)
    const hashHex = keccakHash
    console.log(`queueForExecution: Keccak-256 hash: ${hashHex}`)
    const callData = daoProposalSelected?.callDataPlain?.[0]
    const expectedCallData = "0x06f3f9e6000000000000000000000000000000000000000000000000000000000000000f"
    console.log(`queueForExecution: callData: ${callData}`, expectedCallData)
    return {
      calldata: [callData],
      hashHex: hashHex
    }
  }, [
    daoContract,
    daoProposalSelected?.callDataPlain,
    daoProposalSelected.description,
    daoProposalSelected.externalResource,
    daoProposalSelected?.id,
    daoProposalSelected.title,
    daoProposalSelected.type,
    daoSelected?.address
  ])

  const getProposalExecutionTargetAddress = useCallback(() => {
    if (!daoContract || !daoProposalSelected?.id || !daoSelected?.address || !daoProposalSelected?.type)
      return alert("No dao contract or proposal id")

    const proposalType = daoProposalSelected?.type?.toLowerCase()
    if (proposalType === "registry") {
      return daoSelected?.registryAddress
    }
    if (proposalType?.startsWith("mint")) {
      return daoSelected?.token
    }
    if (proposalType?.startsWith("burn")) {
      return daoSelected?.token
    }
    if (proposalType == "transfer") {
      return daoSelected?.registryAddress
    }
    if (proposalType == "quorum") {
      return daoSelected?.address
    }
    return daoSelected?.address
  }, [
    daoContract,
    daoProposalSelected?.id,
    daoProposalSelected?.type,
    daoSelected?.address,
    daoSelected?.registryAddress,
    daoSelected?.token
  ])

  // --- On-chain status helpers (for optimistic UI + fallback) ---
  const computeOnchainProposalId = useCallback(async () => {
    if (!daoContract || !daoProposalSelected?.id) return null
    const meta = getProposalExecutionMetadata()
    if (!meta) return null
    try {
      const targets = (daoProposalSelected?.targets || []) as string[]
      const values = (daoProposalSelected?.values || []).map((v: any) => BigInt(v || 0)) as bigint[]
      const calldatas = (daoProposalSelected?.callDatas || []) as string[]
      const proposalId = await (daoContract as any).hashProposal(targets, values, calldatas, meta.hashHex)
      return proposalId as bigint
    } catch (e) {
      console.log("computeOnchainProposalId error", e)
      return null
    }
  }, [
    daoContract,
    daoProposalSelected?.callDatas,
    daoProposalSelected?.id,
    daoProposalSelected?.targets,
    daoProposalSelected?.values,
    getProposalExecutionMetadata
  ])

  const checkOnchainQueuedAndOverride = useCallback(async () => {
    if (!daoContract || !daoProposalSelected?.id) return
    try {
      const pid = await computeOnchainProposalId()
      if (!pid) return
      let eta: bigint = 0n
      try {
        eta = await (daoContract as any).proposalEta(pid)
      } catch (e) {
        console.log("proposalEta read failed; will try proposalNeedsQueuing", e)
      }
      if (eta && eta > 0n) {
        proposalUiOverride.setQueued(daoProposalSelected.id, Number(eta))
        return
      }
      try {
        const needsQueue: boolean = await (daoContract as any).proposalNeedsQueuing(pid)
        if (needsQueue === false) {
          const approxEta = Math.floor(Date.now() / 1000) + (daoSelected?.executionDelay || 0)
          proposalUiOverride.setQueued(daoProposalSelected.id, approxEta)
        }
      } catch (_) {
        // ignore
      }
    } catch (e) {
      console.log("checkOnchainQueuedAndOverride error", e)
    }
  }, [computeOnchainProposalId, daoContract, daoProposalSelected?.id, daoSelected?.executionDelay, proposalUiOverride])

  const createProposal = useCallback(
    async (payload: {
      targets: string[]
      values: (number | string | bigint)[]
      calldatas: string[]
      description: string
    }) => {
      if (!daoSelected || !daoContract) return
      const { targets, values, calldatas, description } = payload

      // Basic guards to prevent malformed propose calls
      if (!Array.isArray(targets) || !Array.isArray(values) || !Array.isArray(calldatas)) {
        throw new Error("Invalid proposal payload: targets, values and calldatas must be arrays")
      }
      if (!(targets.length === values.length && values.length === calldatas.length)) {
        throw new Error("Invalid proposal payload: targets/values/calldatas length mismatch")
      }

      console.log("createProposal", { targets, values, calldatas, description })
      const tx = await daoContract.propose(targets, values, calldatas, description)
      console.log("Proposal transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Proposal transaction confirmed:", receipt)
      return receipt
    },
    [daoSelected, daoContract]
  )

  const castVote = useCallback(
    async (proposalId: string, support: boolean) => {
      if (!daoContract || !proposalId) return alert("No dao contract or proposal id")

      const tx = await daoContract.castVote(proposalId?.toString(), support ? 1 : 0)
      console.log("Vote transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Vote transaction confirmed:", receipt)
      return receipt
    },
    [daoContract]
  )

  const queueForExecution = useCallback(async () => {
    console.log(daoProposalSelected?.type)
    if (!daoContract || !daoProposalSelected?.id) return alert("No dao contract or proposal id")

    const metadata = getProposalExecutionMetadata()
    if (!metadata) return alert("Could not get proposal metadata")

    const targetAddress = getProposalExecutionTargetAddress()
    console.log("proposalAction targetAddress", targetAddress)
    console.log("proposalAction metadata", metadata)

    const tx = await daoContract.queue([targetAddress], [0], metadata.calldata, metadata.hashHex)
    console.log("Queue transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("Queue transaction confirmed:", receipt)
    // Optimistic UI: reflect queued state immediately
    try {
      await checkOnchainQueuedAndOverride()
      if (!proposalUiOverride.overrides?.[daoProposalSelected.id]?.status) {
        const approxEta = Math.floor(Date.now() / 1000) + (daoSelected?.executionDelay || 0)
        proposalUiOverride.setQueued(daoProposalSelected.id, approxEta)
      }
    } catch (_) {
      // ignore optimistic errors
    }
    return receipt
  }, [
    daoContract,
    daoProposalSelected?.id,
    daoProposalSelected?.type,
    getProposalExecutionMetadata,
    getProposalExecutionTargetAddress,
    checkOnchainQueuedAndOverride,
    proposalUiOverride.overrides,
    proposalUiOverride.setQueued,
    daoSelected?.executionDelay
  ])

  const executeProposal = useCallback(async () => {
    if (!daoContract) return

    const metadata = getProposalExecutionMetadata()
    if (!metadata) return alert("Could not get proposal metadata")

    const targetAddress = getProposalExecutionTargetAddress()
    if (!targetAddress) return alert("No target address")

    const tx = await daoContract.execute([targetAddress], [0], metadata.calldata, metadata.hashHex)
    console.log("Execute transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("Execute transaction confirmed:", receipt)
    return receipt
  }, [daoContract, getProposalExecutionMetadata, getProposalExecutionTargetAddress])

  const nextStep = {
    text: isLoading ? "Please wait..." : "Next",
    handler: async () => {
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
        if (metadata?.title?.length == 0) {
          openNotification({
            message: "Please enter a title",
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
        if (metadata?.description?.length == 0) {
          openNotification({
            message: "Please enter a description",
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
        if (metadata?.discussionUrl?.length == 0 || !isValidUrl(metadata?.discussionUrl)) {
          openNotification({
            message: "Please enter a valid discussion url",
            autoHideDuration: 3000,
            variant: "error"
          })
          return
        }
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
        setIsDeploying(true)

        const { closeSnackbar } = openNotification({
          message: "Creating Proposal...",
          variant: "success"
        })

        if (proposalType === "off_chain_debate") {
          const offchainPayload = zustantStore.offchainDebate
          const proposalMetadata = zustantStore.metadata
          const expiryDays = Number(offchainPayload.expiry_days) || 0
          const expiryHours = Number(offchainPayload.expiry_hours) || 0
          const expiryMinutes = Number(offchainPayload.expiry_minutes) || 0
          const dataToSign = {
            name: proposalMetadata.title,
            description: proposalMetadata.description,
            externalLink: proposalMetadata.discussionUrl,
            choices: offchainPayload.options,
            endTimeDays: expiryDays,
            endTimeHours: expiryHours,
            endTimeMinutes: expiryMinutes,
            votingStrategy: offchainPayload.is_multiple_choice,
            startTime: String(dayjs().valueOf()),
            endTime: String(
              dayjs().add(expiryDays, "days").add(expiryHours, "hours").add(expiryMinutes, "minutes").valueOf()
            ),
            daoId: daoSelected?.address,
            tokenAddress: daoSelected?.token,
            author: etherlink?.signer?.address
          }
          const { signature, payloadBytes } = await getEthSignature(
            etherlink?.signer?.address as string,
            JSON.stringify(dataToSign)
          )
          if (!signature) {
            openNotification({
              message: `Issue with Signature`,
              autoHideDuration: 3000,
              variant: "error"
            })
            return
          }
          const res = await saveLiteProposal(signature, etherlink?.signer?.address, payloadBytes, network)
          const respData = await res.json()
          setIsLoading(false)
          setIsDeploying(false)
          if (res.ok) {
            openNotification({
              message: "Proposal created!",
              autoHideDuration: 3000,
              variant: "success"
            })
            // Mirror on-chain success cleanup so step-based dialogs close
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
            setIsProposalDialogOpen(false)
            router.push(`/explorer/etherlink/dao/${daoSelected?.address}/proposals`)
          } else {
            console.log("Error: ", respData.message)
            openNotification({
              message: respData.message,
              autoHideDuration: 3000,
              variant: "error"
            })
            return
          }
          return console.log("offchainDebate", offchainPayload, proposalMetadata, signature, payloadBytes)
        } else {
          // --- Preflight: ensure proposer has enough voting power ---
          try {
            const signerAddress = etherlink?.signer?.address
            const tokenAddress = daoSelected?.token
            const thresholdRaw = BigInt(daoSelected?.proposalThreshold || 0)

            if (!signerAddress || !tokenAddress) throw new Error("Missing signer or token address")

            const provider = etherlink?.provider || etherlink?.signer?.provider
            if (!provider) throw new Error("No provider available")

            const tokenContract = new ethers.Contract(tokenAddress, HbTokenAbi.abi, provider)
            const votesRaw: bigint = await tokenContract.getVotes(signerAddress)

            if (votesRaw < thresholdRaw) {
              const dec = Number(daoSelected?.decimals || 0)
              const toHuman = (x: bigint) => {
                if (!dec) return x.toString()
                const s = x.toString().padStart(dec + 1, "0")
                const intPart = s.slice(0, -dec)
                const frac = s.slice(-dec).replace(/0+$/, "")
                return frac ? `${intPart}.${frac}` : intPart
              }

              openNotification({
                message: `Insufficient voting power to propose. Required ≥ ${toHuman(thresholdRaw)}, you have ${toHuman(
                  votesRaw
                )}. Use 'Claim Voting Power' (self‑delegate) in the User tab and try again.`,
                variant: "error",
                autoHideDuration: 5000
              })
              setIsDeploying(false)
              // Optional: route user to the delegation UI
              try {
                router.push(`/explorer/etherlink/dao/${daoSelected?.address}/user`)
              } catch (_) {
                // ignore routing errors
              }
              return
            }
          } catch (preflightErr) {
            // If preflight fails due to read issues, continue to attempt the tx; wallet will still guard
            console.log("Preflight check skipped due to error:", preflightErr)
          }

          createProposal(zustantStore.createProposalPayload)
            .then((createdProposal: IEvmProposalTxn) => {
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
              setIsProposalDialogOpen(false)
              router.push(`/explorer/etherlink/dao/${daoSelected?.address}/proposals`)
            })
            .catch(err => {
              console.log("Error creating proposal", err)
              // Friendlier error for insufficient proposer votes
              const dataHex: string | undefined = (err as any)?.data
              const maybeInsufficientVotes = typeof dataHex === "string" && dataHex.startsWith("0xc242ee16")
              const friendly = maybeInsufficientVotes
                ? "You do not meet the proposal threshold. Delegate voting power to yourself, then try again."
                : (err as any)?.shortMessage || "Failed to create proposal."
              setTimeout(() => {
                openNotification({ message: friendly, variant: "error", autoHideDuration: 4000 })
              }, 500)
            })
            .finally(() => {
              closeSnackbar()
              setIsDeploying(false)
            })
        }
      }
    }
  }

  const prevStep = {
    text: "Back",
    handler: () => {
      zustantStore.setCurrentStep(zustantStore.currentStep - 1)
    }
  }

  const castOffchainVote = useCallback(
    async (votesData: IEvmOffchainChoiceForVote[]) => {
      const publicKey = etherlink.account.address
      if (!publicKey) return alert("No public key")

      votesData = votesData.map(x => {
        return {
          ...x,
          address: publicKey
        }
      })

      const { signature, payloadBytes } = await getEthSignature(publicKey, JSON.stringify(votesData))
      if (!signature) {
        openNotification({
          message: `Issue with Signature`,
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }
      const resp = await voteOnLiteProposal(signature, publicKey, payloadBytes, network)
      const response = await resp.json()
      if (resp.ok) {
        openNotification({
          message: "Your vote has been submitted",
          autoHideDuration: 3000,
          variant: "success"
        })
      } else {
        console.log("Error: ", response.message)
        openNotification({
          message: response.message,
          autoHideDuration: 3000,
          variant: "error"
        })
        return
      }
    },
    [etherlink.account.address, network, openNotification]
  )

  return {
    isLoading,
    setIsLoading,
    createProposal,
    castVote,
    castOffchainVote,
    queueForExecution,
    executeProposal,
    checkOnchainQueuedAndOverride,
    signer: etherlink?.signer,
    nextStep,
    prevStep,
    isDeploying,
    ...zustantStore
  }
}
