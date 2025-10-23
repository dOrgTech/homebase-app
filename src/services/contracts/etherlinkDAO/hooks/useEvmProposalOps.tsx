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
import { computeDaoConfigDefaults } from "./daoConfigDefaults"
import { dbg } from "utils/debug"

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

        // Only attempt to encode when recipient is a valid address and
        // type-specific required values are present
        dbg("EL-XFER:setTransferAssets:input", { count: transactions?.length || 0, registry: daoRegistryAddress })
        const validTransactions = transactions.filter((transaction: any) => {
          const rec = (transaction.recipient || "").trim()
          const isValidRecipient = rec.length > 0 && ethers.isAddress(rec)
          if (!isValidRecipient) return false
          const nAmount = Number(typeof transaction.amount === "string" ? transaction.amount : transaction.amount || 0)
          const tokenIdStr = String(transaction.tokenId ?? "")
          const nTokenId = Number(tokenIdStr)
          if (transaction.assetType === "transferERC721") {
            // Accept tokenId 0 as valid, require a valid NFT contract address
            return (
              tokenIdStr !== "" &&
              Number.isFinite(nTokenId) &&
              nTokenId >= 0 &&
              typeof transaction.assetAddress === "string" &&
              ethers.isAddress(transaction.assetAddress)
            )
          }
          if (transaction.assetType === "transferETH") {
            return Number.isFinite(nAmount) && nAmount > 0
          }
          if (transaction.assetType === "transferERC20") {
            return (
              Number.isFinite(nAmount) &&
              nAmount > 0 &&
              typeof transaction.assetAddress === "string" &&
              ethers.isAddress(transaction.assetAddress)
            )
          }
          // Unknown type: exclude
          return false
        })
        dbg("EL-XFER:setTransferAssets:valid", { validCount: validTransactions.length, txs: validTransactions })

        // Build calldatas defensively; skip entries we cannot encode yet instead of throwing
        for (const transaction of validTransactions) {
          const ifaceDef = proposalInterfaces.find(p => p.name === transaction.assetType)
          if (!ifaceDef) continue
          const iface = new ethers.Interface(ifaceDef.interface)

          try {
            const rec = (transaction.recipient || "").trim()
            let ifaceParams: any[] = []
            if (transaction.assetType === "transferETH") {
              // Amount must be a parseable decimal string
              ifaceParams = [rec, ethers.parseEther(String(transaction.amount))]
            } else if (transaction.assetType === "transferERC20") {
              const decimals = Number(transaction.assetDecimals ?? 18)
              // Guard: decimals must be a finite number; fall back to 18
              const safeDecimals = Number.isFinite(decimals) ? decimals : 18
              ifaceParams = [transaction.assetAddress, rec, ethers.parseUnits(String(transaction.amount), safeDecimals)]
            } else if (transaction.assetType === "transferERC721") {
              const tokenIdStr = String(transaction.tokenId)
              const tokenIdBig = BigInt(tokenIdStr)
              ifaceParams = [transaction.assetAddress, rec, tokenIdBig]
            } else {
              console.log("Invalid transaction type", transaction.assetType)
              continue
            }

            dbg("EL-XFER:setTransferAssets:encode", { type: transaction.assetType, params: ifaceParams })
            if (typeof daoRegistryAddress === "string" && ethers.isAddress(daoRegistryAddress)) {
              targets.push(daoRegistryAddress)
            } else {
              dbg("EL-XFER:setTransferAssets:skipInvalidRegistry", String(daoRegistryAddress))
              continue
            }
            callData.push(iface.encodeFunctionData(ifaceDef.name, ifaceParams))
          } catch (encodeErr) {
            // Do not crash the UI on partial/invalid input; skip until input is valid
            dbg("EL-XFER:setTransferAssets:encodeError", String((encodeErr as any)?.message || encodeErr))
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
        dbg("EL-XFER:setTransferAssets:payload", { targets: targets.length, calldatas: callData.length })
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
          // Keep calldatas aligned; default values to [0] if empty so arrays match
          const existingValues = get().createProposalPayload.values
          set({
            createProposalPayload: {
              ...get().createProposalPayload,
              calldatas: [value],
              values: (existingValues && existingValues.length > 0 ? existingValues : [0]) as any
            }
          })
        }
        if (type === "value") {
          // Parse ETH value safely; default to 0 when empty/invalid
          let parsed: any = 0
          try {
            const v = (value || "").trim()
            parsed = v ? ethers.parseEther(v) : 0
          } catch (_) {
            parsed = 0
          }
          set({
            createProposalPayload: {
              ...get().createProposalPayload,
              values: [parsed]
            }
          })
        }
        if (type === "targetAddress") {
          // Ensure targets exists and keep arrays aligned by defaulting values to [0] when empty
          const existingValues = get().createProposalPayload.values
          set({
            createProposalPayload: {
              ...get().createProposalPayload,
              targets: [value],
              values: (existingValues && existingValues.length > 0 ? existingValues : [0]) as any
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
  const proposalOverrides = useProposalUiOverride(s => s.overrides)
  const setOverrideQueued = useProposalUiOverride(s => s.setQueued)
  const setOverrideExecuted = useProposalUiOverride(s => s.setExecuted)

  // Disable Next for transfer_assets only when no row is plausibly valid.
  // This avoids blocking on minor encoding issues and improves UX.
  const isNextDisabled = useMemo(() => {
    const step = zustantStore.currentStep
    const type = zustantStore.getMetadataFieldValue("type")

    if (step >= 2 && type === "transfer_assets") {
      const txs = (zustantStore.transferAssets?.transactions || []) as any[]
      const anyValid = txs.some(tx => {
        const rec = (tx?.recipient || "").trim()
        const hasRecipient = !!rec && ethers.isAddress(rec)
        if (!hasRecipient) return false
        if (tx?.assetType === "transferERC721") {
          const tokenIdStr = String(tx?.tokenId ?? "")
          const addr = String(tx?.assetAddress || "")
          return tokenIdStr !== "" && ethers.isAddress(addr)
        }
        if (tx?.assetType === "transferERC20") {
          const nAmount = Number(typeof tx?.amount === "string" ? tx.amount : tx?.amount || 0)
          const addr = String(tx?.assetAddress || "")
          return Number.isFinite(nAmount) && nAmount > 0 && ethers.isAddress(addr)
        }
        const nAmount = Number(typeof tx?.amount === "string" ? tx.amount : tx?.amount || 0)
        return Number.isFinite(nAmount) && nAmount > 0
      })
      dbg("EL-XFER:isNextDisabled", {
        step,
        type,
        rows: txs.length,
        anyValid,
        payload: zustantStore.createProposalPayload
      })
      return !anyValid
    }

    if (step >= 2 && type === "contract_call") {
      const targetAddress = zustantStore.daoContractCall?.targetAddress || ""
      const callData = zustantStore.daoContractCall?.callData || ""

      const hasValidTarget = !!targetAddress && ethers.isAddress(targetAddress)
      const hasValidCallData = !!callData && callData.startsWith("0x") && callData.length > 2

      return !hasValidTarget || !hasValidCallData
    }

    return false
  }, [
    zustantStore.currentStep,
    zustantStore.transferAssets?.transactions,
    zustantStore.daoContractCall?.targetAddress,
    zustantStore.daoContractCall?.callData,
    zustantStore.getMetadataFieldValue("type")
  ])

  const daoContract = useMemo(() => {
    console.log("DaoContract", daoSelected?.address, HbDaoAbi.abi)
    if (!daoSelected?.address || !etherlink.signer) return
    return new ethers.Contract(daoSelected?.address, HbDaoAbi.abi, etherlink.signer)
  }, [daoSelected?.address, etherlink.signer])

  const getProposalExecutionMetadata = useCallback(() => {
    if (!daoContract || !daoProposalSelected?.id || !daoSelected?.address)
      throw new Error("No dao contract or proposal id")

    const concatenatedDescription = [
      daoProposalSelected.title,
      daoProposalSelected.type,
      daoProposalSelected.description,
      daoProposalSelected.externalResource
    ].join("0|||0")

    const encodedInput = ethers.toUtf8Bytes(concatenatedDescription)
    const hashHex = ethers.keccak256(encodedInput)

    const targets = Array.isArray(daoProposalSelected.targets) ? daoProposalSelected.targets : []
    const valuesRaw = Array.isArray(daoProposalSelected.values) ? daoProposalSelected.values : []
    const rawCalldatas = Array.isArray((daoProposalSelected as any)?.callDatas)
      ? (daoProposalSelected as any).callDatas
      : daoProposalSelected.callDataPlain || []

    const normalizeCalldata = (value: unknown) => {
      if (typeof value !== "string") return "0x"
      const trimmed = value.trim()
      return trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`
    }

    const normalizeValue = (value: unknown, index: number) => {
      try {
        if (typeof value === "bigint") return value
        if (typeof value === "number") return BigInt(value)
        if (typeof value === "string" && value.length > 0) return ethers.toBigInt(value)
      } catch (err) {
        console.warn("getProposalExecutionMetadata: invalid value entry", { index, value, err })
      }
      return 0n
    }

    const calldatas = rawCalldatas.map(normalizeCalldata)
    const values = valuesRaw.map(normalizeValue)

    const lengths = new Set([targets.length, values.length, calldatas.length])
    if (targets.length === 0 || calldatas.length === 0 || lengths.size !== 1) {
      throw new Error("Proposal action data is incomplete or mismatched. Try refreshing the proposal details.")
    }

    return {
      hashHex,
      targets,
      values,
      calldatas
    }
  }, [
    daoContract,
    daoProposalSelected?.callDataPlain,
    daoProposalSelected?.id,
    daoProposalSelected?.targets,
    daoProposalSelected?.values,
    daoProposalSelected.description,
    daoProposalSelected.externalResource,
    daoProposalSelected.title,
    daoProposalSelected.type,
    daoSelected?.address
  ])

  // Open the DAO config editor with current DAO settings prefilled
  const openDaoConfigEditor = useCallback(
    (type: "quorumNumerator" | "votingDelay" | "votingPeriod" | "proposalThreshold") => {
      if (!daoSelected?.address) {
        openNotification({ message: "DAO not loaded yet", variant: "error", autoHideDuration: 2500 })
        return
      }

      // Prefill the chosen field BEFORE moving to step 3 so initial UI uses it
      const defaults = computeDaoConfigDefaults(daoSelected as any)
      const applyDefaultFor = (t: typeof type) => {
        if (t === "quorumNumerator") return zustantStore.setDaoConfig("quorumNumerator", defaults.quorumNumerator)
        if (t === "votingDelay") return zustantStore.setDaoConfig("votingDelay", defaults.votingDelay)
        if (t === "votingPeriod") return zustantStore.setDaoConfig("votingPeriod", defaults.votingPeriod)
        if (t === "proposalThreshold") return zustantStore.setDaoConfig("proposalThreshold", defaults.proposalThreshold)
      }
      applyDefaultFor(type)

      // Stamp the type/address and move to the config step
      zustantStore.setDaoConfig(type, undefined, daoSelected.address)

      // Re-apply to refresh calldatas with the now-known address
      applyDefaultFor(type)
    },
    [daoSelected, openNotification, zustantStore]
  )

  // --- On-chain status helpers (for optimistic UI + fallback) ---
  const computeOnchainProposalId = useCallback(async () => {
    if (!daoContract || !daoProposalSelected?.id) return null
    try {
      const meta = getProposalExecutionMetadata()
      const proposalId = await (daoContract as any).hashProposal(
        meta.targets,
        meta.values,
        meta.calldatas,
        meta.hashHex
      )
      return proposalId as bigint
    } catch (e) {
      console.log("computeOnchainProposalId error", e)
      return null
    }
  }, [daoContract, daoProposalSelected?.id, getProposalExecutionMetadata])

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
        setOverrideQueued(daoProposalSelected.id, Number(eta))
        return
      }
      try {
        const needsQueue: boolean = await (daoContract as any).proposalNeedsQueuing(pid)
        if (needsQueue === false) {
          const approxEta = Math.floor(Date.now() / 1000) + (daoSelected?.executionDelay || 0)
          setOverrideQueued(daoProposalSelected.id, approxEta)
        }
      } catch (_) {
        // ignore
      }
    } catch (e) {
      console.log("checkOnchainQueuedAndOverride error", e)
    }
  }, [computeOnchainProposalId, daoContract, daoProposalSelected?.id, daoSelected?.executionDelay, setOverrideQueued])

  const createProposal = useCallback(
    async (payload: {
      targets: string[]
      values: (number | string | bigint)[]
      calldatas: string[]
      description: string
    }) => {
      if (!daoSelected || !daoContract) {
        throw new Error("Wallet not connected or DAO contract unavailable. Connect your wallet and try again.")
      }
      const { targets, values, calldatas, description } = payload

      // Basic guards to prevent malformed propose calls
      if (!Array.isArray(targets) || !Array.isArray(values) || !Array.isArray(calldatas)) {
        throw new Error("Invalid proposal payload: targets, values and calldatas must be arrays")
      }
      if (!(targets.length === values.length && values.length === calldatas.length)) {
        throw new Error("Invalid proposal payload: targets/values/calldatas length mismatch")
      }

      console.log("createProposal", { targets, values, calldatas, description })
      try {
        const tx = await daoContract.propose(targets, values, calldatas, description)
        console.log("Proposal transaction sent:", tx.hash)
        const receipt = await tx.wait()
        console.log("Proposal transaction confirmed:", receipt)
        return receipt
      } catch (error: any) {
        const revertSelector = (() => {
          const candidates = [
            error?.data,
            error?.error?.data,
            error?.error?.error?.data,
            error?.info?.error?.data,
            error?.data?.data,
            error?.error?.data?.data,
            error?.data?.originalError?.data
          ]
          for (const candidate of candidates) {
            if (typeof candidate === "string" && candidate.startsWith("0x") && candidate.length >= 10) {
              return candidate.slice(0, 10)
            }
          }
          return null
        })()

        if (revertSelector === "0x31b75e4d") {
          openNotification({
            message:
              "Duplicate proposal not allowed. This proposal matches an existing on-chain contract call. Please modify the action or description before submitting again.",
            variant: "error",
            autoHideDuration: 4000
          })
          throw new Error("Duplicate proposal detected")
        }

        throw error
      }
    },
    [daoSelected, daoContract, openNotification]
  )

  const castVote = useCallback(
    async (proposalId: string, support: boolean) => {
      if (!daoContract || !proposalId) throw new Error("No dao contract or proposal id")

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
    if (!daoContract || !daoProposalSelected?.id) throw new Error("No dao contract or proposal id")

    const metadata = getProposalExecutionMetadata()
    if (!metadata) throw new Error("Could not get proposal metadata")

    console.log("proposalAction metadata", metadata)

    const tx = await daoContract.queue(metadata.targets, metadata.values, metadata.calldatas, metadata.hashHex)
    console.log("Queue transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("Queue transaction confirmed:", receipt)
    // Optimistic UI: reflect queued state immediately
    try {
      await checkOnchainQueuedAndOverride()
      if (!proposalOverrides?.[daoProposalSelected.id]?.status) {
        const approxEta = Math.floor(Date.now() / 1000) + (daoSelected?.executionDelay || 0)
        setOverrideQueued(daoProposalSelected.id, approxEta)
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
    checkOnchainQueuedAndOverride,
    proposalOverrides,
    setOverrideQueued,
    daoSelected?.executionDelay
  ])

  const executeProposal = useCallback(async () => {
    if (!daoContract) throw new Error("No dao contract or proposal id")

    const metadata = getProposalExecutionMetadata()
    if (!metadata) throw new Error("Could not get proposal metadata")

    const tx = await daoContract.execute(metadata.targets, metadata.values, metadata.calldatas, metadata.hashHex)
    console.log("Execute transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("Execute transaction confirmed:", receipt)
    try {
      if (daoProposalSelected?.id) {
        setOverrideExecuted(daoProposalSelected.id)
      }
    } catch (_) {
      // ignore optimistic override errors
    }
    return receipt
  }, [daoContract, daoProposalSelected?.id, getProposalExecutionMetadata, setOverrideExecuted])

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
        // Validate payloads per proposal type before submitting
        if (proposalType !== "off_chain_debate") {
          let payload = { ...zustantStore.createProposalPayload }

          // Type-aware validations and defaults
          if (proposalType === "transfer_assets") {
            // Fallback: attempt to (re)build from current transaction rows before erroring
            if (!Array.isArray(payload.calldatas) || payload.calldatas.length === 0) {
              const txs = (zustantStore.transferAssets?.transactions || []) as any[]
              try {
                dbg("EL-XFER:nextStep:rebuild:start", { txs })
                // Use store.getState() to read the freshly updated payload synchronously
                zustantStore.setTransferAssets(txs, daoSelected?.registryAddress as string)
                const latest = useEvmProposalCreateZustantStore.getState().createProposalPayload
                payload = { ...latest }
                dbg("EL-XFER:nextStep:rebuild:end", {
                  targets: payload.targets?.length || 0,
                  calldatas: payload.calldatas?.length || 0
                })
              } catch (e) {
                dbg("EL-XFER:nextStep:rebuild:error", String((e as any)?.message || e))
              }
            }

            const hasTransfers = Array.isArray(payload.targets) && payload.targets.length > 0
            const hasCalldata = Array.isArray(payload.calldatas) && payload.calldatas.length > 0
            if (!hasTransfers || !hasCalldata) {
              openNotification({
                message:
                  "Add at least one valid transfer (recipient + amount for tokens, or recipient + tokenId for NFTs)",
                autoHideDuration: 3500,
                variant: "error"
              })
              return
            }
            // Ensure arrays are the same length
            if (!(payload.targets.length === payload.calldatas.length)) {
              openNotification({
                message: "Transfers are incomplete. Please review entries.",
                autoHideDuration: 3500,
                variant: "error"
              })
              return
            }
            // Values are ignored by treasury methods; keep zeroes aligned
            payload.values = Array(payload.targets.length).fill(0)
          }

          if (proposalType === "contract_call") {
            const tgt = zustantStore.daoContractCall?.targetAddress
            const hasTarget = !!tgt && ethers.isAddress(tgt)
            const hasCalldata = Array.isArray(payload.calldatas) && !!payload.calldatas[0]
            if (!hasTarget || !hasCalldata) {
              openNotification({
                message: !hasTarget ? "Enter a valid target contract address" : "Enter contract calldata",
                autoHideDuration: 3500,
                variant: "error"
              })
              return
            }
            // Ensure arrays are aligned: one target, one calldata, one value (default 0)
            payload.targets = [tgt]
            payload.values = (payload.values && payload.values.length > 0 ? payload.values : [0]) as any
            payload.calldatas = [payload.calldatas[0]]
          }

          if (proposalType === "edit_registry") {
            // Ensure target is the registry address and calldata present
            const reg = daoSelected?.registryAddress
            const hasCalldata = Array.isArray(payload.calldatas) && !!payload.calldatas[0]
            if (!reg || !hasCalldata) {
              openNotification({
                message: !reg ? "Missing DAO registry address" : "Enter a registry key/value",
                autoHideDuration: 3500,
                variant: "error"
              })
              return
            }
            payload.targets = [reg]
            payload.values = [0]
            payload.calldatas = [payload.calldatas[0]]
          }

          // Final generic guard for on-chain proposals
          if (
            !Array.isArray(payload.targets) ||
            !Array.isArray(payload.values) ||
            !Array.isArray(payload.calldatas) ||
            payload.targets.length === 0 ||
            !(payload.targets.length === payload.values.length && payload.values.length === payload.calldatas.length)
          ) {
            openNotification({
              message: "Incomplete proposal data. Please complete required fields.",
              autoHideDuration: 3500,
              variant: "error"
            })
            return
          }

          // Overwrite the store payload just for this submission path
          // (Do not mutate persistent fields beyond what caller expects.)
          // Use the validated payload when sending the tx below
          // Continue into submission flow with `payload`
        }
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

          // Build a final payload with safe defaults/alignment per type
          const finalPayload = { ...zustantStore.createProposalPayload }
          if (proposalType === "transfer_assets") {
            finalPayload.values = Array(finalPayload.targets.length).fill(0)
          } else if (proposalType === "contract_call") {
            const tgt = zustantStore.daoContractCall?.targetAddress
            finalPayload.targets = [tgt]
            finalPayload.values = (
              finalPayload.values && finalPayload.values.length > 0 ? finalPayload.values : [0]
            ) as any
            finalPayload.calldatas = [finalPayload.calldatas[0]]
          } else if (proposalType === "edit_registry") {
            const reg = daoSelected?.registryAddress
            finalPayload.targets = [reg]
            finalPayload.values = [0]
            finalPayload.calldatas = [finalPayload.calldatas[0]]
          }

          if (!daoContract) {
            openNotification({
              message: "Connect your wallet on Etherlink to submit the proposal.",
              autoHideDuration: 3500,
              variant: "error"
            })
            closeSnackbar()
            setIsDeploying(false)
            return
          }

          createProposal(finalPayload)
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
    openDaoConfigEditor,
    nextStep,
    prevStep,
    isDeploying,
    isNextDisabled,
    ...zustantStore
  }
}
