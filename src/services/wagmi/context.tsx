import React, { useState, createContext, ReactNode, useMemo, useRef, useEffect, useCallback } from "react"
import { useSwitchChain, useAccount as useWagmiAccount } from "wagmi"
import { disconnect as disconnectEtherlink } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { useModal } from "connectkit"
import { useEthersProvider, useEthersSigner } from "./ethers"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"
import { useNetwork } from "services/useNetwork"
import { usePostHog } from "posthog-js/react"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import { ethers } from "ethers"
import BigNumber from "bignumber.js"
import { Timestamp } from "firebase/firestore"
import {
  decodeCalldataWithEthers,
  decodeFunctionParametersLegacy,
  getCallDataFromBytes,
  getBlockExplorerUrl,
  getEtherAddressDetails,
  getEtherTokenBalances,
  getEtherlinkDAONfts
} from "modules/etherlink/utils"
import { proposalInterfaces } from "modules/etherlink/config"
import { fetchOffchainProposals } from "services/services/lite/lite-services"
import { IEvmDAO, IEvmFirebaseContract, IEvmFirebaseDAOMember, IEvmFirebaseProposal } from "modules/etherlink/types"
import { networkConfig } from "modules/etherlink/utils"

dayjs.extend(utc)
dayjs.extend(timezone)

const useEtherlinkDao = ({ network }: { network: string }) => {
  const selectedDaoIdRef = useRef<string | null>(null)

  const firebaseRootCollection = useMemo(() => {
    return networkConfig[network as keyof typeof networkConfig]?.firebaseRootCollection
  }, [network])

  console.log("firebaseRootCollection", firebaseRootCollection)

  const firebaseRootTokenCollection = useMemo(() => {
    return networkConfig[network as keyof typeof networkConfig]?.firebaseRootTokenCollection
  }, [network])

  const [isLoadingDaos, setIsLoadingDaos] = useState(!!firebaseRootCollection)
  const [isLoadingDaoProposals, setIsLoadingDaoProposals] = useState(true)
  const [contractData, setContractData] = useState<any[]>([])
  const [daoData, setDaoData] = useState<IEvmDAO[]>([])
  const [daoSelected, setDaoSelected] = useState<IEvmDAO | null>(null)
  const [daoRegistryDetails, setDaoRegistryDetails] = useState<{
    balance: string
  }>({ balance: "0" })
  const [daoTreasuryTokens, setDaoTreasuryTokens] = useState<any[]>([])
  const [daoOffchainProposals, setDaoOffchainProposals] = useState<any[]>([])
  const [daoNfts, setDaoNfts] = useState<
    {
      id: string
      image_url: string
      metadata: {
        name: string
        description?: string
        attributes: {
          trait_type: string
          value: string
        }[]
      }
      token: {
        address: string
        name: string
        symbol: string
        decimals: number
        type: "ERC-721" | "ERC-1155"
      }
    }[]
  >([])
  const [daoProposals, setDaoProposals] = useState<any[]>([])
  const [daoProposalSelected, setDaoProposalSelected] = useState<any>({})
  const [daoProposalOffchainSelected, setDaoProposalOffchainSelected] = useState<any>({})
  const [daoProposalVoters, setDaoProposalVoters] = useState<
    {
      cast: Timestamp
      option: number
      reason?: string
      voter: string
      weight: string
    }[]
  >([])

  const [daoMembers, setDaoMembers] = useState<IEvmFirebaseDAOMember[]>([])
  const { data: firestoreData, fetchCollection } = useFirestoreStore()
  const [refreshCount, setRefreshCount] = useState(0)
  const timerForRecomputation = useRef<NodeJS.Timeout | null>(null)

  const recomputeDataAfter = useCallback((timeInSeconds: number) => {
    timerForRecomputation.current = setTimeout(() => {
      timerForRecomputation.current = null
      setRefreshCount((count: number) => count + 1)
    }, timeInSeconds * 1000)
  }, [])

  useEffect(() => {
    fetchCollection("contracts")
    if (firebaseRootCollection) {
      // Trigger DAO Loading Request
      fetchCollection(firebaseRootCollection)
    }
    if (firebaseRootTokenCollection) {
      // Trigger Token Loading Request
      fetchCollection(firebaseRootTokenCollection)
    }
  }, [fetchCollection, firebaseRootCollection, firebaseRootTokenCollection])

  useEffect(() => {
    if (!firebaseRootCollection) return
    if (daoProposalSelected?.type === "offchain") return

    if (firestoreData?.[firebaseRootCollection]) {
      const allDaoList = firestoreData[firebaseRootCollection]
      setDaoData(allDaoList)
      setIsLoadingDaos(false)
    }

    if (firestoreData?.["contracts"]) {
      const isTestnet = firebaseRootCollection?.toLowerCase().includes("testnet")
      const contractDataForNetwork = firestoreData["contracts"]?.find((contract: IEvmFirebaseContract) => {
        console.log({ contract })
        return isTestnet
          ? contract.id?.toLowerCase().includes("testnet")
          : !contract.id?.toLowerCase().includes("testnet")
      })
      console.log("contractDataForNetwork", contractDataForNetwork)
      setContractData(contractDataForNetwork)
    }
    if (!daoSelected?.id) return
    const daoProposalKey = `${firebaseRootCollection}/${daoSelected.id}/proposals`
    const daoMembersKey = `${firebaseRootCollection}/${daoSelected?.id}/members`
    const daoProposalVotesKey = `${firebaseRootCollection}/${daoSelected?.id}/proposals/${daoProposalSelected?.id}/votes`

    if (firestoreData?.[daoProposalKey]) {
      const timeNow = dayjs()
      const onChainProposals = firestoreData[daoProposalKey]
        ?.sort((a: IEvmFirebaseProposal, b: IEvmFirebaseProposal) => b.createdAt?.seconds - a.createdAt?.seconds)
        .map((firebaseProposal: IEvmFirebaseProposal) => {
          const proposalCreatedAt = dayjs.unix(firebaseProposal.createdAt?.seconds as unknown as number)
          const votesInFavor = new BigNumber(firebaseProposal?.inFavor)
          const votesAgainst = new BigNumber(firebaseProposal?.against)
          const votesInFavorWeight = new BigNumber(firebaseProposal?.inFavor)
          const votesAgainstWeight = new BigNumber(firebaseProposal?.against)

          const votingDelayInMinutes = daoSelected?.votingDelay || 1
          const votingDurationInMinutes = daoSelected?.votingDuration || 1
          const activeStartTimestamp = proposalCreatedAt.add(votingDelayInMinutes, "minutes")
          const votingExpiresAt = activeStartTimestamp.add(votingDurationInMinutes, "minutes")

          const totalVotes = votesInFavor.plus(votesAgainst)
          const totalVoteCount = Number(firebaseProposal?.votesFor) + Number(firebaseProposal?.votesAgainst)
          const totalSupply = new BigNumber(daoSelected?.totalSupply ?? "1")
          const votesPercentage = totalVotes.div(totalSupply).times(100)
          const daoMinimumQuorum = new BigNumber(daoSelected?.quorum ?? "0")
          const daoTotalVotingWeight = new BigNumber(daoSelected?.totalSupply ?? "0")
          let executionAvailableAt = undefined

          const statusHistoryMap = Object.entries(firebaseProposal.statusHistory)
            .map(([status, timestamp]: [string, any]) => ({
              status,
              timestamp: timestamp?.seconds as unknown as number,
              timestamp_human: dayjs.unix(timestamp?.seconds as unknown as number).format("MMM DD, YYYY hh:mm A")
            }))
            .sort((a, b) => b.timestamp - a.timestamp)

          const queuedStatus = statusHistoryMap.find(x => x.status === "queued")
          if (queuedStatus) {
            executionAvailableAt = dayjs.unix(queuedStatus.timestamp).add(daoSelected?.executionDelay, "seconds")
          }

          const statusContainsPending = statusHistoryMap.findIndex(x => x.status === "pending")
          if (activeStartTimestamp.isBefore(timeNow)) {
            statusHistoryMap.splice(statusContainsPending + 1, 0, {
              status: "active",
              timestamp: activeStartTimestamp.unix(),
              timestamp_human: activeStartTimestamp.format("MMM DD, YYYY hh:mm A")
            })

            if (votesInFavorWeight.div(daoTotalVotingWeight).times(100).gt(daoMinimumQuorum)) {
              statusHistoryMap.splice(statusContainsPending + 2, 0, {
                status: "passed",
                timestamp: votingExpiresAt.unix(),
                timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
              })
            } else if (votesAgainstWeight.div(daoTotalVotingWeight).times(100).gt(daoMinimumQuorum)) {
              statusHistoryMap.splice(statusContainsPending + 2, 0, {
                status: "failed",
                timestamp: votingExpiresAt.unix(),
                timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
              })
            }
          }

          const statusContainsPassed = statusHistoryMap.findIndex(x => x.status === "passed")
          if (votingExpiresAt.isBefore(timeNow) && statusContainsPassed !== -1) {
            statusHistoryMap.splice(statusContainsPassed + 1, 0, {
              status: "queue_to_execute",
              timestamp: votingExpiresAt.unix() + 1,
              timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
            })
          }

          const statusContainsQueued = statusHistoryMap.findIndex(x => x.status === "queued")
          if (votingExpiresAt.isBefore(timeNow)) {
            if (votesPercentage.lt(daoSelected?.quorum)) {
              statusHistoryMap.push({
                status: "no quorum",
                timestamp: votingExpiresAt.unix(),
                timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
              })
            } else if (statusContainsQueued === -1) {
              if (statusHistoryMap.find(x => x.status === "failed")) {
                statusHistoryMap.push({
                  status: "defeated",
                  timestamp: votingExpiresAt.unix(),
                  timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
                })
              }
            } else if (statusContainsQueued !== -1) {
              if (statusHistoryMap.find(x => x.status === "passed")) {
                const executionDelayInSeconds = daoSelected?.executionDelay || 0
                const proposalExecutableAt = statusHistoryMap[statusContainsQueued].timestamp + executionDelayInSeconds

                if (proposalExecutableAt < timeNow.unix()) {
                  statusHistoryMap.splice(statusContainsQueued + 1, 0, {
                    status: "executable",
                    timestamp: proposalExecutableAt,
                    timestamp_human: dayjs.unix(proposalExecutableAt).format("MMM DD, YYYY hh:mm A")
                  })
                }
              }
            }
          }

          const callDatas = firebaseProposal?.callDatas
          const callDataPlain = callDatas?.map((x: any) => getCallDataFromBytes(x))

          const sortedStatusHistoryMap = statusHistoryMap.sort((a, b) => b.timestamp - a.timestamp)
          const proposalStatus = sortedStatusHistoryMap[0]?.status

          const latestStage = proposalStatus

          // Setting up timerLabel
          let isVotingActive = false
          let isTimerActive = false
          let timerLabel = "Voting concluded"
          let timerTargetDate = null
          console.log("activeStartTimestamp", activeStartTimestamp)
          console.log("votingExpiresAt", votingExpiresAt)
          if (latestStage === "pending") {
            isTimerActive = true
            timerLabel = "Voting starts in"
            timerTargetDate = activeStartTimestamp
            recomputeDataAfter(activeStartTimestamp.diff(timeNow, "seconds"))
          }

          if (votingExpiresAt?.isAfter(timeNow) && activeStartTimestamp?.isBefore(timeNow)) {
            isVotingActive = true
            isTimerActive = true
            timerLabel = "Time left to vote"
            timerTargetDate = votingExpiresAt
            recomputeDataAfter(votingExpiresAt.diff(timeNow, "seconds"))
          }
          console.log("proposalStatus", proposalStatus, executionAvailableAt?.format("MMM DD, YYYY hh:mm A"))
          if (latestStage === "queued" && executionAvailableAt) {
            isTimerActive = true
            timerLabel = "Execution available in"
            timerTargetDate = executionAvailableAt
            recomputeDataAfter(executionAvailableAt.diff(timeNow, "seconds"))
          }

          console.log("sortedStatusHistoryMap", sortedStatusHistoryMap)

          return {
            ...firebaseProposal,
            createdAt: dayjs.unix(firebaseProposal.createdAt?.seconds as unknown as number),
            callDataPlain,
            executionAvailableAt: executionAvailableAt,

            isVotingActive,
            isTimerActive,
            proposalData: [],
            status: proposalStatus,
            statusHistoryMap: sortedStatusHistoryMap,

            totalVotes: totalVotes,
            totalVoteCount,
            timerLabel,
            timerTargetDate,
            txHash: getBlockExplorerUrl(network, firebaseProposal?.executionHash),

            votingStartTimestamp: activeStartTimestamp,
            votingExpiresAt,
            votesWeightPercentage: Number(votesPercentage.toFixed(2))
          }
        })

      setDaoProposals(onChainProposals)
    }

    if (firestoreData?.[daoMembersKey]) {
      setDaoMembers(firestoreData[daoMembersKey])
    }

    if (firestoreData?.[daoProposalVotesKey]) {
      setDaoProposalVoters(firestoreData[daoProposalVotesKey])
    }
  }, [
    daoProposalSelected?.id,
    daoProposalSelected?.type,
    daoSelected,
    daoSelected?.votingDuration,
    firebaseRootCollection,
    firestoreData,
    network,
    recomputeDataAfter,
    refreshCount
  ])

  useEffect(() => {
    console.log({ daoSelected })
    if (daoSelected?.id && firebaseRootCollection && daoProposalSelected?.type !== "offchain") {
      fetchCollection(`${firebaseRootCollection}/${daoSelected.id}/proposals`)
      fetchCollection(`${firebaseRootCollection}/${daoSelected.id}/members`)

      // TODO: Replace this with proper service

      Promise.all([
        getEtherAddressDetails(network, daoSelected.registryAddress).then(data => {
          const tokenDecimals = daoSelected.decimals
          const coinBalance = data?.coin_balance
          const ethBalance = ethers.formatEther(coinBalance)
          setDaoRegistryDetails({
            balance: ethBalance
          })
          console.log("Treasury Data", ethBalance)
        }),
        getEtherTokenBalances(network, daoSelected.registryAddress).then(data => {
          console.log("Treasury Data", data)
          setDaoTreasuryTokens(
            data?.map((token: any) => ({
              address: token.token.address,
              balance: ethers.formatUnits(token.value, Number(token.token.decimals)),
              decimals: Number(token.token.decimals),
              symbol: token.token?.symbol || "Unknown",
              name: token.token?.name || "Unknown"
            }))
          )
        }),
        getEtherlinkDAONfts(network, daoSelected.registryAddress).then(data => {
          console.log("NFTs", data)
          setDaoNfts(data?.items)
        })
      ])

      if (daoProposalSelected?.id && daoProposalSelected?.type !== "offchain") {
        fetchCollection(`${firebaseRootCollection}/${daoSelected?.id}/proposals/${daoProposalSelected?.id}/votes`)
      }
    }
  }, [
    daoProposalSelected?.id,
    daoProposalSelected?.type,
    daoSelected,
    fetchCollection,
    firebaseRootCollection,
    network
  ])

  useEffect(() => {
    if (!daoSelected?.id) return
    fetchOffchainProposals(daoSelected?.id).then(offchainProposals => {
      setDaoOffchainProposals(offchainProposals)
    })
  }, [daoSelected?.id])

  const daoOffchainPollList = daoOffchainProposals.map(x => ({
    against: "tbd",
    author: x.author,
    callDataPlain: [],
    callDatas: [],
    calldata: "0x",
    choices: x.choices,
    createdAt: dayjs(x.createdAt),
    description: x.description,
    executionHash: "",
    externalResource: x.externalLink,
    hash: "",
    id: x._id,
    isVotingActive: true, // TBD,
    latestStage: "pending", // TBD,
    status: dayjs.unix(x.endTime).isAfter(dayjs()) ? "active" : "pending",
    statusHistoryMap: [],
    statusHistory: {},
    targets: [],
    title: x.name,
    totalVotes: new BigNumber(0),
    totalVoteCount: 0,
    timerLabel: "Voting starts in",
    transactions: [],
    txHash: "",
    type: "offchain",
    values: [],
    votesAgainst: 0,
    votesFor: 1, //TBD,
    votesWeightPercentage: 0, // TBD
    votingExpiresAt: dayjs.unix(x.endTime),
    votingStartTimestamp: dayjs.unix(x.startTime)
  }))

  const allDaoProposals = [...daoProposals, ...daoOffchainPollList].sort(
    (a, b) => b.createdAt.unix() - a.createdAt.unix()
  )

  const getFunctionAbi = useCallback<any>((callData: string) => {
    const transferEthSelector = ethers.id("transferETH(address,uint256)").substring(0, 10)
    const transferErc20Selector = ethers.id("transferERC20(address,address,uint256)").substring(0, 10)
    const transferErc721Selector = ethers.id("transferERC721(address,address,uint256)").substring(0, 10)
    const callDataSelector = callData.substring(0, 10)

    if (callDataSelector === transferEthSelector) {
      return proposalInterfaces.find((x: any) => x.name === "transferETH")
    } else if (callDataSelector === transferErc20Selector) {
      return proposalInterfaces.find((x: any) => x.name === "transferERC20")
    } else if (callDataSelector === transferErc721Selector) {
      return proposalInterfaces.find((x: any) => x.name === "transferERC721")
    }
    return {}
  }, [])

  return {
    contractData,
    daos: daoData,
    daoSelected,
    daoRegistryDetails,
    daoTreasuryTokens,
    daoNfts,
    daoProposals: allDaoProposals,
    daoProposalSelected,
    daoMembers,
    daoProposalVoters,
    selectDaoProposal: (proposalId: string) => {
      const proposal = allDaoProposals.find((proposal: any) => proposal.id === proposalId)
      console.log("selectDaoProposal", proposal)
      if (proposal && proposal?.type === "offchain") {
        console.log("Selecing Offchain Proposal", proposal)
        // setDaoProposalOffchainSelected(proposal)
      } else if (proposal && proposal?.type !== "contract call") {
        const fAbi = getFunctionAbi(proposal?.callDataPlain?.[0])
        console.log("fAbi", fAbi)
        const proposalInterfacesPossible = proposalInterfaces.filter((x: any) => {
          let fbType = proposal?.type?.toLowerCase()
          console.log("callDataXYB fbType", fbType)
          if (fbType?.startsWith("mint")) fbType = "mint"
          if (fbType?.startsWith("burn")) fbType = "burn"
          return x.tags?.includes(fbType)
        })

        const functionAbi = proposalInterfacesPossible?.[0]?.interface?.[0] as string
        const functionAbiAlternate = fAbi?.interface?.[0] || (proposalInterfacesPossible?.[1]?.interface?.[0] as string)
        console.log("callDataXYB functionAbi", functionAbi, functionAbiAlternate)
        if (!functionAbi) return []

        const proposalData = proposalInterfacesPossible
          ? proposal?.callDataPlain?.map((callData: any) => {
              console.log("callDataXYB", callData)
              const formattedCallData = callData.startsWith("0x") ? callData : `0x${callData}`
              const decodedDataPair = decodeCalldataWithEthers(functionAbi, formattedCallData)
              const decodedDataPairLegacy = decodeFunctionParametersLegacy(functionAbi, formattedCallData)
              console.log("callDataXYB decodedDataPair", decodedDataPair)
              console.log("callDataXYB decodedDataPairLegacy", decodedDataPairLegacy)
              const functionName = decodedDataPair?.functionName
              const functionParams = decodedDataPair?.decodedData
              const proposalInterface = proposalInterfaces.find((x: any) => x.name === functionName)

              const label = proposalInterface?.label
              console.log("callDataXYB decodedDataPair", decodedDataPair, functionName, functionParams)
              console.log("callDataXYB decodedDataPairLegacy", `-> ${decodedDataPairLegacy[0]}`)
              if (proposal.type === "transfer" && !label) {
                const decodeDataAlternate = decodeCalldataWithEthers(functionAbiAlternate, formattedCallData)
                console.log("callDataXYB decodeDataAlternate", decodeDataAlternate)
                return {
                  parameter: "Transfer",
                  value: `${decodeDataAlternate?.functionName}:${decodeDataAlternate?.decodedData?.join(", ")}`
                }
              }
              return { parameter: label || functionName, value: functionParams.join(", ") }
            })
          : []
        proposal.proposalData = proposalData
        setDaoProposalSelected(proposal)
      } else if (proposal?.type === "contract call") {
        proposal.proposalData = [
          {
            parameter: `Contract Call from ${proposal?.targets?.[0]}`,
            value: proposal?.callDataPlain?.[0]
          }
        ]
        setDaoProposalSelected(proposal)
      }
    },
    selectDao: (daoId: string) => {
      const dao = daoData.find(dao => dao.id === daoId)
      if (dao) {
        setDaoSelected(dao)
        selectedDaoIdRef.current = daoId
      }
    },
    isLoadingDaos,
    isLoadingDaoProposals
  }
}

export const EtherlinkContext = createContext<any | undefined>(undefined)

export const EtherlinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)
  const { setOpen } = useModal()
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  const { switchChain } = useSwitchChain()
  const { network: contextNetwork } = useNetwork()
  const [signerTokenBalances, setSignerTokenBalances] = useState<any[]>([])
  const posthog = usePostHog()

  const { address, isConnected, chain } = useWagmiAccount()

  const etherlinkNetwork = useMemo(() => {
    if (chain?.name === "Etherlink") {
      return "etherlink_mainnet"
    }
    if (chain?.name === "Etherlink Testnet") {
      return "etherlink_testnet"
    }
    return contextNetwork
  }, [chain?.name, contextNetwork])

  const switchToNetwork = useCallback(
    (network: string) => {
      const networkId = network === "etherlink_mainnet" ? etherlink.id : etherlinkTestnet.id
      switchChain({ chainId: networkId })

      // PostHog identify with updated network for EVM
      if (posthog && address) {
        posthog.identify(address, {
          wallet_address: address,
          network: network,
          wallet_type: "evm"
        })
      }
    },
    [switchChain, posthog, address]
  )

  useEffect(() => {
    if (!signer?.address) return
    getEtherTokenBalances(etherlinkNetwork, signer?.address).then(data => {
      setSignerTokenBalances(data?.map((x: any) => x.token?.address))
    })
  }, [signer?.address, etherlinkNetwork])

  // PostHog identify for EVM wallet connection
  useEffect(() => {
    if (isConnected && address && posthog) {
      posthog.identify(address, {
        wallet_address: address,
        network: etherlinkNetwork,
        wallet_type: "evm"
      })
    }
  }, [isConnected, address, etherlinkNetwork, posthog])

  const {
    contractData,
    daos,
    isLoadingDaos,
    daoSelected,
    daoNfts,
    daoRegistryDetails,
    daoTreasuryTokens,
    daoProposals,
    isLoadingDaoProposals,
    daoProposalSelected,
    daoMembers,
    daoProposalVoters,
    selectDaoProposal,
    selectDao
  } = useEtherlinkDao({
    network: etherlinkNetwork || ""
  })

  return (
    <EtherlinkContext.Provider
      value={{
        isConnected,
        provider,
        signer,
        signerTokenBalances,
        account: {
          address: address || ""
        },
        network: etherlinkNetwork,
        connect: () => {
          setOpen(true)
        },
        contractData,
        isProposalDialogOpen,
        setIsProposalDialogOpen,
        daos,
        isLoadingDaos,
        isLoadingDaoProposals,
        daoSelected,
        daoNfts,
        daoRegistryDetails,
        daoTreasuryTokens,
        daoProposals,
        daoProposalSelected,
        daoMembers,
        daoProposalVoters,
        selectDaoProposal,
        selectDao,
        disconnect: () => disconnectEtherlink(wagmiConfig),
        switchToNetwork
      }}
    >
      {children}
    </EtherlinkContext.Provider>
  )
}
