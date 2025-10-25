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

  // Track previous root collection to cleanup listeners and avoid stale data flashes
  const prevRootCollectionRef = useRef<string | null>(null)

  const recomputeDataAfter = useCallback((seconds: number) => {
    // Prevent zero/negative delays from missing the exact boundary transition.
    // Use a minimal delay when we're at or just past the boundary to force a quick recompute.
    const ms = Math.floor(seconds * 1000)
    const delay = Math.max(ms, 100)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setRefreshCount(c => c + 1)
    }, delay)
  }, [])

  // Clear any pending timers on unmount to avoid stray updates
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Initial fetch triggers
  useEffect(() => {
    fetchCollection("contracts")
    if (firebaseRootCollection) fetchCollection(firebaseRootCollection)
    if (firebaseRootTokenCollection) fetchCollection(firebaseRootTokenCollection)
  }, [fetchCollection, firebaseRootCollection, firebaseRootTokenCollection])

  // When the root collection changes (i.e., network change), clear previous data promptly
  useEffect(() => {
    const prevKey = prevRootCollectionRef.current
    if (prevKey && prevKey !== firebaseRootCollection && fsClearRef.current) {
      try {
        fsClearRef.current(prevKey)
      } catch (_) {}
    }

    // Reset local state so UI reflects the network switch immediately
    setDaoData([])
    setDaoSelected(null)
    setIsLoadingDaos(!!firebaseRootCollection)

    prevRootCollectionRef.current = firebaseRootCollection || null
  }, [firebaseRootCollection])

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
        // Prefer per-proposal totalSupply (snapshot from indexer) and guard zero to avoid Infinity
        const denomSupply = new BigNumber(((p as any)?.totalSupply ?? daoSelected?.totalSupply) || "0")
        const votesPercentage = denomSupply.gt(0) ? totalVotes.div(denomSupply).times(100) : new BigNumber(0)

        const daoMinimumQuorum = new BigNumber(daoSelected?.quorum ?? "0")
        const daoTotalVotingWeight = denomSupply

        const votingDelayInMinutes = daoSelected?.votingDelay ?? 1
        const votingDurationInMinutes = daoSelected?.votingDuration ?? 1
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
          const meetsQuorum = daoTotalVotingWeight.gt(0)
            ? totalCast.div(daoTotalVotingWeight).times(100).gte(daoMinimumQuorum)
            : false

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

        const callDatas = (p as any)?.callDatas
        let callDataPlain =
          Array.isArray(callDatas) && callDatas.length > 0 ? callDatas.map((x: any) => getCallDataFromBytes(x)) : []
        if ((!callDataPlain || callDataPlain.length === 0) && (p as any)?.calldata) {
          const raw = String((p as any).calldata)
          const formatted = raw.startsWith("0x") ? raw : `0x${raw}`
          callDataPlain = [formatted]
        }
        // Some indexers use `callData` (camelCase); support it as a final fallback
        if ((!callDataPlain || callDataPlain.length === 0) && (p as any)?.callData) {
          const raw2 = String((p as any).callData)
          const formatted2 = raw2.startsWith("0x") ? raw2 : `0x${raw2}`
          callDataPlain = [formatted2]
        }
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
    // Prefer per-proposal totalSupply (snapshot from indexer) and guard zero to avoid Infinity
    const denomSupply = new BigNumber(((p as any)?.totalSupply ?? daoSelected?.totalSupply) || "0")
    const votesPercentage = denomSupply.gt(0) ? totalVotes.div(denomSupply).times(100) : new BigNumber(0)

    const daoMinimumQuorum = new BigNumber(daoSelected?.quorum ?? "0")
    const daoTotalVotingWeight = denomSupply

    const votingDelayInMinutes = daoSelected?.votingDelay ?? 1
    const votingDurationInMinutes = daoSelected?.votingDuration ?? 1
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
      const meetsQuorum = daoTotalVotingWeight.gt(0)
        ? totalCast.div(daoTotalVotingWeight).times(100).gte(daoMinimumQuorum)
        : false

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

    const callDatas = (p as any)?.callDatas
    let callDataPlain =
      Array.isArray(callDatas) && callDatas.length > 0 ? callDatas.map((x: any) => getCallDataFromBytes(x)) : []
    if ((!callDataPlain || callDataPlain.length === 0) && (p as any)?.calldata) {
      const raw = String((p as any).calldata)
      const formatted = raw.startsWith("0x") ? raw : `0x${raw}`
      callDataPlain = [formatted]
    }
    // Some indexers use `callData` (camelCase); support it as a final fallback
    if ((!callDataPlain || callDataPlain.length === 0) && (p as any)?.callData) {
      const raw2 = String((p as any).callData)
      const formatted2 = raw2.startsWith("0x") ? raw2 : `0x${raw2}`
      callDataPlain = [formatted2]
    }
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

    // Preserve previously computed proposalData to avoid blanking details on refresh
    setDaoProposalSelected((prev: any) => {
      const same = prev && (prev as any).id === (p as any)?.id
      const carry = same && Array.isArray((prev as any)?.proposalData) ? (prev as any).proposalData : undefined
      return carry && carry.length > 0 ? { ...(mapped as any), proposalData: carry } : (mapped as any)
    })
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

  const daoOffchainPollList = daoOffchainProposals.map(x => {
    // Normalize ms-based times from the offchain API
    const start = dayjs(Number(x.startTime))
    const end = dayjs(Number(x.endTime))
    const now = dayjs()

    // Derive a simple status tied to the explicit start/end window
    const derivedStatus = now.isBefore(start) ? "pending" : now.isBefore(end) ? "active" : "expired"

    // Timer affordances for the UI
    let timerLabel = "Voting concluded"
    let timerTargetDate = end
    if (now.isBefore(start)) {
      timerLabel = "Voting starts in"
      timerTargetDate = start
    } else if (now.isBefore(end)) {
      timerLabel = "Time left to vote"
      timerTargetDate = end
    }

    return {
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
      isVotingActive: now.isAfter(start) && now.isBefore(end),
      latestStage: "pending",
      status: derivedStatus,
      statusHistoryMap: [],
      statusHistory: {},
      targets: [],
      title: x.name,
      totalVotes: new BigNumber(0),
      totalVoteCount: 0,
      timerLabel,
      timerTargetDate,
      transactions: [],
      txHash: "",
      type: "offchain",
      values: [],
      votesAgainst: 0,
      votesFor: 1,
      votesWeightPercentage: 0,
      votingExpiresAt: end,
      votingStartTimestamp: start
    }
  })

  const allDaoProposals = useMemo(() => {
    return [...daoProposals, ...daoOffchainPollList].sort((a, b) => a.createdAt.unix() - b.createdAt.unix()).reverse()
  }, [daoProposals, daoOffchainPollList])

  // Ensure proposalData is populated even when the selected proposal
  // originated from a direct doc subscription (i.e., not selected via list).
  useEffect(() => {
    if (!daoSelected?.id || !firebaseRootCollection) return
    const pid = daoProposalSelected?.id
    if (!pid) return
    if ((daoProposalSelected as any)?.type === "offchain") return

    const hasAnyData = Array.isArray((daoProposalSelected as any)?.proposalData)
      ? (daoProposalSelected as any).proposalData.length > 0
      : false

    // If no entries yet, compute a synchronous fallback immediately (even if raw)
    if (!hasAnyData) {
      try {
        const fallback = proposalData.buildProposalData(daoProposalSelected as any)
        if (Array.isArray(fallback) && fallback.length > 0) {
          setDaoProposalSelected((prev: any) => {
            if (!prev || prev.id !== pid) return prev as any
            const already = Array.isArray((prev as any)?.proposalData) && (prev as any).proposalData.length > 0
            if (already) return prev as any
            return { ...(prev as any), proposalData: fallback }
          })
        }
      } catch (_) {
        // ignore; async path below may still succeed
      }
    }

    // Attempt asynchronous decode via explorer ABI; upgrade if it yields non-fallback
    proposalData.buildProposalDataAsync(daoProposalSelected as any).then(upgraded => {
      if (Array.isArray(upgraded) && upgraded.length > 0 && !proposalData.isRawFallback(upgraded)) {
        setDaoProposalSelected((prev: any) => {
          if (!prev || prev.id !== pid) return prev as any
          try {
            const a = JSON.stringify((prev as any)?.proposalData || [])
            const b = JSON.stringify(upgraded)
            if (a === b) return prev as any
          } catch (_) {}
          return { ...(prev as any), proposalData: upgraded }
        })
      }
    })
  }, [
    daoSelected?.id,
    firebaseRootCollection,
    daoProposalSelected?.id,
    (daoProposalSelected as any)?.callDataPlain,
    (daoProposalSelected as any)?.type,
    proposalData
  ])

  const selectDaoProposal = useCallback(
    (proposalId: string) => {
      // Avoid redundant re-selection loops
      const prevSelected = selectedProposalIdRef.current
      if (prevSelected === proposalId) return
      selectedProposalIdRef.current = proposalId

      const all = allDaoProposals
      const proposal = all.find((p: any) => p.id === proposalId)
      if (!proposal) return
      if (proposal?.type !== "offchain") {
        proposal.proposalData = proposalData.buildProposalData(proposal)
        setDaoProposalSelected(proposal)
        if (firebaseRootCollection && daoSelected?.id) {
          const proposalsCollection = `${firebaseRootCollection}/${daoSelected.id}/proposals`
          const prevKey = `${proposalsCollection}/${prevSelected || ""}`
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
    [proposalData, allDaoProposals, firebaseRootCollection, daoSelected?.id, fetchDoc]
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
