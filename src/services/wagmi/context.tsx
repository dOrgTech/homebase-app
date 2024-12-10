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

  const firebaseRootCollection = useMemo(() => {
    if (network === "etherlink_mainnet") {
      return "daosEtherlink-Mainnet"
    }
    if (network === "etherlink_testnet") {
      return "daosEtherlink-Testnet"
    }
    return undefined
  }, [network])

  const [isLoadingDaos, setIsLoadingDaos] = useState(true)
  const [isLoadingDaoProposals, setIsLoadingDaoProposals] = useState(true)

  const [daoData, setDaoData] = useState<any[]>([])
  const [daoSelected, setDaoSelected] = useState<any>({})
  const [daoProposals, setDaoProposals] = useState<any[]>([])
  const [daoProposalSelected, setDaoProposalSelected] = useState<any>({})
  const [daoMembers, setDaoMembers] = useState<any[]>([])
  const { data: firestoreData, loading, fetchCollection } = useFirestoreStore()

  useEffect(() => {
    if (firebaseRootCollection) {
      fetchCollection(firebaseRootCollection).then((data: any) => {
        setIsLoadingDaos(false)
      })
    }
  }, [fetchCollection, firebaseRootCollection])

  useEffect(() => {
    console.log("Firestore Data", firestoreData)
    if (!firebaseRootCollection) return
    if (firestoreData?.[firebaseRootCollection]) {
      setDaoData(firestoreData[firebaseRootCollection])
    }
    const daoProposalKey = `${firebaseRootCollection}/${daoSelected.id}/proposals`
    if (firestoreData?.[daoProposalKey]) {
      setDaoProposals(
        firestoreData[daoProposalKey]
          ?.sort((a: any, b: any) => b.createdAt - a.createdAt)
          .map(firebaseProposal => {
            return {
              ...firebaseProposal,
              status: getStatusByHistory(firebaseProposal.statusHistory)
            }
          })
      )
    }
    const daoMembersKey = `${firebaseRootCollection}/${daoSelected.id}/members`
    if (firestoreData?.[daoMembersKey]) {
      setDaoMembers(firestoreData[daoMembersKey])
    }
  }, [daoSelected.id, firebaseRootCollection, firestoreData])

  useEffect(() => {
    if (daoSelected.id && firebaseRootCollection) {
      fetchCollection(`${firebaseRootCollection}/${daoSelected.id}/proposals`)
      fetchCollection(`${firebaseRootCollection}/${daoSelected.id}/members`)
    }
  }, [daoSelected, fetchCollection, firebaseRootCollection])

  return {
    daos: daoData,
    daoSelected,
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
    return "unknown"
  }, [chain?.name])

  const {
    daos,
    isLoadingDaos,
    daoSelected,
    daoProposals,
    isLoadingDaoProposals,
    daoProposalSelected,
    daoMembers,
    selectDaoProposal,
    selectDao
  } = useEtherlinkDao({
    network: etherlinkNetwork
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
        daos,
        isLoadingDaos,
        isLoadingDaoProposals,
        daoSelected,
        daoProposals,
        daoProposalSelected,
        daoMembers,
        selectDaoProposal,
        selectDao,
        disconnect: () => disconnectEtherlink(wagmiConfig),
        switchToNetwork: (network: string) => {
          const networkId = network === "etherlink_mainnet" ? etherlink.id : etherlinkTestnet.id
          switchChain({ chainId: networkId })
        }
      }}
    >
      {children}
    </EtherlinkContext.Provider>
  )
}
