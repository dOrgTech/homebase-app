import React, { useState, createContext, ReactNode, useMemo, useRef, useEffect } from "react"
import { useSwitchChain, useAccount as useWagmiAccount, useConnect as useWagmiConnect } from "wagmi"
import { disconnect as disconnectEtherlink } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { useSIWE, useModal, SIWESession } from "connectkit"
import { useEthersProvider, useEthersSigner } from "./ethers"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"
import { useParams } from "react-router-dom"
import { Proposal, ProposalStatus } from "services/services/dao/mappers/proposal/types"

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
  console.log("Etherlink Network", etherlinkNetwork)

  // useEffect(() => {
  //   console.log(tezosNetwork)
  //   modal.switchNetwork(etherlinkTestnet as unknown as CaipNetwork)
  // }, [tezosNetwork])

  console.log("Wagmi Chain", chain, status)
  console.log("Wagmi Address", address)

  const [isLoadingDaos, setIsLoadingDaos] = useState(true)
  const [isLoadingDaoProposals, setIsLoadingDaoProposals] = useState(true)

  const selectedDaoIdRef = useRef<string | null>(null)
  const [daoData, setDaoData] = useState<any[]>([])
  const [daoSelected, setDaoSelected] = useState<any>({})
  const [daoProposals, setDaoProposals] = useState<any[]>([])
  const [daoProposalSelectedId, setDaoProposalSelectedId] = useState<string | null>(null)
  const [daoProposalSelected, setDaoProposalSelected] = useState<any>({})
  const [daoMembers, setDaoMembers] = useState<any[]>([])
  const { data: firestoreData, loading, fetchCollection } = useFirestoreStore()

  useEffect(() => {
    fetchCollection("daosEtherlink-Testnet").then((data: any) => {
      setIsLoadingDaos(false)
    })
  }, [fetchCollection])

  useEffect(() => {
    console.log("wagmi/context.tsx", { firestoreData })
    if (firestoreData?.["daosEtherlink-Testnet"]) {
      setDaoData(firestoreData["daosEtherlink-Testnet"])
    }
    const daoProposalKey = `daosEtherlink-Testnet/${daoSelected.id}/proposals`
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
    const daoMembersKey = `daosEtherlink-Testnet/${daoSelected.id}/members`
    if (firestoreData?.[daoMembersKey]) {
      setDaoMembers(firestoreData[daoMembersKey])
    }
  }, [daoSelected.id, firestoreData])

  useEffect(() => {
    console.log("daoSelected", daoSelected)
    if (daoSelected.id) {
      fetchCollection(`daosEtherlink-Testnet/${daoSelected.id}/proposals`)
      fetchCollection(`daosEtherlink-Testnet/${daoSelected.id}/members`)
    }
  }, [daoSelected, fetchCollection])

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
        daos: daoData,
        isLoadingDaos,
        isLoadingDaoProposals: false,
        daoSelected: daoSelected,
        daoProposals: daoProposals,
        daoProposalSelected: daoProposalSelected,
        daoMembers: daoMembers,
        selectDaoProposal: (proposalId: string) => {
          const proposal = daoProposals.find((proposal: any) => proposal.id === proposalId)
          if (proposal) {
            setDaoProposalSelected(proposal)
            // fetchCollection(`daosEtherlink-Testnet/${daoSelected.id}/proposals/${proposalId}`)
          }
        },
        selectDao: (daoId: string) => {
          const dao = daoData.find(dao => dao.id === daoId)
          // alert(`dao:${daoId}`)
          if (dao) {
            setDaoSelected(dao)
            selectedDaoIdRef.current = daoId
          }
        },
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
