import React, { useState, createContext, ReactNode, useMemo, useRef, useEffect, useCallback } from "react"
import { useSwitchChain, useAccount as useWagmiAccount, useConnect as useWagmiConnect } from "wagmi"
import { disconnect as disconnectEtherlink } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { useModal } from "connectkit"
import { useEthersProvider, useEthersSigner } from "./ethers"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"

import dayjs from "dayjs"
import { ethers } from "ethers"
import BigNumber from "bignumber.js"
import { Timestamp } from "firebase/firestore"
import {
  decodeCalldataWithEthers,
  decodeFunctionParametersLegacy,
  getCallDataFromBytes,
  parseTransactionHash
} from "modules/etherlink/utils"
import { proposalInterfaces } from "modules/etherlink/config"

interface EtherlinkType {
  isConnected: boolean
  account: {
    address: string
  }
  network: string | undefined
  switchToNetwork: (network: string) => void
  connectWithWagmi: () => void
  connect: () => void
  disconnect: () => void
}

const useEtherlinkDao = ({ network }: { network: string }) => {
  const selectedDaoIdRef = useRef<string | null>(null)
  console.log("useEtherlinkDao", { network })

  const firebaseRootCollection = useMemo(() => {
    if (network === "etherlink_mainnet") {
      return "daosEtherlink-Mainnet"
    }
    if (network === "etherlink_testnet") {
      return "idaosEtherlink-Testnet"
    }
    return undefined
  }, [network])

  const firebaseRootTokenCollection = useMemo(() => {
    if (!firebaseRootCollection) return undefined
    if (firebaseRootCollection.endsWith("daosEtherlink-Testnet")) {
      return "tokensEtherlink-Testnet"
    }
    if (firebaseRootCollection.endsWith("daosEtherlink-Mainnet")) {
      return "tokensEtherlink-Mainnet"
    }
    return undefined
  }, [firebaseRootCollection])

  const [isLoadingDaos, setIsLoadingDaos] = useState(!!firebaseRootCollection)
  const [isLoadingDaoProposals, setIsLoadingDaoProposals] = useState(true)
  const [contractData, setContractData] = useState<any[]>([])
  const [daoData, setDaoData] = useState<any[]>([])
  const [daoSelected, setDaoSelected] = useState<{
    id: string
    address: string
    name: string
    symbol: string
    decimals: number
    description: string
    token: string
    registryAddress: string
    treasuryAddress: string
    proposalThreshold: string
    totalSupply: string
    registry: Record<string, string>
    votingDuration: number // in minutes
    votingDelay: number // in minutes
    quorum: number
    executionDelay: number // in seconds
  } | null>(null)
  const [daoRegistryDetails, setDaoRegistryDetails] = useState<{
    balance: string
  }>({ balance: "0" })

  const [daoProposals, setDaoProposals] = useState<any[]>([])
  const [daoProposalSelected, setDaoProposalSelected] = useState<any>({})
  const [daoProposalVoters, setDaoProposalVoters] = useState<
    {
      cast: Timestamp
      option: number
      reason?: string
      voter: string
      weight: string
    }[]
  >([])

  console.log(
    "AllCallData",
    daoProposals?.map((x: any) => x.callDataPlain?.[0])
  )

  const [daoMembers, setDaoMembers] = useState<any[]>([])
  const { data: firestoreData, loading, fetchCollection } = useFirestoreStore()

  // console.log({ firestoreData })

  console.log({ daoProposals, daoSelected })
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
    console.log("Firestore Data", firestoreData)
    if (!firebaseRootCollection) return
    if (firestoreData?.[firebaseRootCollection]) {
      setDaoData(firestoreData[firebaseRootCollection])
      setIsLoadingDaos(false)
    }

    if (firestoreData?.["contracts"]) {
      const isTestnet = firebaseRootCollection?.toLowerCase().includes("testnet")
      const contractDataForNetwork = firestoreData["contracts"]?.find((contract: any) =>
        contract.id?.toLowerCase().includes(isTestnet ? "testnet" : "mainnet")
      )
      setContractData(contractDataForNetwork)
    }
    if (!daoSelected?.id) return
    const daoProposalKey = `${firebaseRootCollection}/${daoSelected.id}/proposals`
    const daoMembersKey = `${firebaseRootCollection}/${daoSelected?.id}/members`
    const daoProposalVotesKey = `${firebaseRootCollection}/${daoSelected?.id}/proposals/${daoProposalSelected?.id}/votes`

    if (firestoreData?.[daoProposalKey]) {
      const timeNow = dayjs()
      setDaoProposals(
        firestoreData[daoProposalKey]
          ?.sort((a: any, b: any) => b.createdAt - a.createdAt)
          .map(firebaseProposal => {
            const votesInFavor = new BigNumber(firebaseProposal?.inFavor)
            const votesAgainst = new BigNumber(firebaseProposal?.against)
            const votesInFavorWeight = new BigNumber(firebaseProposal?.inFavor)

            const totalVotes = votesInFavor.plus(votesAgainst)
            const totalVoteCount = parseInt(firebaseProposal?.votesFor) + parseInt(firebaseProposal?.votesAgainst)
            const totalSupply = new BigNumber(daoSelected?.totalSupply ?? "1")
            const votesPercentage = totalVotes.div(totalSupply).times(100)
            const daoMinimumQuorum = new BigNumber(daoSelected?.quorum ?? "0")
            const daoTotalVotingWeight = new BigNumber(daoSelected?.totalSupply ?? "0")
            console.log("votesPercentage", firebaseProposal?.title, votesPercentage.toString())

            const proposalCreatedAt = dayjs.unix(firebaseProposal.createdAt?.seconds as unknown as number)
            const votingDelayInMinutes = daoSelected?.votingDelay || 1
            const votingDurationInMinutes = daoSelected?.votingDuration || 1

            const activeStartTimestamp = proposalCreatedAt.add(votingDelayInMinutes, "minutes")
            const votingExpiresAt = activeStartTimestamp.add(votingDurationInMinutes, "minutes")

            const votingEndTimestamp = activeStartTimestamp.add(votingDurationInMinutes, "minutes")

            // Flutter Refernce
            //   if (votePercentage < org.quorum) {
            //     newStatus = ProposalStatus.noQuorum;  // or "no quorum" in getStatus()
            //     statusHistory.clear();
            //     statusHistory.addAll({"pending": start});
            //     statusHistory.addAll({"active": activeStart});
            //     statusHistory.addAll({"no quorum": votingEnd});
            //     status = "no quorum";
            //     return newStatus;
            // }
            const statusHistoryMap = Object.entries(firebaseProposal.statusHistory)
              .map(([status, timestamp]: [string, any]) => ({
                status,
                timestamp: timestamp?.seconds as unknown as number,
                timestamp_human: dayjs.unix(timestamp?.seconds as unknown as number).format("MMM DD, YYYY hh:mm A")
              }))
              .sort((a, b) => b.timestamp - a.timestamp)

            statusHistoryMap.push({
              status: "active",
              timestamp: activeStartTimestamp.unix(),
              timestamp_human: activeStartTimestamp.format("MMM DD, YYYY hh:mm A")
            })

            if (votesInFavorWeight.div(daoTotalVotingWeight).times(100).gt(daoMinimumQuorum)) {
              statusHistoryMap.push({
                status: "passed",
                timestamp: votingEndTimestamp.unix(),
                timestamp_human: votingEndTimestamp.format("MMM DD, YYYY hh:mm A")
              })
            }

            const statusQueued = statusHistoryMap.find(x => x.status === "queued")
            if (statusQueued) {
              const executionDelayInSeconds = daoSelected?.executionDelay || 0
              const proposalExecutableAt = statusQueued.timestamp + executionDelayInSeconds
              console.log("proposalExecutableAt", proposalExecutableAt, timeNow.unix())
              if (proposalExecutableAt < timeNow.unix()) {
                statusHistoryMap.push({
                  status: "executable",
                  timestamp: proposalExecutableAt,
                  timestamp_human: dayjs.unix(proposalExecutableAt).format("MMM DD, YYYY hh:mm A")
                })
              }
            }

            if (votesPercentage.lt(daoSelected?.quorum) && votingEndTimestamp.isBefore(timeNow)) {
              statusHistoryMap.push({
                status: "no quorum",
                timestamp: votingEndTimestamp.unix(),
                timestamp_human: votingEndTimestamp.format("MMM DD, YYYY hh:mm A")
              })
            }
            console.log({ statusHistoryMap })

            const callDatas = firebaseProposal?.callDatas
            const callDataPlain = callDatas?.map((x: any) => getCallDataFromBytes(x))
            const proposalStatus = getStatusByHistory(statusHistoryMap, {
              votesPercentage,
              votingExpiresAt,
              activeStartTimestamp,
              daoQuorum: daoSelected?.quorum,
              executionDelayInSeconds: daoSelected?.executionDelay
            })

            // Setting up timerLabel
            let isVotingActive = false
            let timerLabel = "Voting concluded"
            if (activeStartTimestamp?.isAfter(timeNow)) {
              timerLabel = "Voting starts in"
            } else if (votingExpiresAt?.isAfter(timeNow) && activeStartTimestamp?.isBefore(timeNow)) {
              timerLabel = "Time left to vote"
              isVotingActive = true
            } else if (proposalStatus === ProposalStatus.PASSED) {
              timerLabel = "Execution available in"
            }

            return {
              ...firebaseProposal,
              createdAt: dayjs.unix(firebaseProposal.createdAt?.seconds as unknown as number),
              callDataPlain,
              status: proposalStatus,
              proposalData: [],
              statusHistoryMap: statusHistoryMap.sort((a, b) => b.timestamp - a.timestamp),
              votingStartTimestamp: activeStartTimestamp,
              votingExpiresAt: votingExpiresAt,
              totalVotes: totalVotes,
              totalVoteCount,
              timerLabel,
              isVotingActive,
              votesWeightPercentage: Number(votesPercentage.toFixed(2)),
              txHash: firebaseProposal?.executionHash
                ? `https://testnet.explorer.etherlink.com/tx/0x${parseTransactionHash(firebaseProposal?.executionHash)}`
                : ""
            }
          })
      )
    }

    if (firestoreData?.[daoMembersKey]) {
      setDaoMembers(firestoreData[daoMembersKey])
    }

    if (firestoreData?.[daoProposalVotesKey]) {
      setDaoProposalVoters(firestoreData[daoProposalVotesKey])
    }
  }, [daoProposalSelected?.id, daoSelected, daoSelected?.votingDuration, firebaseRootCollection, firestoreData])

  useEffect(() => {
    if (daoSelected?.id && firebaseRootCollection) {
      fetchCollection(`${firebaseRootCollection}/${daoSelected.id}/proposals`)
      fetchCollection(`${firebaseRootCollection}/${daoSelected.id}/members`)
      console.log({ daoSelected })
      // TODO: Replace this with proper service
      fetch(`https://testnet.explorer.etherlink.com/api/v2/addresses/${daoSelected.registryAddress}`)
        .then(res => res.json())
        .then(data => {
          const tokenDecimals = daoSelected.decimals
          const coinBalance = data?.coin_balance
          const ethBalance = ethers.formatEther(coinBalance)
          setDaoRegistryDetails({
            balance: ethBalance
          })
          console.log("Treasury Data", ethBalance)
        })

      if (daoProposalSelected?.id) {
        fetchCollection(`${firebaseRootCollection}/${daoSelected?.id}/proposals/${daoProposalSelected?.id}/votes`)
      }
    }
  }, [daoProposalSelected?.id, daoSelected, fetchCollection, firebaseRootCollection])

  // useEffect(() => {
  //   if (!daoProposalSelected?.id) return
  //   fetchCollection(`${firebaseRootCollection}/${daoSelected?.id}/proposals/${daoProposalSelected?.id}/voters`)
  // }, [daoProposalSelected, daoSelected, fetchCollection, firebaseRootCollection])

  return {
    contractData,
    daos: daoData,
    daoSelected,
    daoRegistryDetails,
    daoProposals,
    daoProposalSelected,
    daoMembers,
    daoProposalVoters,
    selectDaoProposal: (proposalId: string) => {
      const proposal = daoProposals.find((proposal: any) => proposal.id === proposalId)
      if (proposal) {
        const proposalInterface = proposalInterfaces.find((x: any) => {
          let fbType = proposal?.type?.toLowerCase()
          if (fbType?.startsWith("mint")) fbType = "mint"
          if (fbType?.startsWith("burn")) fbType = "burn"
          return x.tags?.includes(fbType)
        })
        const functionAbi = proposalInterface?.interface?.[0] as string
        if (!functionAbi) return []

        const proposalData = proposalInterface
          ? proposal?.callDataPlain?.map((callData: any) => {
              const formattedCallData = callData.startsWith("0x") ? callData : `0x${callData}`
              const decodedDataPair = decodeCalldataWithEthers(functionAbi, formattedCallData)
              const decodedDataPairLegacy = decodeFunctionParametersLegacy(functionAbi, formattedCallData)
              const functionName = decodedDataPair?.functionName
              const functionParams = decodedDataPair?.decodedData
              const proposalInterface = proposalInterfaces.find((x: any) => x.name === functionName)

              const label = proposalInterface?.label
              console.log("decodedDataPair", decodedDataPair, functionName, functionParams)
              console.log("decodedDataPairLegacy", decodedDataPairLegacy)
              return { parameter: label || functionName, value: functionParams.join(", ") }
            })
          : []
        proposal.proposalData = proposalData
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

// TODO: @ashutoshpw, handle more statuus and move to utils
const getStatusByHistory = (
  history: { status: string; timestamp: number; timestamp_human: string }[],
  {
    votesPercentage,
    votingExpiresAt,
    activeStartTimestamp,
    daoQuorum,
    executionDelayInSeconds
  }: {
    votesPercentage: BigNumber
    votingExpiresAt: dayjs.Dayjs
    activeStartTimestamp: dayjs.Dayjs
    daoQuorum: number
    executionDelayInSeconds: number
  }
) => {
  const timeNow = dayjs()

  const status = history
    .filter(x => dayjs(x.timestamp).isBefore(timeNow))
    .reduce((maxStatus, currentStatus) => {
      console.log("statuses", maxStatus, currentStatus)

      if (currentStatus.timestamp > maxStatus.timestamp) {
        return currentStatus
      }
      return maxStatus
    })

  console.log("getStatusByHistory", { status, history })
  if (activeStartTimestamp.isAfter(timeNow) && votingExpiresAt.isBefore(timeNow)) {
    return ProposalStatus.ACTIVE
  }
  // TODO: @ashutoshpw, handle more statuses
  switch (status.status) {
    case "queued":
      return ProposalStatus.PASSED
    case "passed":
      return ProposalStatus.PASSED
    case "active":
      return ProposalStatus.ACTIVE
    case "pending":
      if (votesPercentage.lt(daoQuorum) && votingExpiresAt.isBefore(timeNow)) {
        return ProposalStatus.NO_QUORUM
      }
      return ProposalStatus.PENDING
    case "rejected":
      return ProposalStatus.REJECTED
    case "accepted":
      return ProposalStatus.ACTIVE
    case "executable":
      return ProposalStatus.EXECUTABLE
    case "executed":
      return ProposalStatus.EXECUTED
    default:
      return ProposalStatus.NO_QUORUM
  }
}

export const EtherlinkContext = createContext<any | undefined>(undefined)

export const EtherlinkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<string | undefined>(localStorage.getItem("homebase:network") || undefined)
  const { setOpen } = useModal()
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  const { chains, switchChain } = useSwitchChain()
  // const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn, error } = useSIWE({
  //   onSignIn: (session?: SIWESession) => {
  //     console.log("User Signed In", session)
  //   },
  //   onSignOut: () => {
  //     console.log("User Signed Out")
  //     // Do something when signed out
  //   }
  // })

  const { connect } = useWagmiConnect()
  const { address, isConnected, chain, isDisconnected, status } = useWagmiAccount()

  console.log("SIWE Data", status)
  // console.log("SIWE Data", data, status, error, isSignedIn, isReady, isRejected, isLoading)
  const etherlinkNetwork = useMemo(() => {
    if (chain?.name === "Etherlink") {
      return "etherlink_mainnet"
    }
    if (chain?.name === "Etherlink Testnet") {
      return "etherlink_testnet"
    }
    return network
  }, [chain?.name, network])

  const {
    contractData,
    daos,
    isLoadingDaos,
    daoSelected,
    daoRegistryDetails,
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

  console.log("Etherlink Network", etherlinkNetwork)
  console.log("Wagmi Chain", chain, status)
  console.log("Wagmi Address", address)

  return (
    <EtherlinkContext.Provider
      value={{
        isConnected,
        provider,
        signer,
        account: {
          address: address || ""
        },
        network: etherlinkNetwork,
        connect: () => {
          setOpen(true)
          // connect({ config: wagmiConfig })
        },
        contractData,
        daos,
        isLoadingDaos,
        isLoadingDaoProposals,
        daoSelected,
        daoRegistryDetails,
        daoProposals,
        daoProposalSelected,
        daoMembers,
        daoProposalVoters,
        selectDaoProposal,
        selectDao,
        disconnect: () => disconnectEtherlink(wagmiConfig),
        switchToNetwork: (network: string) => {
          const networkId = network === "etherlink_mainnet" ? etherlink.id : etherlinkTestnet.id
          setNetwork(network)
          switchChain({ chainId: networkId })
        }
      }}
    >
      {children}
    </EtherlinkContext.Provider>
  )
}
