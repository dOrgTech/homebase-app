import React, { createContext, useEffect, useState } from "react"
import { useTezos } from "services/beacon/hooks/useTezos"

interface ContextProps {
  isConnected: boolean
  setIsConnected: any
}

export const DashboardContext = createContext({} as ContextProps)

export const AppContextProvider = ({ children }: any) => {
  const { account, etherlink } = useTezos()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (etherlink?.isConnected) return setIsConnected(true)
    if (account === undefined || !account) {
      return setIsConnected(false)
    }
    return setIsConnected(true)
  }, [account, etherlink])

  const values = {
    isConnected,
    setIsConnected
  }

  return <DashboardContext.Provider value={values}>{children}</DashboardContext.Provider>
}
