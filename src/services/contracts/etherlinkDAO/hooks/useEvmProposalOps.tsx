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
import dayjs from "dayjs"
import { getSignature } from "services/lite/utils"
import { getEthSignature } from "services/utils/utils"
import { saveLiteProposal, voteOnLiteProposal } from "services/services/lite/lite-services"
import { IEvmOffchainChoice, IEvmOffchainChoiceForVote } from "modules/etherlink/types"

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
  offchainDebate: {
    expiry_days: string
    expiry_hours: string
    expiry_minutes: string
    options: string[]
    is_multiple_choice: boolean
  }
  setOffchainDebate: (key: string, value: string) => void
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
        }
        if (type === "proposalThreshold") {
          ifaceDef = proposalInterfaces.find(p => p.name === "setProposalThreshold")
          if (!ifaceDef) return
          iface = new ethers.Interface(ifaceDef.interface)
          encodedData = iface.encodeFunctionData(ifaceDef.name, [value])
        }

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
      offchainDebate: {
        expiry_days: "",
        expiry_hours: "",
        expiry_minutes: "",
        options: ["", ""],
        is_multiple_choice: false
      },
      setOffchainDebate: (key: string, value: string) => {
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
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export const useEvmProposalOps = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { etherlink, network } = useTezos()
  const { daoSelected, daoProposalSelected } = useContext(EtherlinkContext)
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

  const createProposal = useCallback(
    async (payload: Record<string, any>) => {
      if (!daoSelected || !daoContract) return
      console.log("createProposal", payload)
      const tx = await daoContract.propose(...Object.values(payload))
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
    if (!daoContract || !daoProposalSelected?.id || !daoSelected?.address)
      return alert("No dao contract or proposal id")

    const metadata = getProposalExecutionMetadata()
    if (!metadata) return alert("Could not get proposal metadata")
    console.log("proposalAction metadata", daoSelected?.address, metadata)
    const tx = await daoContract.queue([daoSelected?.address], [0], metadata.calldata, metadata.hashHex)
    console.log("Queue transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("Queue transaction confirmed:", receipt)

    return receipt
  }, [daoContract, daoProposalSelected?.id, daoSelected?.address, getProposalExecutionMetadata])

  const executeProposal = useCallback(async () => {
    if (!daoContract) return

    const metadata = getProposalExecutionMetadata()
    if (!metadata) return alert("Could not get proposal metadata")

    const tx = await daoContract.execute([daoSelected?.address], [0], metadata.calldata, metadata.hashHex)
    console.log("Execute transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("Execute transaction confirmed:", receipt)
    return receipt
  }, [daoContract, daoSelected?.address, getProposalExecutionMetadata])

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

        const { closeSnackbar } = openNotification({
          message: "Creating Proposal...",
          variant: "success"
        })

        if (proposalType === "off_chain_debate") {
          const offchainPayload = zustantStore.offchainDebate
          const proposalMetadata = zustantStore.metadata
          const dataToSign = {
            name: proposalMetadata.title,
            description: proposalMetadata.description,
            externalLink: proposalMetadata.discussionUrl,
            choices: offchainPayload.options,
            endTimeDays: offchainPayload.expiry_days,
            endTimeHours: offchainPayload.expiry_hours,
            endTimeMinutes: offchainPayload.expiry_minutes,
            votingStrategy: offchainPayload.is_multiple_choice,
            startTime: String(dayjs().valueOf()),
            endTime: String(
              dayjs()
                .add(Number(offchainPayload.expiry_days), "days")
                .add(Number(offchainPayload.expiry_hours), "hours")
                .add(Number(offchainPayload.expiry_minutes), "minutes")
                .valueOf()
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
          if (res.ok) {
            openNotification({
              message: "Proposal created!",
              autoHideDuration: 3000,
              variant: "success"
            })
            router.push(`/explorer/etherlink/dao/${daoSelected?.address}/proposals`)
          } else {
            console.log("Error: ", respData.message)
            openNotification({
              message: respData.message,
              autoHideDuration: 3000,
              variant: "error"
            })
            setIsLoading(false)
            return
          }
          return console.log("offchainDebate", offchainPayload, proposalMetadata, signature, payloadBytes)
        } else {
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
    [daoContract, daoProposalSelected?.id, daoSelected?.address, etherlink.account.address, network, openNotification]
  )

  return {
    isLoading,
    setIsLoading,
    createProposal,
    castVote,
    castOffchainVote,
    queueForExecution,
    executeProposal,
    signer: etherlink?.signer,
    nextStep,
    prevStep,
    ...zustantStore
  }
}
