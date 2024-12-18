import React, { useState, createContext, ReactNode, useMemo, useRef, useEffect } from "react"
import { useSwitchChain, useAccount as useWagmiAccount, useConnect as useWagmiConnect } from "wagmi"
import { disconnect as disconnectEtherlink } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { useSIWE, useModal, SIWESession } from "connectkit"
import { useEthersProvider, useEthersSigner } from "./ethers"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"
import { useParams } from "react-router-dom"
import { ProposalStatus } from "services/services/dao/mappers/proposal/types"
import { useTezos } from "services/beacon/hooks/useTezos"
import dayjs from "dayjs"
import { ethers } from "ethers"

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
  const [daoSelected, setDaoSelected] = useState<any>({})
  const [daoRegistryDetails, setDaoRegistryDetails] = useState<{
    balance: string
  }>({ balance: "0" })

  const [daoProposals, setDaoProposals] = useState<any[]>([])
  const [daoProposalSelected, setDaoProposalSelected] = useState<any>({})

  const [daoMembers, setDaoMembers] = useState<any[]>([])
  const { data: firestoreData, loading, fetchCollection } = useFirestoreStore()

  console.log({ contractData })

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
      // firestoreData[firebaseRootCollection]?.forEach((dao: any) => {
      //   console.log("DAOTreasury", dao.id, Object.values(dao.treasury))
      // })

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
    const daoProposalKey = `${firebaseRootCollection}/${daoSelected.id}/proposals`
    if (firestoreData?.[daoProposalKey]) {
      setDaoProposals(
        firestoreData[daoProposalKey]
          ?.sort((a: any, b: any) => b.createdAt - a.createdAt)
          .map(firebaseProposal => {
            const proposalCreatedAt = dayjs.unix(firebaseProposal.createdAt?.seconds as unknown as number)
            const votingDelayInMinutes = daoSelected?.votingDuration || 1
            const votingExpiresAt = proposalCreatedAt.add(votingDelayInMinutes, "minutes")
            return {
              ...firebaseProposal,
              status: getStatusByHistory(firebaseProposal.statusHistory),
              statusHistoryMap: Object.entries(firebaseProposal.statusHistory)
                .map(([status, timestamp]: [string, any]) => ({
                  status,
                  timestamp: timestamp?.seconds as unknown as number,
                  timestamp_human: dayjs.unix(timestamp?.seconds as unknown as number).format("MMM DD, YYYY HH:mm:ss")
                }))
                .sort((a, b) => b.timestamp - a.timestamp),
              votingExpiresAt: votingExpiresAt
            }
          })
      )
    }
    const daoMembersKey = `${firebaseRootCollection}/${daoSelected.id}/members`
    if (firestoreData?.[daoMembersKey]) {
      setDaoMembers(firestoreData[daoMembersKey])
    }
  }, [daoSelected.id, daoSelected?.votingDuration, firebaseRootCollection, firestoreData])

  useEffect(() => {
    if (daoSelected.id && firebaseRootCollection) {
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
    }
  }, [daoSelected, fetchCollection, firebaseRootCollection])

  return {
    contractData,
    daos: daoData,
    daoSelected,
    daoRegistryDetails,
    daoProposals,
    daoProposalSelected,
    daoMembers,
    selectDaoProposal: (proposalId: string) => {
      const proposal = daoProposals.find((proposal: any) => proposal.id === proposalId)
      if (proposal) {
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
const getStatusByHistory = (history: { active: number; executable: number; passed: number; pending: number }) => {
  const statuses = Object.keys(history)
  const status = statuses.reduce((maxStatus, currentStatus) => {
    return history[currentStatus as keyof typeof history] > history[maxStatus as keyof typeof history]
      ? currentStatus
      : maxStatus
  })
  // TODO: @ashutoshpw, handle more statuses
  switch (status) {
    case "active":
      return ProposalStatus.ACTIVE
    case "pending":
      return ProposalStatus.PENDING
    case "rejected":
      return ProposalStatus.REJECTED
    case "accepted":
      return ProposalStatus.ACTIVE
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
