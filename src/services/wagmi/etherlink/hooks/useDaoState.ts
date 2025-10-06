import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"
import dayjs from "dayjs"
import BigNumber from "bignumber.js"
import { Timestamp } from "firebase/firestore"
import { networkConfig } from "modules/etherlink/utils"
import { getCallDataFromBytes, getBlockExplorerUrl } from "modules/etherlink/utils"
import { fetchOffchainProposals } from "services/services/lite/lite-services"
import { IEvmDAO, IEvmFirebaseContract, IEvmFirebaseDAOMember, IEvmFirebaseProposal } from "modules/etherlink/types"
import { toDisplayStatus, isReadyToQueue } from "modules/etherlink/status"
import { useProposalData } from "../hooks/useProposalData"

export const useDaoState = ({ network }: { network: string }) => {
  const selectedDaoIdRef = useRef<string | null>(null)
  const selectedProposalIdRef = useRef<string | null>(null)
  const prevDaoIdRef = useRef<string | null>(null)

  const firebaseRootCollection = useMemo(() => {
    return networkConfig[network as keyof typeof networkConfig]?.firebaseRootCollection
  }, [network])

  const firebaseRootTokenCollection = useMemo(() => {
    return networkConfig[network as keyof typeof networkConfig]?.firebaseRootTokenCollection
  }, [network])

  const [isLoadingDaos, setIsLoadingDaos] = useState(!!firebaseRootCollection)
  const [isLoadingDaoProposals, setIsLoadingDaoProposals] = useState(true)
  const [contractData, setContractData] = useState<any[]>([])
  const [daoData, setDaoData] = useState<IEvmDAO[]>([])
  const [daoSelected, setDaoSelected] = useState<IEvmDAO | null>(null)
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
  const [daoMembers, setDaoMembers] = useState<IEvmFirebaseDAOMember[]>([])
  const [daoOffchainProposals, setDaoOffchainProposals] = useState<any[]>([])

  const { data: firestoreData, fetchCollection, fetchDoc } = useFirestoreStore()
  const fsClearRef = useRef<null | ((key: string) => void)>(null)
  fsClearRef.current = (useFirestoreStore.getState() as any).clearCollection
  const [refreshCount, setRefreshCount] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const recomputeDataAfter = useCallback((seconds: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setRefreshCount(c => c + 1)
    }, Math.max(0, seconds) * 1000)
  }, [])

  // Initial fetch triggers
  useEffect(() => {
    fetchCollection("contracts")
    if (firebaseRootCollection) fetchCollection(firebaseRootCollection)
    if (firebaseRootTokenCollection) fetchCollection(firebaseRootTokenCollection)
  }, [fetchCollection, firebaseRootCollection, firebaseRootTokenCollection])

  // Map Firestore data to DAOs and contracts
  useEffect(() => {
    if (!firebaseRootCollection) return
    if (firestoreData?.[firebaseRootCollection]) {
      const allDaoList = firestoreData[firebaseRootCollection]
      setDaoData(allDaoList)
      setIsLoadingDaos(false)
    }
    if (firestoreData?.["contracts"]) {
      const isTestnet = firebaseRootCollection?.toLowerCase().includes("testnet")
      const contractDataForNetwork = firestoreData["contracts"]?.find((contract: IEvmFirebaseContract) => {
        return isTestnet
          ? contract.id?.toLowerCase().includes("testnet")
          : !contract.id?.toLowerCase().includes("testnet")
      })
      setContractData(contractDataForNetwork)
    }
  }, [firestoreData, firebaseRootCollection])

  // When a DAO is selected, subscribe to its subcollections and compute proposal summaries
  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    const daoProposalKey = `${firebaseRootCollection}/${daoSelected.id}/proposals`
    const daoMembersKey = `${firebaseRootCollection}/${daoSelected?.id}/members`
    fetchCollection(daoProposalKey)
    fetchCollection(daoMembersKey)
    setIsLoadingDaoProposals(true)
  }, [daoSelected?.id, fetchCollection, firebaseRootCollection])

  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    const daoProposalKey = `${firebaseRootCollection}/${daoSelected.id}/proposals`
    const timeNow = dayjs()
    const proposalsFs = firestoreData?.[daoProposalKey] as IEvmFirebaseProposal[] | undefined
    if (!proposalsFs) return

    const mapped = proposalsFs
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .map(p => {
        const proposalCreatedAt = dayjs.unix(p.createdAt?.seconds as unknown as number)
        const votesInFavor = new BigNumber(p?.inFavor)
        const votesAgainst = new BigNumber(p?.against)
        const totalVotes = votesInFavor.plus(votesAgainst)
        const totalVoteCount = Number(p?.votesFor) + Number(p?.votesAgainst)
        const totalSupply = new BigNumber(daoSelected?.totalSupply ?? "1")
        const votesPercentage = totalVotes.div(totalSupply).times(100)
        const daoMinimumQuorum = new BigNumber(daoSelected?.quorum ?? "0")
        const daoTotalVotingWeight = new BigNumber(daoSelected?.totalSupply ?? "0")

        const votingDelayInMinutes = daoSelected?.votingDelay || 1
        const votingDurationInMinutes = daoSelected?.votingDuration || 1
        const activeStartTimestamp = proposalCreatedAt.add(votingDelayInMinutes, "minutes")
        const votingExpiresAt = activeStartTimestamp.add(votingDurationInMinutes, "minutes")

        const statusHistoryMap = Object.entries(p.statusHistory)
          .map(([status, timestamp]: [string, any]) => ({
            status,
            timestamp: timestamp?.seconds as unknown as number,
            timestamp_human: dayjs.unix(timestamp?.seconds as unknown as number).format("MMM DD, YYYY hh:mm A")
          }))
          .sort((a, b) => b.timestamp - a.timestamp)

        const queuedStatus = statusHistoryMap.find(x => x.status === "queued")
        let executionAvailableAt: any
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
        }

        // After voting ends, derive final outcome using quorum of total votes, then majority
        if (votingExpiresAt.isBefore(timeNow)) {
          const votesInFavorWeight = new BigNumber(p?.inFavor)
          const votesAgainstWeight = new BigNumber(p?.against)
          const totalCast = votesInFavorWeight.plus(votesAgainstWeight)
          const meetsQuorum = totalCast.div(daoTotalVotingWeight).times(100).gte(daoMinimumQuorum)

          if (!meetsQuorum) {
            statusHistoryMap.push({
              status: "no quorum",
              timestamp: votingExpiresAt.unix(),
              timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
            })
          } else {
            const isPassed = votesInFavorWeight.gt(votesAgainstWeight)
            statusHistoryMap.push({
              status: isPassed ? "passed" : "failed",
              timestamp: votingExpiresAt.unix(),
              timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
            })

            // If passed but not yet queued on-chain, mark as ready-to-queue for UI affordance
            const statusContainsPassed = statusHistoryMap.findIndex(x => x.status === "passed")
            if (statusContainsPassed !== -1) {
              statusHistoryMap.splice(statusContainsPassed + 1, 0, {
                status: "queue_to_execute",
                timestamp: votingExpiresAt.unix() + 1,
                timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
              })
            }
          }
        }

        const statusContainsQueued = statusHistoryMap.findIndex(x => x.status === "queued")
        if (votingExpiresAt.isBefore(timeNow)) {
          if (statusContainsQueued === -1) {
            // If voting ended, was not queued, and failed was determined, surface final 'defeated'
            if (statusHistoryMap.find(x => x.status === "failed")) {
              statusHistoryMap.push({
                status: "defeated",
                timestamp: votingExpiresAt.unix(),
                timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
              })
            }
          } else if (statusContainsQueued !== -1) {
            // If queued and it passed, mark executable when delay elapsed
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

        const callDatas = p?.callDatas
        const callDataPlain = callDatas?.map((x: any) => getCallDataFromBytes(x))
        const sortedStatusHistoryMap = statusHistoryMap.sort((a, b) => b.timestamp - a.timestamp)
        const proposalStatus = sortedStatusHistoryMap[0]?.status
        const displayStatus = toDisplayStatus(proposalStatus)
        const readyToQueue = isReadyToQueue(proposalStatus)

        let isTimerActive = false
        let timerLabel = "Voting concluded"
        let timerTargetDate: any = null
        if (proposalStatus === "pending") {
          isTimerActive = true
          timerLabel = "Voting starts in"
          timerTargetDate = activeStartTimestamp
          recomputeDataAfter(activeStartTimestamp.diff(timeNow, "seconds"))
        }
        if (votingExpiresAt?.isAfter(timeNow) && activeStartTimestamp?.isBefore(timeNow)) {
          isTimerActive = true
          timerLabel = "Time left to vote"
          timerTargetDate = votingExpiresAt
          recomputeDataAfter(votingExpiresAt.diff(timeNow, "seconds"))
        }
        if (proposalStatus === "queued" && executionAvailableAt) {
          isTimerActive = true
          timerLabel = "Execution available in"
          timerTargetDate = executionAvailableAt
          recomputeDataAfter(executionAvailableAt.diff(timeNow, "seconds"))
        }

        return {
          ...p,
          createdAt: dayjs.unix(p.createdAt?.seconds as unknown as number),
          callDataPlain,
          isTimerActive,
          timerLabel,
          timerTargetDate,
          statusHistoryMap: sortedStatusHistoryMap,
          status: proposalStatus,
          displayStatus,
          readyToQueue,
          totalVotes: totalVotes,
          totalVoteCount,
          txHash: getBlockExplorerUrl(network, p?.executionHash),
          votingStartTimestamp: activeStartTimestamp,
          votingExpiresAt,
          votesWeightPercentage: Number(votesPercentage.toFixed(2))
        }
      })

    setDaoProposals(mapped)
    setIsLoadingDaoProposals(false)
  }, [
    daoSelected?.id,
    firestoreData,
    firebaseRootCollection,
    network,
    recomputeDataAfter,
    refreshCount,
    daoSelected?.executionDelay,
    daoSelected?.quorum,
    daoSelected?.totalSupply,
    daoSelected?.votingDelay,
    daoSelected?.votingDuration
  ])

  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    const pid = (daoProposalSelected as any)?.id || selectedProposalIdRef.current
    if (!pid) return
    const proposalsCollection = `${firebaseRootCollection}/${daoSelected.id}/proposals`
    fetchDoc(proposalsCollection, pid)
  }, [daoSelected?.id, firebaseRootCollection, daoProposalSelected?.id, fetchDoc])

  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    const pid = selectedProposalIdRef.current
    if (!pid) return
    const timeNow = dayjs()
    const docKey = `${firebaseRootCollection}/${daoSelected.id}/proposals/${pid}`
    const docArr = firestoreData?.[docKey] as IEvmFirebaseProposal[] | undefined
    if (!docArr || docArr.length === 0) return
    const p = docArr[0]

    // Reuse the mapping logic inline to avoid waiting for the full collection snapshot
    const proposalCreatedAt = dayjs.unix(p.createdAt?.seconds as unknown as number)
    const votesInFavor = new BigNumber(p?.inFavor)
    const votesAgainst = new BigNumber(p?.against)
    const totalVotes = votesInFavor.plus(votesAgainst)
    const totalVoteCount = Number(p?.votesFor) + Number(p?.votesAgainst)
    const totalSupply = new BigNumber(daoSelected?.totalSupply ?? "1")
    const votesPercentage = totalVotes.div(totalSupply).times(100)
    const daoMinimumQuorum = new BigNumber(daoSelected?.quorum ?? "0")
    const daoTotalVotingWeight = new BigNumber(daoSelected?.totalSupply ?? "0")

    const votingDelayInMinutes = daoSelected?.votingDelay || 1
    const votingDurationInMinutes = daoSelected?.votingDuration || 1
    const activeStartTimestamp = proposalCreatedAt.add(votingDelayInMinutes, "minutes")
    const votingExpiresAt = activeStartTimestamp.add(votingDurationInMinutes, "minutes")

    const statusHistoryMap = Object.entries(p.statusHistory)
      .map(([status, timestamp]: [string, any]) => ({
        status,
        timestamp: timestamp?.seconds as unknown as number,
        timestamp_human: dayjs.unix(timestamp?.seconds as unknown as number).format("MMM DD, YYYY hh:mm A")
      }))
      .sort((a, b) => b.timestamp - a.timestamp)

    const queuedStatus = statusHistoryMap.find(x => x.status === "queued")
    let executionAvailableAt: any
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
    }

    // After voting ends, derive final outcome using quorum of total votes, then majority
    if (votingExpiresAt.isBefore(timeNow)) {
      const votesInFavorWeight = new BigNumber(p?.inFavor)
      const votesAgainstWeight = new BigNumber(p?.against)
      const totalCast = votesInFavorWeight.plus(votesAgainstWeight)
      const meetsQuorum = totalCast.div(daoTotalVotingWeight).times(100).gte(daoMinimumQuorum)

      if (!meetsQuorum) {
        statusHistoryMap.push({
          status: "no quorum",
          timestamp: votingExpiresAt.unix(),
          timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
        })
      } else {
        const isPassed = votesInFavorWeight.gt(votesAgainstWeight)
        statusHistoryMap.push({
          status: isPassed ? "passed" : "failed",
          timestamp: votingExpiresAt.unix(),
          timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
        })

        // If passed but not yet queued on-chain, mark as ready-to-queue for UI affordance
        const statusContainsPassed = statusHistoryMap.findIndex(x => x.status === "passed")
        if (statusContainsPassed !== -1) {
          statusHistoryMap.splice(statusContainsPassed + 1, 0, {
            status: "queue_to_execute",
            timestamp: votingExpiresAt.unix() + 1,
            timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
          })
        }
      }
    }

    const statusContainsQueued = statusHistoryMap.findIndex(x => x.status === "queued")
    if (votingExpiresAt.isBefore(timeNow)) {
      if (statusContainsQueued === -1) {
        // If voting ended, was not queued, and failed was determined, surface final 'defeated'
        if (statusHistoryMap.find(x => x.status === "failed")) {
          statusHistoryMap.push({
            status: "defeated",
            timestamp: votingExpiresAt.unix(),
            timestamp_human: votingExpiresAt.format("MMM DD, YYYY hh:mm A")
          })
        }
      } else if (statusContainsQueued !== -1) {
        // If queued and it passed, mark executable when delay elapsed
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

    const callDatas = p?.callDatas
    const callDataPlain = callDatas?.map((x: any) => getCallDataFromBytes(x))
    const sortedStatusHistoryMap = statusHistoryMap.sort((a, b) => b.timestamp - a.timestamp)
    const proposalStatus = sortedStatusHistoryMap[0]?.status
    const displayStatus = toDisplayStatus(proposalStatus)
    const readyToQueue = isReadyToQueue(proposalStatus)

    let isTimerActive = false
    let timerLabel = "Voting concluded"
    let timerTargetDate: any = null
    if (proposalStatus === "pending") {
      isTimerActive = true
      timerLabel = "Voting starts in"
      timerTargetDate = activeStartTimestamp
      recomputeDataAfter(activeStartTimestamp.diff(timeNow, "seconds"))
    }
    if (votingExpiresAt?.isAfter(timeNow) && activeStartTimestamp?.isBefore(timeNow)) {
      isTimerActive = true
      timerLabel = "Time left to vote"
      timerTargetDate = votingExpiresAt
      recomputeDataAfter(votingExpiresAt.diff(timeNow, "seconds"))
    }
    if (proposalStatus === "queued" && executionAvailableAt) {
      isTimerActive = true
      timerLabel = "Execution available in"
      timerTargetDate = executionAvailableAt
      recomputeDataAfter(executionAvailableAt.diff(timeNow, "seconds"))
    }

    const mapped = {
      ...p,
      createdAt: dayjs.unix(p.createdAt?.seconds as unknown as number),
      callDataPlain,
      isTimerActive,
      timerLabel,
      timerTargetDate,
      statusHistoryMap: sortedStatusHistoryMap,
      status: proposalStatus,
      displayStatus,
      readyToQueue,
      totalVotes: totalVotes,
      totalVoteCount,
      txHash: getBlockExplorerUrl(network, p?.executionHash),
      votingStartTimestamp: activeStartTimestamp,
      votingExpiresAt,
      votesWeightPercentage: Number(votesPercentage.toFixed(2))
    }

    setDaoProposalSelected(mapped)
  }, [
    firestoreData,
    daoSelected?.id,
    firebaseRootCollection,
    network,
    recomputeDataAfter,
    refreshCount,
    daoProposalSelected?.id,
    daoSelected?.executionDelay,
    daoSelected?.quorum,
    daoSelected?.totalSupply,
    daoSelected?.votingDelay,
    daoSelected?.votingDuration
  ])

  // Members and voters subscriptions
  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    const daoMembersKey = `${firebaseRootCollection}/${daoSelected?.id}/members`
    if (firestoreData?.[daoMembersKey]) {
      setDaoMembers(firestoreData[daoMembersKey])
    }
  }, [daoSelected?.id, firestoreData, firebaseRootCollection])

  const proposalData = useProposalData(network)

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
    isVotingActive: true,
    latestStage: "pending",
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
    votesFor: 1,
    votesWeightPercentage: 0,
    votingExpiresAt: dayjs.unix(x.endTime),
    votingStartTimestamp: dayjs.unix(x.startTime)
  }))

  const allDaoProposals = useMemo(() => {
    return [...daoProposals, ...daoOffchainPollList].sort((a, b) => a.createdAt.unix() - b.createdAt.unix()).reverse()
  }, [daoProposals, daoOffchainPollList])

  const selectDaoProposal = useCallback(
    (proposalId: string) => {
      selectedProposalIdRef.current = proposalId
      const all = allDaoProposals
      const proposal = all.find((p: any) => p.id === proposalId)
      if (!proposal) return
      if (proposal?.type !== "offchain") {
        proposal.proposalData = proposalData.buildProposalData(proposal)
        setDaoProposalSelected(proposal)
        if (firebaseRootCollection && daoSelected?.id) {
          const proposalsCollection = `${firebaseRootCollection}/${daoSelected.id}/proposals`
          const prevKey = `${proposalsCollection}/${(daoProposalSelected as any)?.id || ""}`
          const nextKey = `${proposalsCollection}/${proposalId}`
          if (fsClearRef.current && prevKey && prevKey !== nextKey) {
            try {
              fsClearRef.current(prevKey)
            } catch (_) {}
          }
          try {
            fetchDoc(proposalsCollection, proposalId)
          } catch (_) {}
        }
        if (proposalData.isRawFallback(proposal.proposalData)) {
          proposalData.buildProposalDataAsync(proposal).then(upgraded => {
            if (Array.isArray(upgraded) && upgraded.length > 0 && !proposalData.isRawFallback(upgraded)) {
              setDaoProposalSelected({ ...proposal, proposalData: upgraded })
            }
          })
        }
      } else {
        setDaoProposalSelected(proposal)
      }
    },
    [proposalData, allDaoProposals, firebaseRootCollection, daoSelected?.id, fetchDoc, daoProposalSelected]
  )

  useEffect(() => {
    if (!firebaseRootCollection) return
    const newDaoId = daoSelected?.id || null
    const oldDaoId = prevDaoIdRef.current
    if (newDaoId !== oldDaoId) {
      const prevPid = selectedProposalIdRef.current
      if (oldDaoId && prevPid && fsClearRef.current) {
        const oldKey = `${firebaseRootCollection}/${oldDaoId}/proposals/${prevPid}`
        try {
          fsClearRef.current(oldKey)
        } catch (_) {}
      }
      prevDaoIdRef.current = newDaoId
    }
  }, [daoSelected?.id, firebaseRootCollection])

  // Fetch voters for selected on-chain proposal
  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    if (!daoProposalSelected?.id || daoProposalSelected?.type === "offchain") return
    const votesKey = `${firebaseRootCollection}/${daoSelected?.id}/proposals/${daoProposalSelected?.id}/votes`
    fetchCollection(votesKey)
  }, [daoProposalSelected?.id, daoProposalSelected?.type, daoSelected?.id, firebaseRootCollection, fetchCollection])

  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    if (!daoProposalSelected?.id || daoProposalSelected?.type === "offchain") return
    const votesKey = `${firebaseRootCollection}/${daoSelected?.id}/proposals/${daoProposalSelected?.id}/votes`
    if (firestoreData?.[votesKey]) {
      setDaoProposalVoters(firestoreData[votesKey])
    }
  }, [daoSelected?.id, daoProposalSelected?.id, daoProposalSelected?.type, firebaseRootCollection, firestoreData])

  // Offchain proposals for current dao
  useEffect(() => {
    if (!daoSelected?.id) return
    fetchOffchainProposals(daoSelected?.id).then(offchainProposals => {
      setDaoOffchainProposals(offchainProposals)
    })
  }, [daoSelected?.id])

  const selectDao = useCallback(
    (daoId: string) => {
      const dao = daoData.find(dao => (dao?.id || "").toLowerCase() === (daoId || "").toLowerCase())
      if (dao) {
        setDaoSelected(dao)
        selectedDaoIdRef.current = daoId
      }
    },
    [daoData]
  )

  return {
    contractData,
    daos: daoData,
    daoSelected,
    daoProposals: allDaoProposals,
    isLoadingDaos,
    isLoadingDaoProposals,
    daoProposalSelected,
    daoMembers,
    daoProposalVoters,
    selectDaoProposal,
    selectDao
  }
}
