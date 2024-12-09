import React, { useState, createContext, ReactNode, useMemo, useRef, useEffect } from "react"
import { useSwitchChain, useAccount as useWagmiAccount, useConnect as useWagmiConnect } from "wagmi"
import { disconnect as disconnectEtherlink } from "@wagmi/core"
import { config as wagmiConfig } from "services/wagmi/config"
import { etherlink, etherlinkTestnet } from "wagmi/chains"
import { useSIWE, useModal, SIWESession } from "connectkit"
import { useEthersProvider, useEthersSigner } from "./ethers"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"

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
      setDaoProposals(firestoreData[daoProposalKey]?.sort((a: any, b: any) => b.createdAt - a.createdAt))
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
